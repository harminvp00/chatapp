import { Router } from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import RefreshMidldeware from "../../middlewares/RefreshMidldeware.js";
import { googleCallback, googleLogin } from "./auth.controller.js";

import {
  register,
  fetchUser,
  login,
  logout,
  refresh,
  getAvatar,
} from "./auth.controller.js";
import upload from "../../config/multer.js";

const router = Router();

router
  .get("/logout", logout)
  .get("/me", AuthMiddleware, fetchUser)
  .get("/avatar/:avatar_name", getAvatar)
  .get("/google/login", googleLogin)
  .get("/google/callback", googleCallback)
  .post("/register", upload.single("profileImage"), register)
  .post("/login", login)
  .post("/refresh", RefreshMidldeware, refresh);

export default router;
