import { MESSAGES, ERROR_CODES } from '../../../constants/admins/index.js';
import { HTTP_STATUS } from '../../../constants/index.js';
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