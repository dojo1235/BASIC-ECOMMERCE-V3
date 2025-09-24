import { beforeAll, describe, it, expect, afterAll } from 'vitest';
import db from '../../src/config/db.js';
import { MESSAGES, HTTP_STATUS } from '../../src/constants/index.js';
import { DEFAULT_TEST_USER, NEW_USER_NAME, NEW_USER_EMAIL, NEW_USER_PASSWORD } from './constants.js';
import { cleanupUserByEmail } from './helpers/cleanup.helper.js';
import { registerUser, loginUser } from './helpers/auth.helper.js';
import * as userHelper from './helpers/user.helper.js';

let userToken;

beforeAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupUserByEmail(NEW_USER_EMAIL);
  await registerUser();
});

describe('[E2E] User API', () => {
  describe('POST /api/auth/login', () => {
    it('should login user with old email and old password', async () => {
      const res = await loginUser({ email: DEFAULT_TEST_USER.email, password: DEFAULT_TEST_USER.password });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.AUTH.LOGIN_SUCCESS);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', DEFAULT_TEST_USER.email);

      userToken = res.body.data.token;
    });
  });

  describe('GET /api/user/me', () => {
    it('should get user profile', async () => {
      const res = await userHelper.getUserProfile(userToken);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.USER.FETCH_SUCCESS);
      expect(res.body.data.user).toHaveProperty('email', DEFAULT_TEST_USER.email);
    });
  });

  describe('PUT /api/user/me', () => {
    it('should update user name', async () => {
      const res = await userHelper.updateUserDetails({ userToken, name: NEW_USER_NAME });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.USER.UPDATE_SUCCESS);
      expect(res.body.data.user).toHaveProperty('name', NEW_USER_NAME);
    });

    it('should update user email', async () => {
      const res = await userHelper.updateUserDetails({ userToken, email: NEW_USER_EMAIL });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.USER.UPDATE_SUCCESS);
      expect(res.body.data.user).toHaveProperty('email', NEW_USER_EMAIL);
    });

    it('should fail updating user email to an email that already exists', async () => {
      const res = await userHelper.updateUserDetails({ userToken, email: NEW_USER_EMAIL });
      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_IN_USE);
    });
    
    it('should fail updating email to one that already exists regardless of email casing', async () => {
      const res = await userHelper.updateUserDetails({ userToken, email: NEW_USER_EMAIL.toUpperCase() });
      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_IN_USE);
    });

    it('should update user password', async () => {
      const res = await userHelper.updateUserPassword(userToken, DEFAULT_TEST_USER.password, NEW_USER_PASSWORD);
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.USER.UPDATE_PASSWORD_SUCCESS);
    });
    
    it('should fail updating user password when old password is incorrect', async () => {
      const res = await userHelper.updateUserPassword(userToken, DEFAULT_TEST_USER.password, NEW_USER_PASSWORD);
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(res.body.message).toMatch(MESSAGES.USER.INVALID_OLD_PASSWORD);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with the updated email and the updated password', async () => {
      const res = await loginUser({ email: NEW_USER_EMAIL, password: NEW_USER_PASSWORD });
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.message).toMatch(MESSAGES.AUTH.LOGIN_SUCCESS);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('name', NEW_USER_NAME);
      expect(res.body.data.user).toHaveProperty('email', NEW_USER_EMAIL);
    });

    it('should fail to login with old email', async () => {
      const res = await loginUser({ email: DEFAULT_TEST_USER.email, password: NEW_USER_PASSWORD });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_NOT_FOUND);
    });

    it('should fail to login with old password', async () => {
      const res = await loginUser({ email: NEW_USER_EMAIL, password: DEFAULT_TEST_USER.password });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(res.body.message).toMatch(MESSAGES.AUTH.INVALID_PASSWORD);
    });

    it('should fail to login with old email and old password', async () => {
      const res = await loginUser({ email: DEFAULT_TEST_USER.email, password: DEFAULT_TEST_USER.password });
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(res.body.message).toMatch(MESSAGES.AUTH.EMAIL_NOT_FOUND);
    });
  });
});

afterAll(async () => {
  await cleanupUserByEmail(DEFAULT_TEST_USER.email);
  await cleanupUserByEmail(NEW_USER_EMAIL);
  await db.end();
});