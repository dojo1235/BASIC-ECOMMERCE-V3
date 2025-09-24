import { ALLOWED_FIELDS } from '../../constants/admins/index.js';
import { mapAllowedFields } from '../../utils/field-mapper.util.js';
import { ensureAdminIsFound, ensureRoleIsValid } from '../../utils/validators/admins/admin-validators.util.js';
import { hashPassword } from '../../utils/password.util.js';
import { sanitizeForSuperAdmin } from '../../utils/sanitize.util.js';
import { validateAndEnsureEmailIsUnique } from '../shared/email.service.js';
import * as superAdminModel from '../../models/admins/super-admin.model.js';

// Get all admins with search, filters & pagination (super admin)
export const getAllAdmins = async (query) => {
  const { admins, pagination } = await superAdminModel.getAllAdmins(query);
  return { admins: sanitizeForSuperAdmin(admins), pagination };
};

// Get single admin (super admin)
export const getAdminById = async (adminId) => {
  const admin = await superAdminModel.findAdminById(adminId);
  ensureAdminIsFound(admin);
  return { admin: sanitizeForSuperAdmin(admin) };
};

// Create new admin (super admin)
export const createAdmin = async (superId, payload) => {
  const filteredData = mapAllowedFields(payload, ALLOWED_FIELDS.SUPER_ADMIN.CREATE);
  filteredData.email = await validateAndEnsureEmailIsUnique(filteredData.email);
  if ('role' in filteredData)
    ensureRoleIsValid(filteredData.role);
  filteredData.created_by = superId;
  filteredData.password = await hashPassword(filteredData.password);
  const adminId = await superAdminModel.createAdmin(filteredData);
  const createdAdmin = await superAdminModel.findAdminById(adminId);
  return { admin: sanitizeForSuperAdmin(createdAdmin) };
};

// Update admin details (super admin)
export const updateAdmin = async (superId, adminId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.SUPER_ADMIN.UPDATE);
  const admin = await superAdminModel.findAdminById(adminId);
  ensureAdminIsFound(admin);
  filteredData.updated_by = superId;
  filteredData.updated_at = new Date();
  if ('email' in filteredData)
    filteredData.email = await validateAndEnsureEmailIsUnique(filteredData.email);
  if ('password' in filteredData)
    filteredData.password = await hashPassword(filteredData.password);
  if ('role' in filteredData)
    ensureRoleIsValid(filteredData.role);
  await superAdminModel.updateAdmin(adminId, filteredData);
  const updatedAdmin = await superAdminModel.findAdminById(adminId);
  return { admin: sanitizeForSuperAdmin(updatedAdmin) };
};

// Count admins with search & filters (super admin)
export const countAdmins = async (query) => {
  const count = await superAdminModel.countAdmins(query);
  return { adminsCount: count };
};