import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as userController from '../../controllers/admins/user.controller.js';

const router = Router();

// Everyone authenticated
router.use(authenticate);

// READ (all admins)
router.get('/', requireRole(ROLES.VIEW_ONLY_ADMIN), userController.getAllUsers);
router.get('/count/all', requireRole(ROLES.VIEW_ONLY_ADMIN), userController.countUsers);
router.get('/:userId', requireRole(ROLES.VIEW_ONLY_ADMIN), userController.getUserById);

// WRITE (only user manager or higher roles)
router.use(requireRole(ROLES.USER_MANAGER));

router.put('/:userId', userController.updateUserDetails);
router.put('/:userId/password', userController.updateUserPassword);
router.put('/:userId/ban', userController.banUser);
router.put('/:userId/unban', userController.unbanUser);
router.put('/:userId/restore', userController.restoreUser);
router.delete('/:userId', userController.deleteUser);

export default router;