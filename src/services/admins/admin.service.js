import { ALLOWED_FIELDS } from '../../constants/admins/index.js';;
import { mapAllowedFields } from '../../utils/field-mapper.util.js';
import { validateAndHashPassword } from '../../utils/validators/user-validators.util.js';
import { sanitizeForAdmin } from '../../utils/sanitize.util.js';
import { validateAndEnsureEmailIsUnique } from '../shared/email.service.js';
import * as adminModel from '../../models/admins/admin.model.js';

// Get single admin
export const getAdminById = async (adminId) => {
  const admin = await adminModel.findAdminById(adminId);
  return { admin: sanitizeForAdmin(admin) };
};

// Update admin details
export const updateAdminDetails = async (adminId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.ADMIN.UPDATE);
  filteredData.updated_by = adminId;
  filteredData.updated_at = new Date();
  if ('email' in filteredData)
    filteredData.email = await validateAndEnsureEmailIsUnique(filteredData.email);
  await adminModel.updateAdmin(adminId, filteredData);
  const admin = await adminModel.findAdminById(adminId);
  return { admin: sanitizeForAdmin(admin) };
};

// Update admin password
export const updateAdminPassword = async (adminId, payload) => {
  const { oldPassword, newPassword } = payload;
  const admin = await adminModel.findAdminById(adminId);
  const hashedPassword = await validateAndHashPassword(oldPassword, newPassword, admin.password);
  await adminModel.updateAdminPassword(adminId, hashedPassword);
};