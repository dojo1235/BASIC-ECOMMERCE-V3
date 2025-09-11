import { ALLOWED_FIELDS } from '../../constants/admins/index.js';
import { mapAllowedFields } from '../../utils/field-mapper.util.js';
import { hashPassword } from '../../utils/password.util.js';
import { ensureEmailIsUnique } from '../shared/email.service.js';
import * as adminModel from '../../models/admins/admin.model.js';

// Get single admin
export const getAdminById = async (adminId) => {
  const admin = await adminModel.findAdminById(adminId);
  return { admin: admin };
};

// Update admin details
export const updateAdmin = async (adminId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.ADMIN.UPDATE);
  filteredData.updated_by = adminId;
  filteredData.updated_at = new Date();
  if (filteredData.email)
    await ensureEmailIsUnique(filteredData.email);
  if (filteredData.password)
    filteredData.password = await hashPassword(filteredData.password);
  await adminModel.updateAdmin(adminId, filteredData);
  const admin = await adminModel.findAdminById(adminId);
  return { admin: admin };
};