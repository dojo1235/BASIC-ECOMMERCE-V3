import { FIELDS_TO_REMOVE } from '../constants/roles.constant.js';

/**
 * Converts snake_case keys to camelCase
 */
const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  
/**
 * Remove blacklisted fields
 * Converts snake_case keys to camelCase
 */
 const sanitize = (data, remove = []) => {
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item, remove));
  }
  if (data !== null && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => !remove.includes(key)) // drop unwanted keys
        .map(([key, value]) => [toCamelCase(key), sanitize(value, remove)])
    );
  }
  return data;
};

/**
 * Remove blacklisted fields for super admins
 * Converts snake_case keys to camelCase
 */
export const sanitizeForSuperAdmin = (data) => sanitize(data, FIELDS_TO_REMOVE.SUPER_ADMIN);

/**
 * Remove blacklisted fields for admins
 * Converts snake_case keys to camelCase
 */
export const sanitizeForAdmin = (data) => sanitize(data, FIELDS_TO_REMOVE.ADMIN);

/**
 * Remove blacklisted fields for public users (customers)
 * Converts snake_case keys to camelCase
 */
export const sanitizeForPublic = (data) => sanitize(data, FIELDS_TO_REMOVE.PUBLIC);