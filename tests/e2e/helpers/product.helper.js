import request from 'supertest';
import app from '../../../src/app.js';
import { loginSuperAdmin } from '../admins/helpers/super-admin.helper.js';
import { DEFAULT_TEST_PRODUCT } from '../constants.js';

/**
 * Login super admin & create product as a super admin & return product ID
 */
export const createProduct = async (overrides = {}) => {
  const loginRes = await loginSuperAdmin();
  const superAdminToken = loginRes.body.data.token;
  const productData = { ...DEFAULT_TEST_PRODUCT, ...overrides };
  const productRes = await request(app)
    .post('/api/admins/products')
    .set('Authorization', `Bearer ${superAdminToken}`)
    .send(productData);
  return productRes
};

/**
 * Get all products
 */
export const getAllproducts = async () => {
  const productsRes = await request(app)
    .get('/api/products');
  return productsRes;
};

/**
 * Get single product by product ID
 */
export const getProductById = async (testProductId) => {
  const productRes = await request(app)
    .get(`/api/products/${testProductId}`);
  return productRes;
};