import { Router } from "express";
import { googleLogin, googleCallback } from "./oauth.controller.js";

const router = Router();

router
  .get("/google/login", googleLogin)
  .get("/google/callback", googleCallback);


  

export default router;
