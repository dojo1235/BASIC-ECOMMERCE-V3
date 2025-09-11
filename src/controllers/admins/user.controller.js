import { MESSAGES } from '../../constants/admins/index.js';
import { HTTP_STATUS } from '../../constants/index.js';
import { asyncHandler } from '../../middlewares/async-handler.middleware.js';
import { buildResponse } from '../../utils/response.util.js';
import * as userService from "../../services/admins/user.service.js";

// Get all users with search, filters & pagination
export const getAllUsers = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.getAllUsers(req.query),
      MESSAGES.ADMIN.FETCH_USERS_SUCCESS
  ));
});

// Get single user
export const getUserById = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.getUserById(req.params.userId),
      MESSAGES.ADMIN.FETCH_USER_SUCCESS
  ));
});

// Update user details
export const updateUserDetails = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.updateUser(req.user.id, req.params.userId, req.body),
      MESSAGES.ADMIN.UPDATE_USER_SUCCESS
  ));
});

// Ban users
export const banUser = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.updateUser(req.user.id, req.params.userId, { isBanned: true }),
      MESSAGES.ADMIN.BAN_USER_SUCCESS
  ));
});

// Restore banned users
export const unbanUser = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.updateUser(req.user.id, req.params.userId, { isBanned: false }),
      MESSAGES.ADMIN.UNBAN_USER_SUCCESS
  ));
});

// Soft-delete users
export const deleteUser = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.updateUser(req.user.id, req.params.userId, { isDeleted: true }),
      MESSAGES.ADMIN.DELETE_USER_SUCCESS
  ));
});

// Restore soft-deleted users
export const restoreUser = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.updateUser(req.user.id, req.params.userId, { isDeleted: false }),
      MESSAGES.ADMIN.RESTORE_USER_SUCCESS
  ));
});

// Count all users with search & filters (super admin)
export const countUsers = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.countUsers(req.query),
      MESSAGES.ADMIN.COUNT_USERS_SUCCESS
  ));
});