import request from 'supertest';
import app from '../../../src/app.js';
import { registerUser } from './auth.helper.js';

/**
 * Get user profile
 */
export const getUserProfile = async (userToken) => {
  const userRes = await request(app)
    .get('/api/users/me')
    .set('Authorization', `Bearer ${userToken}`);
  return userRes;
};

/**
 * Update user profile details
 */
export const updateUserDetails = async (overrides = {}) => {
  let userToken = overrides.userToken;
  if (!userToken) {
    const registerRes = await registerUser();
    userToken = registerRes.body.data.token;
  }
  // Only include fields explicitly passed in overrides
  const { userToken: _, ...userData } = overrides;
  if (Object.keys(userData).length === 0) return;
  const userRes = await request(app)
    .put('/api/users/me')
    .set('Authorization', `Bearer ${userToken}`)
    .send(userData);
  return userRes;
};

/**
 * Update user password
 */
 export const updateUserPassword = async (userToken, oldPassword, newPassword) => {
   const userRes = await request(app)
    .put('/api/users/me/password')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ oldPassword, newPassword });
  return userRes;
 };