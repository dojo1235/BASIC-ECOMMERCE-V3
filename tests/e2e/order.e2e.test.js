import { beforeAll, describe, it, expect, afterAll } from 'vitest';
import db from '../../src/config/db.js';
import { MESSAGES, HTTP_STATUS } from '../../src/constants/index.js';
import { DEFAULT_TEST_USER, DEFAULT_TEST_PRODUCT } from './constants.js';
import { cleanupUserByEmail, cleanupProductByName } from './helpers/cleanup.helper.js';
import { registerUser } from './helpers/auth.helper.js';
import * as orderHelper from './helpers/order.helper.js';

let userToken;
let orderId;

beforeAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  const registerRes = await registerUser();
  userToken = registerRes.body.data.token;
});

describe('[E2E] Order API', () => {
  describe('POST /api/orders/checkout', () => {
    it('should place order from cart', async () => {
      const res = await orderHelper.placeOrder({ userToken, quantity: 5, contact: '+234 123456' });
      expect(res.status).toBe(HTTP_STATUS.CREATED);
      expect(res.body.message).toMatch(MESSAGES.ORDER.CREATE_SUCCESS);
      expect(res.body.data).toHaveProperty('shippingFee');
      expect(res.body.data.order).toHaveProperty('contact', '+234 123456');

      orderId = res.body.data.order.id;
    });
  });

  describe('GET /api/orders', () => {
    it('should get all orders for user', async () => {
      const res = await orderHelper.getUserOrders(userToken);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.ORDER.FETCH_ORDERS_SUCCESS);
      expect(res.body.data.orders).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: orderId })])
      );
    });
  });

  describe('GET /api/orders/:orderId', () => {
    it('should get single order for user', async () => {
      const res = await orderHelper.getUserOrderById(userToken, orderId);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.ORDER.FETCH_ORDER_SUCCESS);
      expect(res.body.data.order).toHaveProperty('id', orderId);
    });

    it('should fail getting single order with invalid order ID', async () => {
      const res = await orderHelper.getUserOrderById(userToken, 9999);
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.message).toMatch(MESSAGES.ORDER.NOT_FOUND);
    });
  });

  describe('DELETE /api/orders/:orderId', () => {
    it('should cancel an order for user', async () => {
      const res = await orderHelper.cancelOrder(userToken, orderId);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.ORDER.CANCEL_SUCCESS);
      expect(res.body.data.order).toHaveProperty('status', 'cancelled');
    });

    it('should fail cancelling order when status above pending or processing', async () => {
      const res = await orderHelper.cancelOrder(userToken, orderId);
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.message).toMatch(MESSAGES.ORDER.CANCEL_NOT_SUPPORTED);
    });

    it('should fail cancelling order with invalid order ID', async () => {
      const res = await orderHelper.cancelOrder(userToken, 9999);
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.message).toMatch(MESSAGES.ORDER.NOT_FOUND);
    });
  });
});

afterAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  await db.end();
});