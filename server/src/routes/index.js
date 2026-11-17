

import { Router } from "express";
import authRouter from "../modules/authentication/auth.routes.js";
import chatRouter from "../modules/chat/chat.route.js"
const router = Router();

/* authentication routes */
router.use("/auth", authRouter);
router.use('/chat', chatRouter)

// exporting all the routes
export default router;
