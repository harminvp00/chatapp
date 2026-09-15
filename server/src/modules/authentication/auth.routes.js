
import { Router } from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import RefreshMidldeware from "../../middlewares/RefreshMidldeware.js";
import { register, fetchUser, login, logout, refresh } from "./auth.controller.js";
import upload from '../../config/multer/multer.js';

const router = Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.post("/refresh", RefreshMidldeware, refresh);
router.get("/logout", logout);
router.get("/me", AuthMiddleware, fetchUser);

export default router;
