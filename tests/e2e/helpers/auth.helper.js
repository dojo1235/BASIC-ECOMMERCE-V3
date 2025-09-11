import request from 'supertest';
import app from '../../../src/app.js';
import { DEFAULT_TEST_USER } from '../constants.js';

/**
 * Register new user
 */
export const registerUser = async (overrides = {}) => {
  const userData = { ...DEFAULT_TEST_USER, ...overrides };
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send(userData);
  return registerRes;
};


/**
 * Optionally register & login existing user
 */
export const loginUser = async (overrides = {}) => {
  // Merge defaults with overrides
  const userData = { ...DEFAULT_TEST_USER, ...overrides };
  // Register only if overrides object is empty
  if (Object.keys(overrides).length === 0) {
    await registerUser();
  }
  // Login using the merged data
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: userData.email,
      password: userData.password
    });
  return loginRes;
};