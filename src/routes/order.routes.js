import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication for all routes below
router.use(authenticate);

router.get('/', orderController.getOrders);
router.get('/:orderId', orderController.getOrder);
router.post('/checkout', orderController.checkout);
router.delete('/:orderId', orderController.cancelOrder);

export default router;