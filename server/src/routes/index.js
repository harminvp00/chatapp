

import { Router } from "express";
import authRouter from "../modules/authentication/auth.routes.js";
const router = Router();

/* authentication routes */
router.use("/auth", authRouter);

// exporting all the routes
export default router;
