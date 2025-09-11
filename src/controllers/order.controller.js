import { MESSAGES, HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../middlewares/async-handler.middleware.js';
import { buildResponse } from '../utils/response.util.js';
import * as orderService from '../services/order.service.js';

// Get user orders
export const getOrders = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await orderService.getOrdersByUserId(req.user.id),
    MESSAGES.ORDER.FETCH_ORDERS_SUCCESS
  ));
});

// Get single order
export const getOrder = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await orderService.getOrderByOrderId(req.user.id, req.params.orderId),
    MESSAGES.ORDER.FETCH_ORDER_SUCCESS
  ));
});

// Place order
export const checkout = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.CREATED).json(buildResponse(
    await orderService.placeOrder(req.user.id, req.body),
    MESSAGES.ORDER.CREATE_SUCCESS
  ));
});

// Cancel order
export const cancelOrder = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await orderService.cancelOrder(req.user.id, req.params.orderId),
    MESSAGES.ORDER.CANCEL_SUCCESS
  ));
});