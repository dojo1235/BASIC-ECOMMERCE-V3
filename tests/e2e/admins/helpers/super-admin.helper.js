import request from 'supertest';
import app from '../../../../src/app.js';
import { DEFAULT_TEST_ADMIN, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '../constants.js';

/**
 * Login already seeded super admin and return super admin token
 */
export const loginSuperAdmin = async (overrides = {}) => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      ...overrides, // allows swapping creds if needed
    });
  return loginRes;
};

/**
 * Super admin creates a new admin.
 * Returns the created admin response.
 */
export const createAdmin = async (overrides = {}) => {
  const res = await loginSuperAdmin();
  const superAdminToken = res.body.data.token;
  const adminData = { ...DEFAULT_TEST_ADMIN, ...overrides };
  const createRes = await request(app)
    .post('/api/admins/super')
    .set('Authorization', `Bearer ${superAdminToken}`)
    .send(adminData);
  return createRes;
};

/**
 * Super admin creates a new admin.
 * Then logs in as that admin and returns login response.
 */
export const loginAdmin = async (overrides = {}) => {
  const res = await loginSuperAdmin();
  const superAdminToken = res.body.data.token;

  const adminData = { ...DEFAULT_TEST_ADMIN, ...overrides };
  await request(app)
    .post('/api/admins/super')
    .set('Authorization', `Bearer ${superAdminToken}`)
    .send(adminData);
    
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: adminData.email,
      password: adminData.password,
    });
  return loginRes;
};

/**
 * Update admin details
 */
export const updateAdminDetails = async (superAdminToken, adminId, updates) => {
  const updateRes = await request(app)
    .put(`/api/admins/super/${adminId}`)
    .set('Authorization', `Bearer ${superAdminToken}`)
    .send(updates);
  return updateRes;
};

/**
 * Update admin role
 */
export const updateAdminRole = async (superAdminToken, adminId, adminRole) => {
  const roleUpdateRes = await request(app)
    .put(`/api/admins/super/${adminId}/role`)
    .set('Authorization', `Bearer ${superAdminToken}`)
    .send(adminRole);
  return roleUpdateRes;
};

/**
 * Get all admins with pagination
 */
export const getAllAdmins = async (superAdminToken) => {
  const adminsRes = await request(app)
    .get('/api/admins/super')
    .set('Authorization', `Bearer ${superAdminToken}`);
  return adminsRes;
};

/**
 * Get all admins count (total number of admins)
 */
export const countAdmins = async (superAdminToken) => {
  const adminsCountRes = await request(app)
    .get('/api/admins/super/count/all')
    .set('Authorization', `Bearer ${superAdminToken}`);
  return adminsCountRes;
};

/**
 * Get single admin details
 */
export const getAdminById = async (superAdminToken, adminId) => {
  const adminRes = await request(app)
    .get(`/api/admins/super/${adminId}`)
    .set('Authorization', `Bearer ${superAdminToken}`);
  return adminRes;
};

/**
 * Ban admin
 */
export const banAdmin = async (superAdminToken, adminId) => {
  const banRes = await request(app)
    .put(`/api/admins/super/${adminId}/ban`)
    .set('Authorization', `Bearer ${superAdminToken}`);
  return banRes;
};

/**
 * Unban admin
 */
export const unbanAdmin = async (superAdminToken, adminId) => {
  const unbanRes = await request(app)
    .put(`/api/admins/super/${adminId}/unban`)
    .set('Authorization', `Bearer ${superAdminToken}`);
  return unbanRes;
};

/**
 * Delete admin
 */
export const deleteAdmin = async (superAdminToken, adminId) => {
  const deleteRes = await request(app)
    .delete(`/api/admins/super/${adminId}`)
    .set('Authorization', `Bearer ${superAdminToken}`);
  return deleteRes;
};

/**
 * Restore admin
 */
export const restoreAdmin = async (superAdminToken, adminId) => {
  const restoreRes = await request(app)
    .put(`/api/admins/super/${adminId}/restore`)
    .set('Authorization', `Bearer ${superAdminToken}`);
  return restoreRes;
};