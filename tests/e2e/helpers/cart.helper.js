import request from 'supertest';
import app from '../../../src/app.js';
import { registerUser } from './auth.helper.js';
import { createProduct } from './product.helper.js';
import { DEFAULT_TEST_CART } from '../constants.js';

/**
 * Optionally create product & register new user & add product to cart.
 * Returns the full cart response
 */
export const addProductToCart = async (overrides = {}) => {
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
  const cartData = { ...DEFAULT_TEST_CART, ...overrides };
  const cartRes = await request(app)
    .post(`/api/cart/${productId}`)
    .set('Authorization', `Bearer ${userToken}`)
    .send(cartData);
  return cartRes;
};

/**
 * Get user cart
 */
export const getCart = async (userToken) => {
  const cartRes = await request(app)
    .get('/api/cart')
    .set('Authorization', `Bearer ${userToken}`);
  return cartRes;
};

/**
 * Get cart items count
 */
export const countCartItems = async (userToken) => {
  const cartRes = await request(app)
    .get('/api/cart/count')
    .set('Authorization', `Bearer ${userToken}`);
  return cartRes;
};

/**
 * Update product quantity in cart
 */
export const updateCartItemQuantity = async (overrides = {}) => {
  // Create product if no productId provided
  let productId = overrides.productId;
  if (!productId) {
    const productRes = await createProduct();
    productId = productRes.body.data.product.id;
  }
  // Register user if no userToken provided
  let userToken = overrides.userToken;
  if (!userToken) {
    const registerRes = await registerUser();
    userToken = registerRes.body.data.token;
  }
  const cartData = { ...DEFAULT_TEST_CART, ...overrides };
  const cartRes = await request(app)
    .put(`/api/cart/${productId}`)
    .set('Authorization', `Bearer ${userToken}`)
    .send(cartData);
  return cartRes;
};

/**
 * Remove product from cart
 */
export const removeProductFromCart = async (userToken, productId) => {
  const cartRes = await request(app)
    .delete(`/api/cart/${productId}`)
    .set('Authorization', `Bearer ${userToken}`);
  return cartRes;
};