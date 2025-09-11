import db from '../../../src/config/db.js';

/**
 * Cleanup admin by email
 */
export const cleanupAdminByEmail = async (testAdminEmail) => {
  if (testUserEmail) {
    await db.query('DELETE FROM admins WHERE email = ?',
    [testAdminEmail]);
  }
};


/**
 * Cleanup user by email
 */
export const cleanupUserByEmail = async (testUserEmail) => {
  if (testUserEmail) {
    await db.query('DELETE FROM users WHERE email = ?',
    [testUserEmail]);
  }
};

/**
 * Cleanup product by name
 */
export const cleanupProductByName = async (testProductName) => {
  if (testProductName) {
    await db.query('DELETE FROM products WHERE name = ?',
    [testProductName]);
  }
};

/**
 * Cleanup product by ID
 */
export const cleanupProductById = async (testProductId) => {
  if (testProductId) {
    await db.query('DELETE FROM products WHERE id = ?',
    [testProductId]);
  }
};