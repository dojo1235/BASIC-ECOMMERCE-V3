import db from '../config/db.js';

// Find user by email
export const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]);
  return rows[0] || null;
};

// Find user by ID
export const findUserById = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE id = ? AND is_deleted = false',
    [userId]
  );
  return rows[0] || null;
};

// Create new user
export const createUser = async (data) => {
  const [result] = await db.query(
    'INSERT INTO users SET ?',
    [data]
  );
  return result.insertId;
};

// Update user details
export const updateUser = async (userId, updates) => {
  const [result] = await db.query(
    'UPDATE users SET ? WHERE id = ? AND is_deleted = false',
    [updates, userId]
  );
  return result.affectedRows > 0;
};

// Update user password
export const updateUserPassword = async (userId, hashedPassword) => {
  const [result] = await db.query(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ? AND is_deleted = false',
    [hashedPassword, userId]
  );
  return result.affectedRows > 0;
};