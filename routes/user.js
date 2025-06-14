import express from "express";
import { myprofile, register } from "../controllers/user.js";
import { verifyUser } from "../controllers/user.js";
import { loginUser } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
// import { myprofile } from "../controllers/user.js";

const router = express.Router();

router.post("/user/register",register);

router.post("/user/verify",verifyUser);

router.post("/user/login",loginUser);

router.get("/user/me",isAuth,myprofile);

export default router;