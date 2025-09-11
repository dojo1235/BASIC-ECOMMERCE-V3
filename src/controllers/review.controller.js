import { MESSAGES, HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../middlewares/async-handler.middleware.js';
import { buildResponse } from '../utils/response.util.js';
import * as reviewService from '../services/review.service.js';

// Get user review
export const getUserReview = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await reviewService.getUserReview(req.user.id, req.params.productId),
    MESSAGES.REVIEW.FETCH_SUCCESS
  ));
});

// Add or update review if already added
export const addReview = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.CREATED).json(buildResponse(
    await reviewService.addOrUpdateReview(req.user.id, req.params.productId, req.body),
    MESSAGES.REVIEW.ADD_SUCCESS
  ));
});

// Update review or add if nor found
export const updateReview = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await reviewService.addOrUpdateReview(req.user.id, req.params.productId, req.body),
    MESSAGES.REVIEW.UPDATE_SUCCESS
  ));
});

// Get visible reviews for a product
export const getReviewsByProductId = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await reviewService.getReviewsByProductId(req.params.productId, req.query),
    MESSAGES.REVIEW.FETCH_PRODUCT_REVIEWS_SUCCESS
  ));
});