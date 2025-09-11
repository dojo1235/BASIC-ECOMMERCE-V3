import { MESSAGES } from '../../constants/admins/index.js';
import { HTTP_STATUS } from '../../constants/index.js';
import { asyncHandler } from '../../middlewares/async-handler.middleware.js';
import { buildResponse } from '../../utils/response.util.js';
import * as adminService from "../../services/admins/admin.service.js";

// Get single admin
export const getAdminById = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await adminService.getAdminById(req.user.id),
      MESSAGES.ADMIN.FETCH_SUCCESS
  ));
});

// Update admin details
export const updateAdminDetails = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await adminService.updateAdmin(req.user.id, req.body),
      MESSAGES.ADMIN.UPDATE_SUCCESS
  ));
});