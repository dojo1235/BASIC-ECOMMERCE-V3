import db from '../../config/db.js';

// Find admin by email
export const findAdminByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM admins WHERE email = ?',
    [email]);
  return rows[0] || null;
};

// Find admin by ID
export const findAdminById = async (adminId) => {
  const [rows] = await db.query(
    'SELECT * FROM admins WHERE id = ? AND is_deleted = false',
    [adminId]
  );
  return rows[0] || null;
};

// Update admin details
export const updateAdmin = async (adminId, updates) => {
  const [result] = await db.query(
    'UPDATE admins SET ? WHERE id = ? AND is_deleted = false',
    [updates, adminId]
  );
  return result.affectedRows > 0;
};

// Update admin password
export const updateAdminPassword = async (adminId, hashedPassword) => {
  const [result] = await db.query(
    'UPDATE admins SET password = ?, updated_by = ?, updated_at = NOW() WHERE id = ? AND is_deleted = false',
    [hashedPassword, adminId, adminId]
  );
  return result.affectedRows > 0;
};