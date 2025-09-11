import request from 'supertest';
import app from '../../../src/app.js';
import { registerUser } from './auth.helper.js';
import { createProduct } from './product.helper.js';
import { DEFAULT_TEST_REVIEW } from '../constants.js';

/**
 * Review a product for user
 */
export const addProductReview = async (overrides = {}) => {
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
  const reviewData = { ...DEFAULT_TEST_REVIEW, ...overrides };
  const reviewRes = await request(app)
    .post(`/api/products/${productId}/review`)
    .set('Authorization', `Bearer ${userToken}`)
    .send(reviewData);
  return reviewRes;
};

/**
 * Get all reviews for a product
 */
export const getReviewsByProductId = async (userToken, productId) => {
  const reviewRes = await request(app)
    .get(`/api/products/${productId}/reviews`)
    .set('Authorization', `Bearer ${userToken}`);
  return reviewRes;
};

/**
 * Get user review for a product
 */
export const getUserReview = async (userToken, productId) => {
  const reviewRes = await request(app)
    .get(`/api/products/${productId}/review`)
    .set('Authorization', `Bearer ${userToken}`);
  return reviewRes;
};

/**
 * Update product review for user
 */
export const updateProductReview = async (overrides = {}) => {
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
  const reviewData = { ...DEFAULT_TEST_REVIEW, ...overrides };
  const reviewRes = await request(app)
    .put(`/api/products/${productId}/review`)
    .set('Authorization', `Bearer ${userToken}`)
    .send(reviewData);
  return reviewRes;
};