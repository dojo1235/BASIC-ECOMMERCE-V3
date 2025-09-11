import db from '../../config/db.js';
import { buildFilters, getPagination } from '../../utils/query.util.js';

// Build admin filter for status, deleted flag, & role
const buildAdminFilters = (search, filters = {}) => {
  let { where, params } = buildFilters(search, filters);
  if (filters.status === 'active') {
    where += (where ? ' AND' : ' WHERE') + ' is_deleted = false';
  }
  if (filters.status === 'deleted') {
    where += (where ? ' AND' : ' WHERE') + ' is_deleted = true';
  }
  if (filters.role) {
    where += (where ? ' AND' : ' WHERE') + ' role = ?';
    params.push(filters.role);
  }
  return { where, params };
};

// Get all admin and count with pagination
export const getAllAdmins = async (query) => {
  const search = query.search || '';
  const filters = {
    status: query.status || '',
    role: query.role || '',
  };
  const page = query.page || 1;
  const pageSize = query.pageSize || 20;

  const { where, params } = buildAdminFilters(search, filters);
  const { limit, offset } = getPagination(page, pageSize);
  
  // Fetch paginated admins
  const sql = `SELECT * FROM admins ${where} LIMIT ? OFFSET ?`;
  const [admins] = await db.query(sql, [...params, limit, offset]);

  // Fetch total count
  const countSql = `SELECT COUNT(*) AS total FROM admins ${where}`;
  const [countRows] = await db.query(countSql, params);
  const total = countRows[0].total;

  return {
    admins,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const findAdminById = async (adminId) => {
  const [rows] = await db.query(
    'SELECT * FROM admins WHERE id = ?',
    [adminId]
  );
  return rows[0] || null;
};

export const createAdmin = async (data) => {
  const [result] = await db.query(
    'INSERT INTO admins SET ?',
    [data]
  );
  return result.insertId;
};

export const updateAdmin = async (adminId, updates) => {
  const [result] = await db.query(
    'UPDATE admins SET ? WHERE id = ?',
    [updates, adminId]
  );
  return result.affectedRows > 0;
};

export const countAdmins = async (query) => {
  const search = query.search || '';
  const filters = {
    status: query.status || '',
    role: query.role || '',
  };
  const { where, params } = buildAdminFilters(search, filters);
  const sql = `SELECT COUNT(*) AS total FROM admins ${where}`;
  const [rows] = await db.query(sql, params);
  return rows[0].total;
};