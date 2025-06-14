import jwt from "jsonwebtoken";
import {User} from "../models/user.js";

export const isAuth= async (req, res, next) => {
  try{
    const token =req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "please login" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user=await User.findById(decoded._id)
    next();
  }
  catch(error) {
    console.error("isAuth Middleware Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }

}

export const isAdmin= async (req, res, next) => {
  try{
    if(req.user.role !== "admin"){
      return res.status(403).json({ message: "Access denied.... Not admin" });
    }
    next();
  }
  catch(error){
    console.error("isAdmin Middleware Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}