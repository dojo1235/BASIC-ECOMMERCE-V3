import db from '../config/db.js';
import { MESSAGES, HTTP_STATUS, ORDER_STATUS, ERROR_CODES } from '../constants/index.js';
import { ensureOrderIsFound } from '../utils/validators/order-validators.util.js';
import { sanitizeForPublic } from '../utils/sanitize.util.js';
import { AppError } from '../utils/app-error.js';
import { getCartByUserId, clearCartByUserId } from '../models/cart.model.js';
import { getProductById, updateProductStockById } from '../models/product.model.js';
import * as orderItemModel from '../models/order-item.model.js';
import * as orderModel from '../models/order.model.js';

// Attach order items to each order and return orders for user
export const getOrdersByUserId = async (userId) => {
  const orders = await orderModel.getOrdersByUserId(userId);
  for (const order of orders) {
    order.items = await orderItemModel.getOrderItemsByOrderId(order.id);
  }
  return { orders: sanitizeForPublic(orders) };
};

// Get single order for user (with items)
export const getOrderByOrderId = async (userId, orderId) => {
  const order = await orderModel.getOrderByOrderId(userId, orderId);
  ensureOrderIsFound(order);
  order.items = await orderItemModel.getOrderItemsByOrderId(orderId);
  return { order: sanitizeForPublic(order) };
};

// place order with transaction, clear cart and decrement stock
export const placeOrder = async (userId, payload) => {
  const { contact, shippingAddress } = payload;
  // get cart
  const cart = await getCartByUserId(userId);
  if (!cart.length) {
    throw new AppError(
      MESSAGES.CART.NOT_FOUND,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.CART.NOT_FOUND
    );
  }
  // calculate total and validate stock
  let total = 0;
  for (const item of cart) {
    // item.stock is product stock (from joined product)
    if (item.quantity > item.stock) {
      throw new AppError(
        MESSAGES.CART.INSUFFICIENT_STOCK(item.name, item.stock),
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.CART.INSUFFICIENT_STOCK
      );
    }
    // ensure price is numeric
    const priceNum = parseFloat(item.price);
    total += priceNum * item.quantity;
  }
  // shipping logic
  const DISCOUNT_PRICE = 50;
  const SHIPPING_PRICE = 5;
  const shippingFee = total < DISCOUNT_PRICE ? SHIPPING_PRICE : 0;
  total += shippingFee;
  total = parseFloat(total.toFixed(2));
  // BEGIN TRANSACTION
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    // create order (returns insertId)
    const orderId = await orderModel.placeOrder(
      userId,
      total,
      contact,
      shippingAddress,
      connection
    );
    // insert order items and update product stock
    for (const item of cart) {
      const productId = item.product_id; // use product_id from cart join
      const quantity = item.quantity;
      const price = parseFloat(item.price);
      // create order item
      await orderItemModel.createOrderItem(
        orderId,
        productId,
        quantity,
        price,
        connection
      );
      // get current product (use connection)
      const product = await getProductById(productId, connection);
      // update stock
      await updateProductStockById(
        productId,
        product.stock - quantity,
        connection
      );
    }
    // clear cart for user
    await clearCartByUserId(userId, connection);
    // commit then release
    await connection.commit();
    connection.release();
    // fetch created order + items
    const order = await orderModel.getOrderByOrderId(userId, orderId);
    // if something weird happened, ensure existence
    ensureOrderIsFound(order);
    order.items = await orderItemModel.getOrderItemsByOrderId(orderId);
    return { order: sanitizeForPublic(order), shippingFee };
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
};

//  Cancel an order & restore stock and mark order cancelled
export const cancelOrder = async (userId, orderId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const order = await orderModel.getOrderByOrderId(userId, orderId, connection);
    ensureOrderIsFound(order);
    if (![ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING].includes(order.status)) {
      throw new AppError(
        MESSAGES.ORDER.CANCEL_NOT_SUPPORTED,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.ORDER.CANCEL_NOT_SUPPORTED
      );
    }
    const orderItems = await orderItemModel.getOrderItemsByOrderId(orderId, connection);
    for (const item of orderItems) {
      const product = await getProductById(item.product_id, connection);
      await updateProductStockById(
        item.product_id,
        product.stock + item.quantity,
        connection
      );
    }
    await orderModel.cancelOrderByOrderId(userId, orderId, connection);
    await connection.commit();
    connection.release();
    // Fetch and return the updated cancelled order
    const updatedOrder = await orderModel.getOrderByOrderId(userId, orderId);
    updatedOrder.items = await orderItemModel.getOrderItemsByOrderId(orderId);
    return { order: sanitizeForPublic(updatedOrder) };
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
};