import { ALLOWED_FIELDS } from '../constants/index.js';
import { mapAllowedFields } from '../utils/field-mapper.util.js';
import { hashPassword } from '../utils/password.util.js';
import { ensureEmailIsUnique } from './shared/email.service.js';
import * as userModel from '../models/user.model.js';

// Get single user
export const getUserById = async (userId) => {
  const user = await userModel.findUserById(userId);
  return { user: user };
};

// Update user details
export const updateUser = async (userId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.USER.UPDATE);
  filteredData.updated_at = new Date();
  if (filteredData.email)
    await ensureEmailIsUnique(filteredData.email);
  if (filteredData.password)
    filteredData.password = await hashPassword(filteredData.password);
  await userModel.updateUser(userId, filteredData);
  const user = await userModel.findUserById(userId);
  return { user: user };
};