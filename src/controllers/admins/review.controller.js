import { MESSAGES } from '../../constants/admins/index.js';
import { HTTP_STATUS } from '../../constants/index.js';
import { asyncHandler } from '../../middlewares/async-handler.middleware.js';
import { buildResponse } from '../../utils/response.util.js';
import * as reviewService from '../../services/admins/review.service.js';

// Get all reviews for a product
export const getAllReviewsByProductId = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await reviewService.getAllReviewsByProductId(req.user, req.params.productId, req.query),
    MESSAGES.REVIEW.FETCH_PRODUCT_REVIEWS_SUCCESS
  ));
});

// Get single review
export const getReviewById = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await reviewService.getReviewById(req.user, req.params.reviewId),
    MESSAGES.REVIEW.FETCH_SUCCESS
  ));
});

// Hide review from users
export const hideReview = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await reviewService.hideReview(req.user, req.params.reviewId),
    MESSAGES.REVIEW.HIDE_SUCCESS
  ));
});

// Restore review from users
export const restoreReview = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await reviewService.restoreReview(req.user, req.params.reviewId),
    MESSAGES.REVIEW.RESTORE_SUCCESS
  ));
});