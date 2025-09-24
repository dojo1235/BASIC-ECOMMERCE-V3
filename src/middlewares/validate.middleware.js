/**
 * Validation middlware: throws if valid is not returned.
 */
import { AppError } from '../utils/app-error.js';

export const validate = (validatorFn) => {
  return (req, res, next) => {
    const result = validatorFn(req);

    if (!result.valid) {
      throw new AppError(result.message, 400, 'VALIDATION_ERROR');
    }

    next();
  };
};