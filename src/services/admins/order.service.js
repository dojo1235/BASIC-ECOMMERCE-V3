import { ensureUserIsFound } from '../../utils/validators/admins/user-validators.util.js';
import { ensureOrderIsFound } from '../../utils/validators/order-validators.util.js';
import { sanitizeByRole } from '../../utils/sanitize.util.js';
import { findUserById } from '../../models/admins/user.model.js';
import * as orderModel from '../../models/admins/order.model.js';

// Get all orders with search, filters & pagination
export const getAllOrders = async (admin, query) => {
  const { orders, pagination } = await orderModel.getAllOrders(query);
  return { orders: sanitizeByRole(admin, orders), pagination };
};

// Get all orders for a specific user
export const getOrdersByUserId = async (admin, userId, query) => {
  ensureUserIsFound(await findUserById(userId));
  const { orders, pagination } = await orderModel.getOrdersByUserId(userId, query);
  return { orders: sanitizeByRole(admin, orders), pagination };
};

// Get a single order by ID
export const getOrderByOrderId = async (admin, orderId) => {
  const order = await orderModel.getOrderByOrderId(orderId);
  ensureOrderIsFound(order);
  return { order: sanitizeByRole(admin, order) };
};

// Update order status
export const updateOrderStatus = async (admin, orderId, status) => {
  ensureOrderIsFound(await orderModel.getOrderByOrderId(orderId));
  await orderModel.updateOrderStatus(admin.id, orderId, status);
  const updatedOrder = await orderModel.getOrderByOrderId(orderId);
  return { order: sanitizeByRole(admin, updatedOrder) };
};

// Soft delete order
export const deleteOrder = async (admin, orderId) => {
  ensureOrderIsFound(await orderModel.getOrderByOrderId(orderId));
  await orderModel.deleteOrder(admin.id, orderId);
  const updatedOrder = await orderModel.getOrderByOrderId(orderId);
  return { order: sanitizeByRole(admin, updatedOrder) };
};

// Restore soft-deleted order
export const restoreOrder = async (admin, orderId) => {
  ensureOrderIsFound(await orderModel.getOrderByOrderId(orderId));
  await orderModel.restoreOrder(admin.id, orderId);
  const updatedOrder = await orderModel.getOrderByOrderId(orderId);
  return { order: sanitizeByRole(admin, updatedOrder) };
};