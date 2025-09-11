import { ALLOWED_FIELDS } from '../../constants/admins/index.js';
import { mapAllowedFields } from '../../utils/field-mapper.util.js';
import { ensureUserIsFound } from '../../utils/validators/admins/user-validators.util.js';
import { hashPassword } from '../../utils/password.util.js';
import { ensureEmailIsUnique } from '../shared/email.service.js';
import * as userModel from '../../models/admins/user.model.js';

// Get all users with search, filters & pagination
export const getAllUsers = async (query) => {
  const { users, pagination } = await userModel.getAllUsers(query);
  return { users, pagination };
};

// Get single user
export const getUserById = async (userId) => {
  const user = await userModel.findUserById(userId);
  ensureUserIsFound(user);
  return { user: user };
};

// Update user details
export const updateUser = async (adminId, userId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.USER.UPDATE);
  const user = await userModel.findUserById(userId);
  ensureUserIsFound(user);
  filteredData.updated_by = adminId;
  filteredData.updated_at = new Date();
  if (filteredData.email)
    await ensureEmailIsUnique(filteredData.email);
  if (filteredData.password)
    filteredData.password = await hashPassword(filteredData.password);
  await userModel.updateUser(userId, filteredData);
  const updatedUser = await userModel.findUserById(userId);
  return { user: updatedUser };
};

// Count users with search & filters
export const countUsers = async (query) => {
  const count = await userModel.countUsers(query);
  return { usersCount: count };
};