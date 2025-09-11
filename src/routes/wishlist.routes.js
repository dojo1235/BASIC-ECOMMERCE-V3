import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as wishlistController from '../controllers/wishlist.controller.js';

const router = express.Router();

// Apply authentication to all routes below
router.use(authenticate);

router.get('/', wishlistController.getWishlistByUserId);
router.get('/count', wishlistController.countWishlistItems);
router.post('/:productId', wishlistController.addProductToWishlist);
router.delete('/:productId', wishlistController.removeProductFromWishlist);

export default router;