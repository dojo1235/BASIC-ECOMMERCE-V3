import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import db from '../../src/config/db.js';
import { MESSAGES, HTTP_STATUS } from '../../src/constants/index.js';
import { DEFAULT_TEST_PRODUCT } from './constants.js';
import { cleanupProductByName } from './helpers/cleanup.helper.js';
import { createProduct, getAllproducts, getProductById } from './helpers/product.helper.js';

let testProductId;

beforeAll(async () => {
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  const productRes = await createProduct();
  testProductId = productRes.body.data.product.id;
});

describe('[E2E] Product API', () => {
  describe('GET /api/products', () => {
    it('should get all products with pagination', async () => {
      const res = await getAllproducts();
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.FETCH_PRODUCTS_SUCCESS);
      expect(res.body.data).toHaveProperty('products');
      expect(res.body.data.products).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: testProductId })])
      );
    });
  });

  describe('GET /api/products/:productId', () => {
    it('should get single product by product ID', async () => {
      const res = await getProductById(testProductId);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.FETCH_PRODUCT_SUCCESS);
      expect(res.body.data).toHaveProperty('product');
      expect(res.body.data.product).toHaveProperty('id', testProductId);
    });

    it('should fail when getting single product with non-existent product ID', async () => {
      const res = await getProductById(9999);
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.message).toMatch(MESSAGES.PRODUCT.NOT_FOUND);
    });
  });
});

afterAll(async () => {
  await cleanupProductByName(DEFAULT_TEST_PRODUCT.name);
  await db.end();
});