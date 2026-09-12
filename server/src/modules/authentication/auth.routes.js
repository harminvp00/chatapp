
import { Router } from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import { register, fetchUser, login, logout } from "./auth.controller.js";
import upload from '../../config/multer/multer.js';

const router = Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login)
router.get("/logout", logout);
router.get("/me", AuthMiddleware, fetchUser);

export default router;
