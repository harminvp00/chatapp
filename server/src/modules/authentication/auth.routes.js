import { Router } from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import RefreshMidldeware from "../../middlewares/RefreshMidldeware.js";
import { googleCallback, googleLogin } from "./auth.controller.js";
import {
  passwordRegister,
  fetchUser,
  passowordLogin,
  logout,
  refresh,
  getAvatar,
} from "./auth.controller.js";
import upload from "../../config/multer.js";

const router = Router();

router
  .get("/me", AuthMiddleware, fetchUser)
  .get("/avatar/:avatar_name", getAvatar)
  .get("/google/login", googleLogin)
  .get("/google/callback", googleCallback)
  .get("/logout", logout)

  /** POST requests for save data to the database */
  .post("/register", upload.single("profileImage"), passwordRegister)
  .post("/login", passowordLogin)
  .post("/refresh", RefreshMidldeware, refresh);

export default router;
