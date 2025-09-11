import { beforeAll, describe, it, expect, afterAll } from 'vitest';
import db from '../../src/config/db.js';
import { MESSAGES, HTTP_STATUS } from '../../src/constants/index.js';
import { DEFAULT_TEST_USER, DEFAULT_TEST_PRODUCT } from './constants.js';
import { cleanupUserByEmail, cleanupProductByName } from './helpers/cleanup.helper.js';
import { createProduct } from './helpers/product.helper.js';
import { registerUser } from './helpers/auth.helper.js';
import * as wishlistHelper from './helpers/wishlist.helper.js';

let userToken;
let productId;

beforeAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  const productRes = await createProduct();
  productId = productRes.body.data.product.id;
  const userRes = await registerUser();
  userToken = userRes.body.data.token;
});

describe('[E2E] Wishlist API', () => {
  describe('POST /api/wishlist/:productId', () => {
    it('should add a product to wishlist', async () => {
      const res = await wishlistHelper.addProductToWishlist({ userToken, productId });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.WISHLIST.ADD_SUCCESS);
    });

    it('should fail adding product to wishlist for non-existent product ID', async () => {
      const res = await wishlistHelper.addProductToWishlist({ userToken, productId: 9999});
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_FOUND);
    });
  });

  describe('GET /api/wishlist', () => {
    it('should get wishlist for user', async () => {
      const res = await wishlistHelper.getWishlist(userToken);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.WISHLIST.FETCH_SUCCESS);
      expect(res.body.data.wishlist).toEqual(
        expect.arrayContaining([expect.objectContaining({ productId })])
      );
    });
  });

  describe('GET /api/wishlist/count', () => {
    it('should count user wishlist items', async () => {
      const res = await wishlistHelper.countWishlistItems(userToken);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.WISHLIST.COUNT_SUCCESS);
      expect(res.body.data.wishlistCount).toBe(1);
    });
  });
  
  describe('DELETE /api/wishlist/:productId', () => {
    it('should remove a product from wishlist', async () => {
      const res = await wishlistHelper.removeProductFromWishlist(userToken, productId);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.WISHLIST.REMOVE_SUCCESS);
    });
  });
});

afterAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  await db.end();
});