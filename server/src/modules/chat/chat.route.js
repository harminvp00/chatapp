

import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import { Router } from 'express';
import {
    createConversation,
    listUserController
} from './chat.controller.js';


const router = Router();
router
    .get('/user/list', AuthMiddleware, listUserController)
    .post("/conversation/create", createConversation);

export default router;
