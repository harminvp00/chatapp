
import { Router } from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import { register, fetchUser } from "./auth.controller.js";
import upload from '../../config/multer/multer.js';

const router = Router();

router.post("/register", upload.single("profileImage"), register);
router.get("/me", AuthMiddleware, fetchUser);

export default router;
