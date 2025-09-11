import { MESSAGES, HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../middlewares/async-handler.middleware.js';
import { buildResponse } from '../utils/response.util.js';
import * as cartService from '../services/cart.service.js';

// Get user cart
export const getCart = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await cartService.getCartByUserId(req.user.id),
    MESSAGES.CART.FETCH_SUCCESS
  ));
});

// Add or update product quantity in cart if already added
export const addToCart = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await cartService.addOrIncrementCartItem(req.user.id, req.params.productId, req.body.quantity),
    MESSAGES.CART.ADD_SUCCESS
  ));
});

// Update cart product quantity
export const updateCartProductQuantity = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await cartService.updateCartProductQuantity(req.user.id, req.params.productId, req.body.quantity),
    MESSAGES.CART.UPDATE_SUCCESS
  ));
});

// Remove product from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await cartService.removeProductFromCart(req.user.id, req.params.productId),
    MESSAGES.CART.REMOVE_SUCCESS
  ));
});

// Count user cart items
export const countCartItems = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await cartService.countCartItems(req.user.id),
    MESSAGES.CART.COUNT_SUCCESS
  ));
});