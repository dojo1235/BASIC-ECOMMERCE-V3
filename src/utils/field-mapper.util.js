import { MESSAGES, HTTP_STATUS, ERROR_CODES } from '../constants/index.js';
import { AppError } from './app-error.js';

/**
 * Filters + renames incoming object fields based on an allowed map.
 * Throws error immediately if the input contains disallowed keys.
**/
export const mapAllowedFields = (input, allowedMap) => {
  const output = {};
  const disallowedKeys = [];
  Object.keys(input).forEach((key) => {
    if (!allowedMap[key]) {
      disallowedKeys.push(key);
      return; // Guard clause: skip rest of loop
    }
    output[allowedMap[key]] = input[key];
  });
  if (disallowedKeys.length > 0) {
    throw new AppError(
      MESSAGES.GENERAL.FORBIDDEN(disallowedKeys),
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.GENERAL.FORBIDDEN
    );
  }
  return output;
};