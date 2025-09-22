import { ensureProductIsFound } from '../../utils/validators/product-validators.util.js';
import { ensureReviewIsFound } from '../../utils/validators/review-validators.util.js';
import { sanitizeByRole } from '../../utils/sanitize.util.js';
import { getProductById } from '../../models/admins/product.model.js';
import * as reviewModel from '../../models/admins/review.model.js';

// Get all reviews for a product
export const getAllReviewsByProductId = async (admin, productId, query) => {
  ensureProductIsFound(await getProductById(productId));
  const { reviews, pagination } = await reviewModel.getAllReviewsByProductId(productId, query);
  return { reviews: sanitizeByRole(admin, reviews), pagination };
};

// Get single review by its ID
export const getReviewById = async (admin, reviewId) => {
  const review = await reviewModel.getReviewById(reviewId);
  ensureReviewIsFound(review);
  return { review: sanitizeByRole(admin, review) };
};

// Hide review
export const hideReview = async (admin, reviewId) => {
  ensureReviewIsFound(await reviewModel.getReviewById(reviewId));
  await reviewModel.hideReview(admin.id, reviewId);
  const updatedReview = await reviewModel.getReviewById(reviewId);
  return { review: sanitizeByRole(admin, updatedReview) };
};

// Restore hidden review
export const restoreReview = async (admin, reviewId) => {
  ensureReviewIsFound(await reviewModel.getReviewById(reviewId));
  await reviewModel.restoreReview(admin.id, reviewId);
  const updatedReview = await reviewModel.getReviewById(reviewId);
  return { review: sanitizeByRole(admin, updatedReview) };
};