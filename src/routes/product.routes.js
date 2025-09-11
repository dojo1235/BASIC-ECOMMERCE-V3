import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { validateProductSearch, validateProductId } from '../validations/product.validation.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as reviewController from '../controllers/review.controller.js';
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.get('/', validate(validateProductSearch), productController.getAllProducts);
router.get('/:productId', validate(validateProductId), productController.getProductById);

// Apply authentication for all routes below
router.use(authenticate);

router.get('/:productId/review', reviewController.getUserReview);
router.get('/:productId/reviews', reviewController.getReviewsByProductId);
router.post('/:productId/review', reviewController.addReview);
router.put('/:productId/review', reviewController.updateReview);

export default router;