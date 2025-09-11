import request from 'supertest';
import app from '../../../src/app.js';
import { registerUser } from './auth.helper.js';
import { createProduct } from './product.helper.js';
import { addProductToCart } from './cart.helper.js';
import { DEFAULT_TEST_ORDER } from '../constants.js';

/**
 * Add product to cart (if needed) and place order.
 * Returns full response after checkout.
 */
export const placeOrder = async (overrides = {}) => {
  // Create product if no productId provided
  let productId = overrides.productId;
  if (!productId) {
    const productRes = await createProduct();
    productId = productRes.body.data.product.id;
  }
  // Register user if no userToken provided in overrides
  let userToken = overrides.userToken;
  if (!userToken) {
    const registerRes = await registerUser();
    userToken = registerRes.body.data.token;
  }
  const quantity = overrides.quantity || undefined;
  // Add product to cart
  await addProductToCart({ userToken, productId, quantity });
  // Merge default order data with any overrides
  const orderData = { ...DEFAULT_TEST_ORDER, ...overrides };
  // Place order
  const orderRes = await request(app)
    .post('/api/orders/checkout')
    .set('Authorization', `Bearer ${userToken}`)
    .send(orderData);
  return orderRes;
};

/**
 * Get all user orders
 */
 export const getUserOrders = async (userToken) => {
   const orderRes = await request(app)
    .get("/api/orders")
    .set("Authorization", `Bearer ${userToken}`);
  return orderRes;
 };
 
 /**
  * Get single user order by order ID
  */
  export const getUserOrderById = async (userToken, orderId) => {
    const orderRes = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${userToken}`);
    return orderRes;
 };
 
  /**
  * Cancel user order user order by order ID
  */
  export const cancelOrder = async (userToken, orderId) => {
    const orderRes = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${userToken}`);
    return orderRes;
 };