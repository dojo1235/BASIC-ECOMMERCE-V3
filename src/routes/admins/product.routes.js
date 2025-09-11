import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as productController from '../../controllers/admins/product.controller.js';
import * as reviewController from '../../controllers/admins/review.controller.js';

const router = Router();

// Apply authentication and role check for all routes below
router.use(authenticate);
router.use(requireRole(ROLES.PRODUCT_MANAGER));

router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:productId', productController.updateProductDetails);
router.put('/:productId/out-of-stock', productController.setProductToOutOfStock);
router.put('/:productId/in-stock', productController.setProductToInStock);
router.put('/:productId/discontinue', productController.discontinueProduct);
router.delete('/:productId', productController.deleteProduct);
router.put('/:productId/restore', productController.restoreProduct);
router.get('/count/all', productController.countProducts);

router.get('/:productId/reviews', reviewController.getAllReviewsByProductId);
router.get('reviews/:reviewId', reviewController.getReviewById);
router.put('/reviews/:reviewId/hide', reviewController.hideReview);

export default router;