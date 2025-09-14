import { MESSAGES, ERROR_CODES } from '../../../constants/admins/index.js';
import { HTTP_STATUS } from '../../../constants/index.js';
import { AppError } from '../../app-error.js';

/**
 * Throw if user not found when fetching user
 */
export const ensureUserIsFound = (user) => {
  if (!user) throw new AppError(
    MESSAGES.USER.NOT_FOUND,
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.USER.NOT_FOUND
  );
};