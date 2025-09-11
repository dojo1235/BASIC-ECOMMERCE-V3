import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../../constants/index.js';
import { AppError } from '../app-error.js';

/**
 * Throw if product not found when fetching product
 */
export const ensureProductIsFound = (product) => {
  if (!product) throw new AppError(
    MESSAGES.PRODUCT.NOT_FOUND,
    HTTP_STATUS.NOT_FOUND,
    ERROR_CODES.PRODUCT.NOT_FOUND
  );
};

/**
 * Throws if stock is not enough when adding or updating cart quantity
 */
export const ensureStockIsSufficient = (quantity, stock) => {
  if (quantity > stock) throw new AppError(
    MESSAGES.PRODUCT.NOT_ENOUGH_STOCK,
    HTTP_STATUS.CONFLICT,
    ERROR_CODES.PRODUCT.NOT_ENOUGH_STOCK
  );
};