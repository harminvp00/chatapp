

import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import { Router } from 'express';
import {
    listUserController
} from './chat.controller.js';


const router = Router();
router
    .get('/user/list', AuthMiddleware, listUserController)

export default router;
