

import { Router } from "express";
import authRouter from "../modules/authentication/auth.routes.js";
import oauthRouter from '../modules/oauth_accounts/oauth.route.js';
const router = Router();

/* authentication routes */
router.use("/auth", authRouter);
router.use('/auth', oauthRouter);

// exporting all the routes
export default router;
