import express from 'express';
import { checkout, fetchLecture, fetchLectures, getAllCourses, getSingleCourse, paymentVerification } from '../controllers/course.js';
import { isAuth } from '../middlewares/isAuth.js';
import { getMyCourses } from '../controllers/admin.js';

const router = express.Router();

router.get("/course/all",getAllCourses)
router.get("/course/:id",getSingleCourse)
router.get("/lectures/:id",isAuth,fetchLectures);
router.get("/lecture/:id",isAuth,fetchLecture);
router.post("/course/checkout/:id",isAuth,checkout);
router.post("/verification/:id",isAuth,paymentVerification);
router.get("/mycourses",isAuth,getMyCourses);

export default router;