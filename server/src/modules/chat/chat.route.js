

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
    .get('/user/search/:username',AuthMiddleware, searchUsersController)

    // Not fully implemeneted yet 
    .post('/user/conversation/create', createConversationController)

export default router;
