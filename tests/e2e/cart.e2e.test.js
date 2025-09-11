import { beforeAll, describe, it, expect, afterAll } from 'vitest';
import db from '../../src/config/db.js';
import { MESSAGES, HTTP_STATUS } from '../../src/constants/index.js';
import { DEFAULT_TEST_USER, DEFAULT_TEST_PRODUCT } from './constants.js';
import { cleanupUserByEmail, cleanupProductByName } from './helpers/cleanup.helper.js';
import { registerUser } from './helpers/auth.helper.js';
import * as cartHelper from './helpers/cart.helper.js';

let userToken;
let productId;

beforeAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  const userRes = await registerUser();
  userToken = userRes.body.data.token;
});

describe('[E2E] Cart API', () => {
  describe('POST /api/cart/:productId', () => {
    it('should add a product to cart', async () => {
      const res = await cartHelper.addProductToCart({ userToken, quantity: 2 });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.CART.ADD_SUCCESS);
      expect(res.body.data.cart).toEqual(
        expect.arrayContaining([expect.objectContaining({ quantity: 2 })])
      );
      productId = res.body.data.cart[0].productId;
    });

    it('should fail adding product when quantity exceeds stock', async () => {
      const res = await cartHelper.addProductToCart({ userToken, productId, quantity: 9999 });
      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_ENOUGH_STOCK);
    });

    it('should fail adding product for non-existent ID', async () => {
      const res = await cartHelper.addProductToCart({ userToken, productId: 9999, quantity: 2 });
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_FOUND);
    });
  });

  describe('GET /api/cart', () => {
    it('should get cart for user', async () => {
      const res = await cartHelper.getCart(userToken);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.CART.FETCH_SUCCESS);
      expect(res.body.data.cart).toEqual(
        expect.arrayContaining([expect.objectContaining({ productId })])
      );
    });
  });

  describe('GET /api/cart/count', () => {
    it('should count user cart items', async () => {
      const res = await cartHelper.countCartItems(userToken);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.CART.COUNT_SUCCESS);
      expect(res.body.data.cartCount).toBe(2);
    });
  });

  describe('PUT /api/cart/:productId', () => {
    it('should update quantity of a product in the cart', async () => {
      const res = await cartHelper.updateCartItemQuantity({ userToken, productId, quantity: 4 });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.CART.UPDATE_SUCCESS);
      expect(res.body.data.cart).toEqual(
        expect.arrayContaining([expect.objectContaining({ quantity: 4 })])
      );
    });

    it('should fail updating quantity for non-existent product ID', async () => {
      const res = await cartHelper.updateCartItemQuantity({ userToken, productId: 9999, quantity: 4 });
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_FOUND);
    });

    it('should fail updating quantity when it exceeds stock', async () => {
      const res = await cartHelper.updateCartItemQuantity({ userToken, productId, quantity: 9999 });
      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_ENOUGH_STOCK);
    });
  });

  describe('DELETE /api/cart/:productId', () => {
    it('should remove a product from the cart', async () => {
      const res = await cartHelper.removeProductFromCart(userToken, productId);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.CART.REMOVE_SUCCESS);
    });
  });
});

afterAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  await db.end();
});