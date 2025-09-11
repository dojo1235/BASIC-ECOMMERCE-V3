import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as userController from '../../controllers/admins/user.controller.js';

const router = Router();

// Apply authentication and role check for all routes below
router.use(authenticate);
router.use(requireRole(ROLES.USER_MANAGER));

router.get('/', userController.getAllUsers);
router.get('/count/all', userController.countUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUserDetails);
router.put('/:userId/ban', userController.banUser);
router.put('/:userId/unban', userController.unbanUser);
router.put('/:userId/restore', userController.restoreUser);
router.delete('/:userId', userController.deleteUser);

export default router;