import { FIELDS_TO_REMOVE, ROLES } from '../constants/index.js';

/**
 * Converts snake_case keys to camelCase
 */
const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Remove blacklisted fields
 * Converts snake_case keys to camelCase
 * Serializes Dates to ISO strings
 */
const sanitize = (data, remove = []) => {
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item, remove));
  }
  if (data !== null && typeof data === "object") {
    if (data instanceof Date) return data.toISOString(); // handle dates
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

/**
 * Sanitize admins data by role e.g. super admin can see more while casual admins see less
 */
 export const sanitizeByRole = (admin, data) => {
  if (admin.role === ROLES.SUPER_ADMIN) {
    return sanitizeForSuperAdmin(data);
  }
  return sanitizeForAdmin(data);
};