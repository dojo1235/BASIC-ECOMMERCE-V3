import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as orderController from '../../controllers/admins/order.controller.js';

const router = Router();

// Apply authentication and role check for all routes below
router.use(authenticate);
router.use(requireRole(ROLES.ORDER_MANAGER));

router.get('/', orderController.getAllOrders);
router.get('/user/:userId', orderController.getAllUserOrders);
router.get('/:orderId', orderController.getOrderByOrderId);
router.put('/:orderId/status', orderController.updateOrderStatus);

export default router;