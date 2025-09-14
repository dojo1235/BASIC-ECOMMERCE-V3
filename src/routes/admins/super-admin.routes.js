import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as superAdminController from '../../controllers/admins/super-admin.controller.js';

const router = Router();

// Apply authentication and role check for all routes below (Only super admin allowed)
router.use(authenticate);
router.use(requireRole(ROLES.SUPER_ADMIN));

router.get('/', superAdminController.getAllAdmins);
router.get('/count/all', superAdminController.countAdmins);
router.get('/:adminId', superAdminController.getAdminById);
router.post('/', superAdminController.createAdmin);
router.put('/:adminId', superAdminController.updateAdminDetails);
router.put('/:adminId/role', superAdminController.updateAdminRole);
router.put('/:adminId/ban', superAdminController.banAdmin);
router.put('/:adminId/unban', superAdminController.unbanAdmin);
router.put('/:adminId/restore', superAdminController.restoreAdmin);
router.delete('/:adminId', superAdminController.deleteAdmin);

export default router;