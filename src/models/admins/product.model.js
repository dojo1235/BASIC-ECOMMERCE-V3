import db from '../../config/db.js';
import { buildFilters, getPagination } from '../../utils/query.util.js';

// Build product filter for price
const buildProductFilters = (search, filters = {}) => {
  let { where, params } = buildFilters(search, filters);
  if (filters.status === 'active') {
    where += (where ? ' AND' : ' WHERE') + ' is_deleted = 0';
  }
  if (filters.status === 'deleted') {
    where += (where ? ' AND' : ' WHERE') + ' is_deleted = 1';
  }
  if (filters.price) {
    where += (where ? ' AND' : ' WHERE') + ' price = ?';
    params.push(filters.price);
  }
  return { where, params };
};

// Get all products & count with pagination
export const getAllProducts = async (query) => {
  const search = query.search || '';
  const filters = {
    price: query.price || ''
  };
  const page = query.page || 1;
  const pageSize = query.pageSize || 20;

  const { where, params } = buildProductFilters(search, filters);
  const { limit, offset } = getPagination(page, pageSize);
  
  // Fetch paginated products
  const sql = `SELECT * FROM products ${where} LIMIT ? OFFSET ?`;
  const [products] = await db.query(sql, [...params, limit, offset]);

  // Fetch total count
  const countSql = `SELECT COUNT(*) AS total FROM products ${where}`;
  const [countRows] = await db.query(countSql, params);
  const total = countRows[0].total;

  return {
    products,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getProductById = async (productId) => {
  const [rows] = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  );
  return rows[0] || null;
};

export const createProduct = async (data) => {
  const [result] = await db.query(
    'INSERT INTO products SET ?',
    [data]
  );
  return result.insertId;
};

export const updateProduct = async (productId, updates) => {
  const [result] = await db.query(
    'UPDATE products SET ? WHERE id = ?',
    [updates, productId]
  );
  return result.affectedRows > 0;
};

export const countProducts = async (query) => {
  const search = query.search || '';
  const filters = {
    price: query.price || ''
  };
  const { where, params } = buildProductFilters(search, filters);
  const sql = `SELECT COUNT(*) AS total FROM products ${where}`;
  const [rows] = await db.query(sql, params);
  return rows[0].total;
};