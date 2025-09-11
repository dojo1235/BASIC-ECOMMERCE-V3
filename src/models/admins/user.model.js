import db from '../../config/db.js';
import { buildFilters, getPagination } from '../../utils/query.util.js';

// Build user filter for status & deleted flag
const buildUserFilters = (search, filters = {}) => {
  let { where, params } = buildFilters(search, filters);
  if (filters.status === 'active') {
    where += (where ? ' AND' : ' WHERE') + ' is_deleted = false';
  }
  if (filters.status === 'deleted') {
    where += (where ? ' AND' : ' WHERE') + ' is_deleted = true';
  }
  return { where, params };
};

// Get all users and count with pagination
export const getAllUsers = async (query) => {
  const search = query.search || '';
  const filters = {
    status: query.status || ''
  };
  const page = query.page || 1;
  const pageSize = query.pageSize || 20;

  const { where, params } = buildUserFilters(search, filters);
  const { limit, offset } = getPagination(page, pageSize);
  
  // Fetch paginated users
  const sql = `SELECT * FROM users ${where} LIMIT ? OFFSET ?`;
  const [users] = await db.query(sql, [...params, limit, offset]);

  // Fetch total count
  const countSql = `SELECT COUNT(*) AS total FROM users ${where}`;
  const [countRows] = await db.query(countSql, params);
  const total = countRows[0].total;

  return {
    users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const findUserById = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
  return rows[0] || null;
};

export const updateUser = async (userId, updates) => {
  const [result] = await db.query(
    'UPDATE users SET ? WHERE id = ?',
    [updates, userId]
  );
  return result.affectedRows > 0;
};

export const countUsers = async (query) => {
  const search = query.search || '';
  const filters = {
    status: query.status || ''
  };
  const { where, params } = buildUserFilters(search, filters);
  const sql = `SELECT COUNT(*) AS total FROM users ${where}`;
  const [rows] = await db.query(sql, params);
  return rows[0].total;
};