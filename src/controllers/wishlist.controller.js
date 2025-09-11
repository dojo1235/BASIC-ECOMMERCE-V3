import { MESSAGES, HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../middlewares/async-handler.middleware.js';
import { buildResponse } from '../utils/response.util.js';
import * as wishlistService from '../services/wishlist.service.js';

// Get all products in wishlist with pagination
export const getWishlistByUserId = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await wishlistService.getWishlistByUserId(req.user.id, req.query),
    MESSAGES.WISHLIST.FETCH_SUCCESS
  ));
});

// Add prosuct to wishlist
export const addProductToWishlist = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await wishlistService.addProductToWishlist(req.user.id, req.params.productId),
    MESSAGES.WISHLIST.ADD_SUCCESS
  ));
});

// Remove prosuct from wishlist
export const removeProductFromWishlist = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await wishlistService.removeProductFromWishlist(req.user.id, req.params.productId),
    MESSAGES.WISHLIST.REMOVE_SUCCESS
  ));
});

// Count products in wishlist
export const countWishlistItems = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await wishlistService.countWishlistItems(req.user.id),
    MESSAGES.WISHLIST.COUNT_SUCCESS
  ));
});