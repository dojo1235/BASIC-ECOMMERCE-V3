import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as adminController from '../../controllers/admins/admin.controller.js';

const router = Router();

// Apply authentication and role check for all routes below
router.use(authenticate);
router.use(requireRole(ROLES.ALL_ADMINS));

router.get('/', adminController.getAdminById);
router.put('/', adminController.updateAdminDetails);

export default router;