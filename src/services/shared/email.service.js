import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../../utils/app-error.js';
import { findAdminByEmail } from '../../models/admins/admin.model.js';
import { findUserByEmail } from '../../models/user.model.js';

/**
 * Ensures the email does not exist in admins or users.
 * Throws if email found in admins or users to enforce uniqueness.
 */
export const ensureEmailIsUnique = async (email) => {
  const [admin, user] = await Promise.all([
    findAdminByEmail(email),
    findUserByEmail(email)
  ]);
  if (admin || user) throw new AppError(
    MESSAGES.AUTH.EMAIL_IN_USE,
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.AUTH.EMAIL_IN_USE
  );
};