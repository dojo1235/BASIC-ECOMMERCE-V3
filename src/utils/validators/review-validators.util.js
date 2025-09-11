import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../app-error.js';

/**
 * Throw if review not found when fetching review
 */
export const ensureReviewIsFound = (review) => {
  if (!review) throw new AppError(
    MESSAGES.REVIEW.NOT_FOUND,
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.REVIEW.NOT_FOUND
  );
};