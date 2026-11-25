

import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import { Router } from 'express';
import {
    createConversationController,
    getFriendsController,
    searchUsersController
} from './chat.controller.js';


const router = Router();
router
    .get('/user/friends', AuthMiddleware, getFriendsController)
    .get('/user/search/:username', AuthMiddleware, searchUsersController)
    .post('/user/conversation/create', AuthMiddleware, createConversationController)
    
export default router;
