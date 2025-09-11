import db from '../config/db.js';
import { getPagination } from '../utils/query.util.js';

// Get all wishlist items for a user with pagination
export const getWishlistByUserId = async (userId, { page = 1, pageSize = 10 } = {}) => {
  const { limit, offset } = getPagination(page, pageSize);

  const [rows] = await db.query(
    `SELECT 
        w.id,
        w.created_at,
        w.updated_at,
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image AS product_image,
        p.status AS product_status
     FROM wishlist w
     JOIN products p ON w.product_id = p.id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  const [countResult] = await db.query(
    `SELECT COUNT(*) AS total 
     FROM wishlist 
     WHERE user_id = ?`,
    [userId]
  );
  const total = countResult[0].total;

  return {
    wishlist: rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// Check if wishlist item exists
export const checkIfWishlistItemExist = async (userId, productId) => {
  const [rows] = await db.query(
    'SELECT 1 FROM wishlist WHERE product_id = ? AND user_id = ? LIMIT 1',
    [productId, userId]
  );
  return rows.length > 0;
};

// Add item to wishlist
export const addProductToWishlist = async (userId, productId) => {
  const [result] = await db.query(
    `INSERT INTO wishlist (user_id, product_id)
     VALUES (?, ?)`,
    [userId, productId]
  );
  return result.insertId;
};

// Remove item from wishlist
export const removeProductFromWishlist = async (userId, productId) => {
  const [result] = await db.query(
    `DELETE FROM wishlist
     WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );
  return result.affectedRows > 0;
};

// Count wishlist items for a user
export const countWishlistItems = async (userId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total 
     FROM wishlist 
     WHERE user_id = ?`,
    [userId]
  );
  return rows[0].total;
};