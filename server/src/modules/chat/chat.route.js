


import { Router } from 'express';
import {
    createConversation
} from './chat.controller.js';


const router = Router();
router.post("/conversation/create", createConversation);

export default router;
