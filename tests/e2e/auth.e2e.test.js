import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import db from '../../src/config/db.js';
import { MESSAGES, HTTP_STATUS } from '../../src/constants/index.js';
import { DEFAULT_TEST_USER, WRONG_EMAIL, WRONG_PASSWORD, NON_EXISTENT_EMAIL } from './constants.js';
import { cleanupUserByEmail } from './helpers/cleanup.helper.js';
import { registerUser, loginUser } from './helpers/auth.helper.js';

beforeAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
});

describe('[E2E] Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await registerUser();
      expect(res.status).toBe(HTTP_STATUS.CREATED);
      expect(res.body.message).toMatch(MESSAGES.AUTH.REGISTER_SUCCESS);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', DEFAULT_TEST_USER.email);
    });
    
    it('should fail to register with an existing email', async () => {
      const res = await registerUser();
      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_IN_USE);
    });
    
    it('should fail to register with an existing email regardless of email casing', async () => {
      const res = await registerUser({ email: DEFAULT_TEST_USER.email.toUpperCase() });
      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_IN_USE);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user and return JWT', async () => {
      const res = await loginUser({ email: DEFAULT_TEST_USER.email, password: DEFAULT_TEST_USER.password });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.AUTH.LOGIN_SUCCESS);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', DEFAULT_TEST_USER.email);
    });
    
    it('should login existing user and return JWT regardless of email casing', async () => {
      const res = await loginUser({ email: DEFAULT_TEST_USER.email.toUpperCase(), password: DEFAULT_TEST_USER.password });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.AUTH.LOGIN_SUCCESS);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', DEFAULT_TEST_USER.email);
    });
    
    it('should fail to login with wrong email', async () => {
      const res = await loginUser({ email: WRONG_EMAIL, password: DEFAULT_TEST_USER.password });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_NOT_FOUND);
    });
    
    it('should fail to login with wrong password', async () => {
      const res = await loginUser({ email: DEFAULT_TEST_USER.email, password: WRONG_PASSWORD });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(res.body.message).toMatch(MESSAGES.AUTH.INVALID_PASSWORD);
    });
    
    it('should fail to login for non-existent user', async () => {
      const res = await loginUser({ email: NON_EXISTENT_EMAIL, password: WRONG_PASSWORD });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_NOT_FOUND);
    });
  });
});

afterAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await db.end();
});