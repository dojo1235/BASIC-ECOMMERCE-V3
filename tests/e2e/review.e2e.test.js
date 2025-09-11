import { beforeAll, describe, it, expect, afterAll } from 'vitest';
import db from '../../src/config/db.js';
import { MESSAGES, HTTP_STATUS } from '../../src/constants/index.js';
import { DEFAULT_TEST_USER, DEFAULT_TEST_PRODUCT } from './constants.js';
import { cleanupUserByEmail, cleanupProductByName } from './helpers/cleanup.helper.js';
import { createProduct } from './helpers/product.helper.js';
import { registerUser } from './helpers/auth.helper.js';
import * as reviewHelper from './helpers/review.helper.js';

let userToken;
let reviewId;
let productId;
let anotherProductId;

beforeAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  const productRes = await createProduct();
  anotherProductId = productRes.body.data.product.id;
  const userRes = await registerUser();
  userToken = userRes.body.data.token;
});

describe('[E2E] Review API', () => {
  describe('POST /api/products/:productId/review', () => {
    it('should add review for a product', async () => {
      const res = await reviewHelper.addProductReview({ userToken, rating: 4 });
      expect(res.status).toBe(HTTP_STATUS.CREATED);
      expect(res.body.message).toMatch(MESSAGES.REVIEW.ADD_SUCCESS);
      expect(res.body.data.review).toHaveProperty('rating', 4);

      reviewId = res.body.data.review.id;
      productId = res.body.data.review.productId;
    });

    it('should fail adding review for non-existent product ID', async () => {
      const res = await reviewHelper.addProductReview({ userToken, productId: 9999 });
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_FOUND);
    });
  });

  describe('GET /api/products/:productId/reviews', () => {
    it('should get all reviews for a product', async () => {
      const res = await reviewHelper.getReviewsByProductId(userToken, productId);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.REVIEW.FETCH_PRODUCT_REVIEWS_SUCCESS);
      expect(res.body.data.reviews).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: reviewId })])
      );
    });
  });

  describe('GET /api/products/:productId/review', () => {
    it('should get single user review for a product', async () => {
      const res = await reviewHelper.getUserReview(userToken, productId);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.REVIEW.FETCH_SUCCESS);
      expect(res.body.data.review).toHaveProperty('id', reviewId);
    });
    
    it('should fail getting user review for product that user has not reviewed', async () => {
      const res = await reviewHelper.getUserReview(userToken, anotherProductId);
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.message).toMatch(MESSAGES.REVIEW.NOT_FOUND);
    });
  });

  describe('PUT /api/products/:productId/review', () => {
    it('should update user review for a product', async () => {
      const res = await reviewHelper.updateProductReview({ userToken, productId, rating: 2 });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.REVIEW.UPDATE_SUCCESS);
      expect(res.body.data.review).toHaveProperty('rating', 2);
      expect(res.body.data.review).toHaveProperty('id', reviewId);
    });

    it('should fail updating review for non-existent product ID', async () => {
      const res = await reviewHelper.updateProductReview({ userToken, productId: 9999 });
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_FOUND);
    });
  });
});

afterAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  await db.end();
});