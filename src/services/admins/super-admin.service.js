import { ALLOWED_FIELDS } from '../../constants/admins/index.js';
import { mapAllowedFields } from '../../utils/field-mapper.util.js';
import { ensureAdminIsFound } from '../../utils/validators/admins/admin-validators.util.js';
import { hashPassword } from '../../utils/password.util.js';
import { ensureEmailIsUnique } from '../shared/email.service.js';
import * as superAdminModel from '../../models/admins/super-admin.model.js';

// Get all admins with search, filters & pagination (super admin)
export const getAllAdmins = async (query) => {
  const { admins, pagination } = await superAdminModel.getAllAdmins(query);
  return { admins, pagination };
};

// Get single admin (super admin)
export const getAdminById = async (adminId) => {
  const admin = await superAdminModel.findAdminById(adminId);
  ensureAdminIsFound(admin);
  return { admin: admin };
};

// Create new admin (super admin)
export const createAdmin = async (superId, payload) => {
  const filteredData = mapAllowedFields(payload, ALLOWED_FIELDS.SUPER_ADMIN.CREATE);
  await ensureEmailIsUnique(filteredData.email);
  filteredData.created_by = superId;
  filteredData.password = await hashPassword(filteredData.password);
  const adminId = await superAdminModel.createAdmin(filteredData);
  const createdAdmin = await superAdminModel.findAdminById(adminId);
  return { admin: createdAdmin };
};

// Update admin details (super admin)
export const updateAdmin = async (superId, adminId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.SUPER_ADMIN.UPDATE);
  const admin = await superAdminModel.findAdminById(adminId);
  ensureAdminIsFound(admin);
  filteredData.updated_by = superId;
  filteredData.updated_at = new Date();
  if (filteredData.email)
    await ensureEmailIsUnique(filteredData.email);
  if (filteredData.password)
    filteredData.password = await hashPassword(filteredData.password);
  await superAdminModel.updateAdmin(adminId, filteredData);
  const updatedAdmin = await superAdminModel.findAdminById(adminId);
  return { admin: updatedAdmin };
};

// Count admins with search & filters (super admin)
export const countAdmins = async (query) => {
  const count = await superAdminModel.countAdmins(query);
  return { adminsCount: count };
};