import { ALLOWED_FIELDS, ROLES } from '../constants/index.js';
import { mapAllowedFields } from '../utils/field-mapper.util.js';
import { ensureUserIsActive, ensurePasswordIsCorrect } from '../utils/validators/auth-validators.util.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateToken } from '../utils/jwt.util.js';
import { sanitizeForPublic } from '../utils/sanitize.util.js';
import { ensureEmailIsUnique } from './shared/email.service.js';
import { findAdminByEmail, updateAdmin } from '../models/admins/admin.model.js';
import * as userModel from '../models/user.model.js';

// Register new user
export const registerUser = async (payload) => {
  const filteredData = mapAllowedFields(payload, ALLOWED_FIELDS.AUTH.CREATE);
  await ensureEmailIsUnique(filteredData.email);
  filteredData.password = await hashPassword(filteredData.password);
  filteredData.role = ROLES.USER;
  const userId = await userModel.createUser(filteredData);
  const user = await userModel.findUserById(userId);
  const token = generateToken({ id: user.id, role: user.role });
  return { token, user: sanitizeForPublic(user) };
};

// Login existing user
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await userModel.findUserByEmail(email) || await findAdminByEmail(email);
  ensureUserIsActive(user);
  ensurePasswordIsCorrect(await comparePassword(password, user.password));
  if (user.role !== ROLES.USER)
    await updateAdmin(user.id, { last_login: new Date() });
  if (user.role === ROLES.USER)
    await userModel.updateUser(user.id, { last_login: new Date() });
  const token = generateToken({ id: user.id, role: user.role });
  //console.log('Token:', token);
  return { token, user: sanitizeForPublic(user) };
};