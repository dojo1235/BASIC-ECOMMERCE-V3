import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../../constants/index.js';
import { hashPassword, comparePassword } from '../../utils/password.util.js';
import { AppError } from '../app-error.js';

/**
 * Validate and converts email to lowercase
 */
 export const validateEmail = (email) => {
  if (!email || email.trim() === '') throw new AppError(
    MESSAGES.AUTH.EMAIL_MISSING,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.AUTH.EMAIL_MISSING
  );
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) throw new AppError(
    MESSAGES.AUTH.INVALID_EMAIL_FORMAT,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.AUTH.INVALID_EMAIL_FORMAT
  );
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail;
};

/**
 * Throw if password is weak
 */
const validateNewPassword = (newPassword) => {
  if (!newPassword || newPassword.trim() === '') throw new AppError(
    MESSAGES.USER.PASSWORD_MISSING,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.PASSWORD_MISSING
  );
  if (newPassword.length < 6) throw new AppError(
    MESSAGES.USER.PASSWORD_TOO_SHORT,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.PASSWORD_TOO_SHORT
  );
  if (!/[a-z]/.test(newPassword)) throw new AppError(
    MESSAGES.USER.PASSWORD_LOWERCASE_MISSING,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.PASSWORD_LOWERCASE_MISSING
  );
  if (!/[A-Z]/.test(newPassword)) throw new AppError(
    MESSAGES.USER.PASSWORD_UPPERCASE_MISSING,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.PASSWORD_UPPERCASE_MISSING
  );
  if (!/[0-9]/.test(newPassword)) throw new AppError(
    MESSAGES.USER.PASSWORD_NUMBER_MISSING,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.PASSWORD_NUMBER_MISSING
  );
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) throw new AppError(
    MESSAGES.USER.PASSWORD_SPECIALCHAR_MISSING,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.PASSWORD_SPECIALCHAR_MISSING
  );
};

/**
 * Throw if old password does not match database hashed password
 * Throw if new password is weak
 * Hash new password & return hashed password
 */
export const validateAndHashPassword = async (oldPassword, newPassword, hash) => {
  if (!oldPassword || oldPassword.trim() === '') throw new AppError(
    MESSAGES.USER.OLD_PASSWORD_MISSING,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.OLD_PASSWORD_MISSING
  );
  if (newPassword === oldPassword) throw new AppError(
    MESSAGES.USER.PASSWORD_UNCHANGED,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.USER.PASSWORD_UNCHANGED
  );
  validateNewPassword(newPassword);
  const isValidPassword = await comparePassword(oldPassword, hash);
  if (!isValidPassword) throw new AppError(
    MESSAGES.USER.INVALID_OLD_PASSWORD,
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.USER.INVALID_OLD_PASSWORD
  );
  const trimmedNewPassword = newPassword.trim();
  const hashedPassword = await hashPassword(trimmedNewPassword);
  return hashedPassword;
};