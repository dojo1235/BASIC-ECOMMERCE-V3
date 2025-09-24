import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../../constants/index.js';
import { validateEmail } from '../../utils/validators/user-validators.util.js';
import { AppError } from '../../utils/app-error.js';
import { findAdminByEmail } from '../../models/admins/admin.model.js';
import { findUserByEmail } from '../../models/user.model.js';

/**
 * Ensures the email does not exist in admins or users.
 * Throws if email is invalid
 */
export const validateAndEnsureEmailIsUnique = async (email) => {
  const validEmail = validateEmail(email);
  const [admin, user] = await Promise.all([
    findAdminByEmail(validEmail),
    findUserByEmail(validEmail)
  ]);
  if (admin || user) throw new AppError(
    MESSAGES.AUTH.EMAIL_IN_USE,
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.AUTH.EMAIL_IN_USE
  );
  return validEmail;
};