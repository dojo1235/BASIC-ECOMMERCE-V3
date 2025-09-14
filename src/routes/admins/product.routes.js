import { Router } from 'express';
import { ROLES } from '../../constants/roles.constant.js';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import * as productController from '../../controllers/admins/product.controller.js';
import * as reviewController from '../../controllers/admins/review.controller.js';

const router = Router();

// Everyone authenticated
router.use(authenticate);

// READ (all admins)
router.get('/', requireRole(ROLES.VIEW_ONLY_ADMIN), productController.getAllProducts);
router.get('/:productId', requireRole(ROLES.VIEW_ONLY_ADMIN), productController.getProductById);
router.get('/count/all', requireRole(ROLES.VIEW_ONLY_ADMIN), productController.countProducts);

router.get('/:productId/reviews', requireRole(ROLES.VIEW_ONLY_ADMIN), reviewController.getAllReviewsByProductId);
router.get('/reviews/:reviewId', requireRole(ROLES.VIEW_ONLY_ADMIN), reviewController.getReviewById);

// WRITE (only product manager or higher roles)
router.use(requireRole(ROLES.PRODUCT_MANAGER));

router.post('/', productController.createProduct);
router.put('/:productId', productController.updateProductDetails);
router.put('/:productId/out-of-stock', productController.setProductToOutOfStock);
router.put('/:productId/in-stock', productController.setProductToInStock);
router.put('/:productId/discontinue', productController.discontinueProduct);
router.put('/:productId/restore', productController.restoreProduct);
router.delete('/:productId', productController.deleteProduct);

router.put('/reviews/:reviewId/hide', reviewController.hideReview);

export default router;