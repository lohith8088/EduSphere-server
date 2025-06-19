import Trycatch from "../middlewares/trycatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import {rm, stat } from "fs";
import { promisify } from "util";
import fs from "fs"
import { User } from "../models/user.js";
import cloudinary from "../middlewares/cloudinary.js";

export const CreateCourse = Trycatch(async (req, res) => {
  const { title, description, category, createdBY, duration, price } = req.body;

  const image = req.file;
  if (!image) return res.status(400).json({ message: "Image is required" });

  const priceNum = parseFloat(price);
  const durationNum = parseFloat(duration);
  if (isNaN(priceNum) || isNaN(durationNum)) {
    return res.status(400).json({ message: "Invalid price or duration" });
  }

  // Upload to Cloudinary
  const uploadImageToCloudinary = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "elearn/courses", resource_type: "image" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(image.buffer); 
    });

  const uploadedImage = await uploadImageToCloudinary();

  const course = await Courses.create({
    title,
    description,
    category,
    createdBY,
    duration: durationNum,
    price: priceNum,
    image: uploadedImage.secure_url,
  });

  res.status(201).json({ message: "Course created", course });
});


export const addLecture = Trycatch(async (req, res) => {
  const { title, description } = req.body;
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const file = req.file;
  if (!file) return res.status(400).json({ message: "Lecture video is required" });

  const uploadVideoToCloudinary = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "elearn/lectures", resource_type: "video" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

  const uploadedVideo = await uploadVideoToCloudinary();

  const lecture = await Lecture.create({
    title,
    description,
    video: uploadedVideo.secure_url,
    course: course._id,
  });

  res.status(201).json({ message: "Lecture added", lecture });
});





export const deleteLecture = Trycatch(async (req,res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });

  await lecture.deleteOne();
  res.status(200).json({
    message: "Lecture deleted successfully",
  });

})

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = Trycatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  //console.log("completed course found");

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const lectures = await Lecture.find({ course: course._id });
  //console.log("completed lecture found");
 // console.log("Lectures array:", lectures);

  if (!lectures || !Array.isArray(lectures)) {
    //console.warn("Lectures is null or not an array");
  } else {
    await Promise.all(
      lectures
        .filter((lecture) => lecture != null)
        .map(async (lecture) => {
          if (lecture.video) {
            try {
              await unlinkAsync(lecture.video);
              console.log("Deleted video");
            } catch (err) {
              console.error("Error deleting video:", err.message);
            }
          } else {
            console.warn("No video found for lecture:", lecture._id);
          }
        })
    );
  }

  if (course.image) {
    try {
      await unlinkAsync(course.image);
      console.log("Deleted image");
    } catch (err) {
      console.error("Error deleting image:", err.message);
    }
  }

  await Lecture.find({course:req.params.id}).deleteMany();
  await User.updateMany({}, { $pull: { subscription: req.params.id } });
  await course.deleteOne();

  res.json({ message: "Course deleted successfully" });
});


export const getAllStats=Trycatch(async(req,res)=>{
  const totalCourses=(await Courses.find()).length;
  const totallectures=(await Lecture.find()).length;
  const totalUsers=(await User.find()).length;
  

  const Stats={
    totalCourses,
    totallectures,
    totalUsers,
  }
  res.json({
    Stats
  })
})

export const getMyCourses = Trycatch(async(req,res)=>{
  const courses =await Courses.find({_id:req.user.subscription})

  res.json({
    courses,
  })
})
export const getAllUsers = Trycatch(async(req,res)=>{
  const users =await User.find({_id: { $ne: req.user._id } }).select("-password ");

  res.json({
    users,
  })

})

export  const UpdateRole= Trycatch(async(req,res)=>{
  const user = await User.findById(req.params.id);
  if(user.role === "user"){
    user.role = "admin";
    await user.save();
    return res.status(200).json({
      message: "User role updated to admin",
    });
  }
  if(user.role === "admin"){
    user.role = "user";
    await user.save();
    return res.status(200).json({
      message: "Admin role updated to user",
    });
  }
})