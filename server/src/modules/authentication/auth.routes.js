

import {
    register,
    fetchUser
} from './auth.controller.js';


import {Router} from 'express'
import AuthMiddleware from '../../middlewares/AuthMiddleware.js';

const router = Router();

router.post("/register", register);
router.get('/:me', AuthMiddleware, fetchUser);

export default router;