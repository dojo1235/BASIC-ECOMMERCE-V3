import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Apply authentication to all routes below
router.use(authenticate);

router.get('/', userController.getUserById);
router.put('/', userController.updateUserDetails);
router.put('/password', userController.updateUserPassword);

export default router;