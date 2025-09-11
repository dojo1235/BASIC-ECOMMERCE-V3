import request from 'supertest';
import app from '../../../src/app.js';
import { registerUser } from './auth.helper.js';
import { createProduct } from './product.helper.js';

/**
 * Optionally create product & register new user & add product to wishlist.
 */
export const addProductToWishlist = async (overrides = {}) => {
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
  const wishlistRes = await request(app)
    .post(`/api/wishlist/${productId}`)
    .set('Authorization', `Bearer ${userToken}`);
  return wishlistRes;
};

/**
 * Get user wishlist
 */
export const getWishlist = async (userToken) => {
  const wishlistRes = await request(app)
    .get('/api/wishlist')
    .set('Authorization', `Bearer ${userToken}`);
  return wishlistRes;
};

/**
 * Get wishlist items count
 */
export const countWishlistItems = async (userToken) => {
  const wishlistRes = await request(app)
    .get('/api/wishlist/count')
    .set('Authorization', `Bearer ${userToken}`);
  return wishlistRes;
};

/**
 * Remove product from wishlist
 */
export const removeProductFromWishlist = async (userToken, productId) => {
  const wishlistRes = await request(app)
    .delete(`/api/wishlist/${productId}`)
    .set('Authorization', `Bearer ${userToken}`);
  return wishlistRes;
};