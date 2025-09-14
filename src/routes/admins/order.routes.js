import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as orderController from '../../controllers/admins/order.controller.js';

const router = Router();

// Everyone authenticated
router.use(authenticate);

// READ (all admins)
router.get('/', requireRole(ROLES.VIEW_ONLY_ADMIN), orderController.getAllOrders);
router.get('/user/:userId', requireRole(ROLES.VIEW_ONLY_ADMIN), orderController.getAllUserOrders);
router.get('/:orderId', requireRole(ROLES.VIEW_ONLY_ADMIN), orderController.getOrderByOrderId);

// WRITE (only order manager or higher roles)
router.use(requireRole(ROLES.ORDER_MANAGER));

router.put('/:orderId/status', orderController.updateOrderStatus);

export default router;