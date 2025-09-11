import { MESSAGES, HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from '../middlewares/async-handler.middleware.js';
import { buildResponse } from '../utils/response.util.js';
import * as authService from '../services/auth.service.js';

export const registerUser = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.CREATED).json(buildResponse(
    await authService.registerUser(req.body),
    MESSAGES.AUTH.REGISTER_SUCCESS
  ));
});

export const loginUser = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
    await authService.loginUser(req.body),
    MESSAGES.AUTH.LOGIN_SUCCESS
  ));
});