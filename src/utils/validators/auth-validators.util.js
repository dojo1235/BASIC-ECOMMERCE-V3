import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../app-error.js';

/**
 * Throw for invalid or deleted or banned user
 */
export const ensureUserIsActive = (user) => {
  if (!user) throw new AppError(
    MESSAGES.AUTH.EMAIL_NOT_FOUND,
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.AUTH.EMAIL_NOT_FOUND
  );
  if (user.is_deleted) throw new AppError(
    MESSAGES.AUTH.USER_DELETED,
    HTTP_STATUS.FORBIDDEN,
    ERROR_CODES.AUTH.USER_DELETED
  );
  if (user.is_banned) throw new AppError(
    MESSAGES.AUTH.USER_BANNED,
    HTTP_STATUS.FORBIDDEN,
    ERROR_CODES.AUTH.USER_BANNED
  );
};

/**
 * Throw for invalid password after compared with bcryptjs
 */
export const ensurePasswordIsCorrect = (isValidPassword) => {
  if (!isValidPassword) throw new AppError(
    MESSAGES.AUTH.INVALID_PASSWORD,
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.AUTH.INVALID_PASSWORD
  );
};