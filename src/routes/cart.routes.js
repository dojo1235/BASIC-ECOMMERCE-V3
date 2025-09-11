import { Router } from "express";
import * as cartController from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication for all routes below
router.use(authenticate);

router.get('/', cartController.getCart);
router.get('/count', cartController.countCartItems);
router.post('/:productId', cartController.addToCart);
router.put('/:productId', cartController.updateCartProductQuantity);
router.delete('/:productId', cartController.removeFromCart);

export default router;