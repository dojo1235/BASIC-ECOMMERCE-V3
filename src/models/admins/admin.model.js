import db from '../../config/db.js';

export const findAdminByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM admins WHERE email = ?',
    [email]);
  return rows[0] || null;
};

export const findAdminById = async (adminId) => {
  const [rows] = await db.query(
    'SELECT * FROM admins WHERE id = ? AND is_deleted = false',
    [adminId]
  );
  return rows[0] || null;
};

export const updateAdmin = async (adminId, updates) => {
  const [result] = await db.query(
    'UPDATE admins SET ? WHERE id = ? AND is_deleted = false',
    [updates, adminId]
  );
  return result.affectedRows > 0;
};