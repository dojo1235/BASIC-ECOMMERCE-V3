import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as adminController from '../../controllers/admins/admin.controller.js';

const router = Router();

// Apply authentication and role check for all routes below
router.use(authenticate);
router.use(requireRole(ROLES.VIEW_ONLY_ADMIN));

router.get('/', adminController.getAdminById);
router.put('/', adminController.updateAdminDetails);
router.put('/password', adminController.updateAdminPassword);

export default router;