import { ensureUserIsFound } from '../../utils/validators/admins/user-validators.util.js';
import { ensureOrderIsFound } from '../../utils/validators/order-validators.util.js';
import { findUserById } from '../../models/admins/user.model.js';
import * as orderModel from '../../models/admins/order.model.js';

// Get all orders with search, filters & pagination
export const getAllOrders = async (query) => {
  const { orders, pagination } = await orderModel.getAllOrders(query);
  return { orders, pagination };
};

// Get all orders for a specific user
export const getOrdersByUserId = async (userId, query) => {
  ensureUserIsFound(await findUserById(userId));
  const { orders, pagination } = await orderModel.getOrdersByUserId(userId, query);
  return { orders, pagination };
};

// Get a single order by ID
export const getOrderByOrderId = async (orderId) => {
  const order = await orderModel.getOrderByOrderId(orderId);
  ensureOrderIsFound(order);
  return { order };
};

// Update order status
export const updateOrderStatus = async (adminId, orderId, status) => {
  ensureOrderIsFound(await orderModel.getOrderByOrderId(orderId));
  await orderModel.updateOrderStatus(adminId, orderId, status);
};