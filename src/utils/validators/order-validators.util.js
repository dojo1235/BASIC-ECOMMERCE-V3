import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../app-error.js';

/**
 * Throw if order not found when fetching order
 */
export const ensureOrderIsFound = (order) => {
  if (!order) throw new AppError(
    MESSAGES.ORDER.NOT_FOUND,
    HTTP_STATUS.BAD_REQUEST,
    ERROR_CODES.ORDER.NOT_FOUND
  );
};
