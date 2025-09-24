import { ALLOWED_FIELDS } from '../constants/index.js';
import { mapAllowedFields } from '../utils/field-mapper.util.js';
import { validateAndHashPassword } from '../utils/validators/user-validators.util.js';
import { sanitizeForPublic } from '../utils/sanitize.util.js';
import { validateAndEnsureEmailIsUnique } from './shared/email.service.js';
import * as userModel from '../models/user.model.js';

// Get single user
export const getUserById = async (userId) => {
  const user = await userModel.findUserById(userId);
  return { user: sanitizeForPublic(user) };
};

// Update user details
export const updateUserDetails = async (userId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.USER.UPDATE);
  filteredData.updated_at = new Date();
  if ('email' in filteredData)
    filteredData.email = await validateAndEnsureEmailIsUnique(filteredData.email);
  await userModel.updateUser(userId, filteredData);
  const user = await userModel.findUserById(userId);
  return { user: sanitizeForPublic(user) };
};

// Update user password
export const updateUserPassword = async (userId, payload) => {
  const { oldPassword, newPassword } = payload;
  const user = await userModel.findUserById(userId);
  const hashedPassword = await validateAndHashPassword(oldPassword, newPassword, user.password);
  await userModel.updateUserPassword(userId, hashedPassword);
};