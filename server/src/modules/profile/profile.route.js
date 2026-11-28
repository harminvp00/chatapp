
import { Router } from 'express';
// controllers 
import { profileUpdateController } from "./profile.controllers.js"

// middlewares
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";

const profileRouter = Router();

profileRouter
    .put('/update', AuthMiddleware, profileUpdateController);
    
export default profileRouter;