import { ensureProductIsFound } from '../../utils/validators/product-validators.util.js';
import { ensureReviewIsFound } from '../../utils/validators/review-validators.util.js';
import { getProductById } from '../../models/admins/product.model.js';
import * as reviewModel from '../../models/admins/review.model.js';

// Admin view: get all reviews (visible + hidden)
export const getAllReviewsByProductId = async (productId, query) => {
  ensureProductIsFound(await getProductById(productId));
  const { reviews, pagination } = await reviewModel.getAllReviewsByProductId(productId, query);
  return { reviews, pagination };
};

// Get single review by ID
export const getReviewById = async (reviewId) => {
  const review = await reviewModel.getReviewById(reviewId);
  ensureReviewIsFound(review);
  return { review };
};

// Hide review (admin only)
export const hideReview = async (reviewId) => {
  ensureReviewIsFound(await reviewModel.getReviewById(reviewId));
  await reviewModel.hideReview(reviewId);
};