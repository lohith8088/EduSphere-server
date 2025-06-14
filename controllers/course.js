import { instance } from "../index.js";
import Trycatch from "../middlewares/trycatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { Payment } from "../models/payment.js";
import { User } from "../models/user.js";
import crypto from 'crypto';

export const getAllCourses = Trycatch(async (req, res) =>{
  const courses = await Courses.find();
  res.status(200).json({
    message: "All courses",
    courses,
  });
})

export const getSingleCourse = Trycatch(async (req, res) => {
  const course =await Courses.findById(req.params.id)
  res.status(200).json({
    message: "Single course",
    course,
  });
})


export const fetchLectures = Trycatch(async (req, res) => {
  const lectures=await Lecture.find({course:req.params.id})
  const user =await User.findById(req.user._id)
  if(user.role === "admin"){
    return res.status(200).json({
      message: "All lectures",
      lectures,
    })
  }
  if(!user.subscription.includes(req.params.id)){
    return res.status(400).json({
      message: "Please subscribe to the course",
    })
  }
  res.json({
    message: "subscribed lectures",
    lectures,
  })
})

export const fetchLecture = Trycatch(async (req, res) => {
    const lecture=await Lecture.findById(req.params.id)
  const user =await User.findById(req.user._id)
  if(user.role === "admin"){
    return res.status(200).json({
      message: "lecture",
      lecture,
    })
  }
  if(!user.subscription.includes(lecture.course)){
    return res.status(400).json({
      message: "Please subscribe to the course",
    })
  }
  res.json({
    message: "subscribed lectures",
    lecture,
  })
})

export const checkout=Trycatch(async(req,res)=>{
  const user =await User.findById(req.user._id)

  const course =await Courses.findById(req.params.id)

  if(user.subscription.includes(course._id)){
    return res.status(400).json({
      message:"you already have this course",
    })
}

  const option ={
      amount:Number(course.price)*100,
      currency: "INR",
  } 
  const order=await instance.orders.create(option)

  res.status(201).json({
    order,
    course,
  })
})
export const paymentVerification = Trycatch(async(req,res)=>{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
  const body =razorpay_order_id+"|"+razorpay_payment_id;

  const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET
).update(body).digest("hex");
   const isAuthentic =expectedSignature===razorpay_signature;

  if(isAuthentic){
    await Payment.create({razorpay_order_id,razorpay_payment_id,razorpay_signature})

    const user= await User.findById(req.user._id);
    const course=await Courses.findById(req.params.id)
    user.subscription.push(course._id)

    await user.save()
    res.status(200).json({
      message: "payment successfull||Course Purchased",
    })
  }else{
    return res.status(400).json({
      message: "Invalid signature||Payment failed",
    })
  }


})

