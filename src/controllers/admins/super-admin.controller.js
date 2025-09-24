import { MESSAGES } from '../../constants/admins/index.js';
import { HTTP_STATUS } from '../../constants/index.js';
import { asyncHandler } from '../../middlewares/async-handler.middleware.js';
import { buildResponse } from '../../utils/response.util.js';
import * as superAdminService from "../../services/admins/super-admin.service.js";

// Get all admins with search, filters & pagination (super admin)
export const getAllAdmins = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.getAllAdmins(req.query),
      MESSAGES.SUPER_ADMIN.FETCH_ADMINS_SUCCESS
  ));
});

// Get single admin (super admin)
export const getAdminById = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.getAdminById(req.params.adminId),
      MESSAGES.SUPER_ADMIN.FETCH_ADMIN_SUCCESS
  ));
});

// Create new admin (super admin)
export const createAdmin = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.CREATED).json(buildResponse(
      await superAdminService.createAdmin(req.user.id, req.body),
      MESSAGES.SUPER_ADMIN.CREATE_ADMIN_SUCCESS
  ));
});

// Update admin details (super admin)
export const updateAdminDetails = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.updateAdmin(req.user.id, req.params.adminId, req.body),
      MESSAGES.SUPER_ADMIN.UPDATE_ADMIN_SUCCESS
  ));
});

// Update admin password (super admin)
export const updateAdminPassword = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.updateAdmin(req.user.id, req.params.adminId, req.body),
      MESSAGES.SUPER_ADMIN.UPDATE_ADMIN_PASSWORD_SUCCESS
  ));
});

// Change admin role (super admin)
export const updateAdminRole = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.updateAdmin(req.user.id, req.params.adminId, { role: req.body.role }),
      MESSAGES.SUPER_ADMIN.ADMIN_ROLE_UPDATE_SUCCESS
  ));
});

// Ban admin (super admin)
export const banAdmin = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.updateAdmin(req.user.id, req.params.adminId, { isBanned: true }),
      MESSAGES.SUPER_ADMIN.BAN_ADMIN_SUCCESS
  ));
});

// Restore banned admin (super admin)
export const unbanAdmin = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.updateAdmin(req.user.id, req.params.adminId, { isBanned: false }),
      MESSAGES.SUPER_ADMIN.UNBAN_ADMIN_SUCCESS
  ));
});

// Soft-delete admin (super admin)
export const deleteAdmin = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.updateAdmin(req.user.id, req.params.adminId, { isDeleted: true }),
      MESSAGES.SUPER_ADMIN.DELETE_ADMIN_SUCCESS
  ));
});

// Restore soft-deleted admin (super admin)
export const restoreAdmin = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.updateAdmin(req.user.id, req.params.adminId, { isDeleted: false }),
      MESSAGES.SUPER_ADMIN.RESTORE_ADMIN_SUCCESS
  ));
});

// Count all admins with search & filters (super admin)
export const countAdmins = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await superAdminService.countAdmins(req.query),
      MESSAGES.SUPER_ADMIN.COUNT_ADMINS_SUCCESS
  ));
});