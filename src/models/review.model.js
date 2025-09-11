import db from '../config/db.js';
import { getPagination } from '../utils/query.util.js';

// Get single user review by user ID & product ID
export const getReviewByUserAndProductId = async (userId, productId) => {
  const [rows] = await db.query(
    'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?',
    [productId, userId]
  );
  return rows[0] || null
};

// Add a new review
export const addReview = async (userId, productId, rating, comment) => {
  const [result] = await db.query(
    `INSERT INTO reviews (user_id, product_id, rating, comment)
     VALUES (?, ?, ?, ?)`,
    [userId, productId, rating, comment]
  );
  return result.insertId;
};

// Update an existing review
export const updateReview = async (userId, productId, rating, comment) => {
  const [result] = await db.query(
    `UPDATE reviews 
     SET rating = ?, comment = ?, updated_at = NOW()
     WHERE user_id = ? AND product_id = ?`,
    [rating, comment, userId, productId]
  );
  return result.affectedRows;
};

// Get all visible reviews for a product (with pagination)
export const getReviewsByProductId = async (productId, { page = 1, pageSize = 10 } = {}) => {
  const { limit, offset } = getPagination(page, pageSize);

  const [rows] = await db.query(
    `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        r.updated_at,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ? AND r.is_visible = TRUE
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [productId, limit, offset]
  );

  const [countResult] = await db.query(
    `SELECT COUNT(*) AS total 
     FROM reviews r 
     WHERE r.product_id = ? AND r.is_visible = TRUE`,
    [productId]
  );
  const total = countResult[0].total;

  return {
    reviews: rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};