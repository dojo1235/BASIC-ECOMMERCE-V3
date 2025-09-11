import db from '../config/db.js';
import { buildFilters, getPagination } from '../utils/query.util.js';

// Build product filter for price and exclude deleted products
const buildProductFilters = (search, filters = {}) => {
  let { where, params } = buildFilters(search, filters);
  // Exclude soft-deleted products
  where += (where ? ' AND' : ' WHERE') + ' is_deleted = false';
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

// Get single product (supports transaction)
export const getProductById = async (productId, connection = db) => {
  const [rows] = await connection.query(
    'SELECT * FROM products WHERE id = ? AND is_deleted = false',
    [productId]
  );
  return rows[0] || null;
};

// Update product stock after order placement or cancel (supports transaction)
export const updateProductStockById = async (id, stock, connection = db) => {
  await connection.query(
    'UPDATE products SET stock = ? WHERE id = ?',
    [stock, id]
  );
};