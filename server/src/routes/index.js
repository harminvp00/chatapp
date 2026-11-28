

import { Router } from "express";
const router = Router();

// routes from diffrent modules 
import authRouter from "../modules/authentication/auth.routes.js";
import chatRouter from "../modules/chat/chat.route.js"
import profileRouter from "../modules/profile/profile.route.js";

// define routes 
router
    .use("/auth", authRouter)
    .use('/chat', chatRouter)
    .use('/profile', profileRouter)

export default router;
