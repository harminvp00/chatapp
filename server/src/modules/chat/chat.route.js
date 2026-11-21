

import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import { Router } from 'express';
import {
    listUserController,
    searchUsersController
} from './chat.controller.js';


const router = Router();
router
    .get('/user/list', AuthMiddleware, listUserController)
    .get('/user/search/:username', searchUsersController)

export default router;
