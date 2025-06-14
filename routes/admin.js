import express from 'express';
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import { addLecture, CreateCourse, deleteCourse, deleteLecture, getAllStats, getAllUsers, getMyCourses, UpdateRole } from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/Multer.js';

const router = express.Router();

router.post("/course/new",isAuth,isAdmin,uploadFiles,CreateCourse)

router.post("/course/:id",isAuth,isAdmin,uploadFiles,addLecture)

router.delete("/lecture/:id",isAuth,isAdmin,deleteLecture);
router.delete("/course/:id",isAuth,isAdmin,deleteCourse)

router.get("/stats",isAuth,isAdmin,getAllStats);
router.get("/mycourses",isAuth,getMyCourses);
router.put("/user/:id", isAuth, isAdmin, UpdateRole );
router.get("/users", isAuth, isAdmin, getAllUsers );

export default router;