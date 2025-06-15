import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken";
import sendmail, { sendForgotMail }  from "../middlewares/sendMail.js";
import Trycatch from "../middlewares/trycatch.js";

export const register = async (req, res) => {
  try{
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    user= {
      name,
      email,
      password: hashedPassword,
    };

    const otp= Math.floor(Math.random()*1000000);

    const activationToken =jwt.sign({
      user,
      otp,
    },process.env.Activation_Secret, {
      expiresIn: "5m",
    })
const data ={
  name,
  otp,
};

await sendmail(email, "Verify your email", data);
res.status(200).json({
  message: "otp sent to your email",
  activationToken,})

    // const userData = await User.create(user);
    // res.status(201).json({
    //   message: "User registered successfully",
    //   user: userData,
    //   activationToken,
    // });

  }catch (error) {

  console.error("Register Controller Error:", error); 
  res.status(500).json({ message: "Internal server error", error: error.message });
  }

}
export const verifyUser = Trycatch(async (req, res) => {
  const {otp, activationToken} = req.body;

  const Verify =jwt.verify(activationToken, process.env.Activation_Secret);

  if (!Verify) {
    return res.status(400).json({ message: "otp expired" });
  }

  if (Verify.otp !== otp) {
    return res.status(400).json({ message: "Invalid otp" });
  }

  await User.create({
    name: Verify.user.name,
    email: Verify.user.email,
    password: Verify.user.password,
  });

  res.json({
    message: "User registered successfully",
  });
})

export const loginUser = Trycatch(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email " });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Generate token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

  // Don't send password in response
  const { password: _, ...userData } = user._doc;

  res.json({
    message: `Login successful... Welcome ${user.name}`,
    token,
    user: userData,
  });
});

export const myprofile=Trycatch(async(req,res)=>{
    const user= await User.findById(req.user._id)

    res.json({
        message:"User profile",
        user,
    })
})

export const forgotPassword = Trycatch(async(req,res)=>{
  const {email}=req.body
  const user=await User.findOne({email})
  if(!user){return res.status(400).json({
    message:"User not found",
  })}

  const token=jwt.sign({email},process.env.Forget_secret)

  const data ={email,token};

  await sendForgotMail(email,"EduSphere",data)
  user.resetPasswordExpire =Date.now()+5*60*1000;

  await user.save()

res.json({
  message:"Resent password link is sent to your email",
})})


export const resetPassword =Trycatch(async(req,res)=>{
  const decodedData =jwt.verify(req.query.token,process.env.Forget_secret);

  const user =await User.findOne({email:decodedData.email});

  if(!user) return res.status(404).json({
    message:"User not found",
  })

  if(user.resetPasswordExpire===null) return res.status(400).json({
    message:"Password reset link is expired",
  })
  if(user.resetPasswordExpire < Date.now()){
    return res.status(400).json({
      message:"Password reset link is expired",
    })
  }

  const password =await bcrypt.hash(req.body.password,10)
  user.password =password
  user.resetPasswordExpire=null;
  await user.save()
  res.json({
    message:"Password reset successfully", 
  })
})