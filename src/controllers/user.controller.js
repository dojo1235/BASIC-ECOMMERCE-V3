import { MESSAGES, HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../middlewares/async-handler.middleware.js';
import { buildResponse } from '../utils/response.util.js';
import * as userService from "../services/user.service.js";

// Get single user
export const getUserById = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.getUserById(req.user.id),
      MESSAGES.USER.FETCH_SUCCESS
  ));
});

// Update user details
export const updateUserDetails = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.updateUserDetails(req.user.id, req.body),
      MESSAGES.USER.UPDATE_SUCCESS
  ));
});

// Update user password
export const updateUserPassword = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await userService.updateUserPassword(req.user.id, req.body),
      MESSAGES.USER.UPDATE_PASSWORD_SUCCESS
  ));
});