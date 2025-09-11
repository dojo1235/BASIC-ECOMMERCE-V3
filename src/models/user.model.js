import db from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]);
  return rows[0] || null;
};

export const findUserById = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE id = ? AND is_deleted = false',
    [userId]
  );
  return rows[0] || null;
};

export const createUser = async (data) => {
  const [result] = await db.query(
    'INSERT INTO users SET ?',
    [data]
  );
  return result.insertId;
};

export const updateUser = async (userId, updates) => {
  const [result] = await db.query(
    'UPDATE users SET ? WHERE id = ? AND is_deleted = false',
    [updates, userId]
  );
  return result.affectedRows > 0;
};