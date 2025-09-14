import { MESSAGES } from '../../constants/admins/index.js';
import { HTTP_STATUS } from '../../constants/index.js';
import { asyncHandler } from '../../middlewares/async-handler.middleware.js';
import { buildResponse } from '../../utils/response.util.js';
import * as orderService from '../../services/admins/order.service.js';

// GET all orders with search, filters & pagination
export const getAllOrders = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await orderService.getAllOrders(req.user, req.query),
      MESSAGES.ORDER.FETCH_ORDERS_SUCCESS
  ));
});

// GET all orders for a specific user with search, filters and pagination
export const getAllUserOrders = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await orderService.getOrdersByUserId(req.user, req.params.userId, req.query),
      MESSAGES.ORDER.FETCH_USER_ORDERS_SUCCESS
  ));
});

// GET single order by ID
export const getOrderByOrderId = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await orderService.getOrderByOrderId(req.user, req.params.orderId),
      MESSAGES.ORDER.FETCH_ORDER_SUCCESS
  ));
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await orderService.updateOrderStatus(req.user, req.params.orderId, req.body.status),
      MESSAGES.ORDER.STATUS_UPDATE_SUCCESS
  ));
});