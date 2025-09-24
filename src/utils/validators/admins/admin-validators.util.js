import { MESSAGES, ERROR_CODES } from '../../../constants/admins/index.js';
import { HTTP_STATUS, ROLES } from '../../../constants/index.js';
import { AppError } from '../../app-error.js';

/**
 * Throw if admin not found when fetching admin
 */
export const ensureAdminIsFound = (admin) => {
  if (!admin) throw new AppError(
    MESSAGES.ADMIN.NOT_FOUND,
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.ADMIN.NOT_FOUND
  );
};

/**
 * Throws if invalid role tries to sneak in when creating new admin
 */
export const ensureRoleIsValid = (role) => {
  const validRoles = Object.values(ROLES);
  if (!validRoles.includes(role)) throw new AppError(
    MESSAGES.ADMIN.INVALID_ROLE,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.ADMIN.INVALID_ROLE
  );
};