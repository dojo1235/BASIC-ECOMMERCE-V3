import { ensureProductIsFound } from '../utils/validators/product-validators.util.js';
import { ensureReviewIsFound } from '../utils/validators/review-validators.util.js';
import { sanitizeForPublic } from '../utils/sanitize.util.js';
import { getProductById } from '../models/product.model.js';
import * as reviewModel from '../models/review.model.js';

/**
 * Fetch user review helper
 */
const fetchUserReview = async (userId, productId) => {
  const review = await reviewModel.getReviewByUserAndProductId(userId, productId);
  return review;
};

// Get user review
export const getUserReview = async (userId, productId) => {
  ensureProductIsFound(await getProductById(productId));
  const review = await fetchUserReview(userId, productId);
  ensureReviewIsFound(review);
  return { review: sanitizeForPublic(review) };
};

// Add or update review
export const addOrUpdateReview = async (userId, productId, payload) => {
  const { rating, comment } = payload;
  ensureProductIsFound(await getProductById(productId));
  const existing = await fetchUserReview(userId, productId);
  if (existing) {
    await reviewModel.updateReview(userId, productId, rating, comment);
  } else {
    await reviewModel.addReview(userId, productId, rating, comment);
  }
  const review = await fetchUserReview(userId, productId);
  return { review: sanitizeForPublic(review) };
};

// Get all visible reviews for a product with pagination
export const getReviewsByProductId = async (productId, query) => {
  ensureProductIsFound(await getProductById(productId));
  const { reviews, pagination } = await reviewModel.getReviewsByProductId(productId, query);
  return { reviews: sanitizeForPublic(reviews), pagination };
};