import db from '../../config/db.js';
import { getPagination } from '../../utils/query.util.js';

// Get all reviews for a product (admin view – includes hidden, with pagination)
export const getAllReviewsByProductId = async (productId, { page = 1, pageSize = 10 } = {}) => {
  const { limit, offset } = getPagination(page, pageSize);

  const [rows] = await db.query(
    `SELECT 
        r.id,
        r.product_id,
        r.rating,
        r.comment,
        r.is_visible,
        r.updated_by,
        r.created_at,
        r.updated_at,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [productId, limit, offset]
  );

  const [countResult] = await db.query(
    `SELECT COUNT(*) AS total 
     FROM reviews r 
     WHERE r.product_id = ?`,
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

// Get a single review by ID (joins with users)
export const getReviewById = async (reviewId) => {
  const [rows] = await db.query(
    `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.is_visible,
        r.updated_by,
        r.created_at,
        r.updated_at,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.id = ?`,
    [reviewId]
  );
  return rows[0] || null;
};

// Hide a review (admin action)
export const hideReview = async (adminId, reviewId) => {
  const [result] = await db.query(
    `UPDATE reviews
     SET is_visible = FALSE, updated_by = ?, updated_at = NOW()
     WHERE id = ?`,
    [adminId, reviewId]
  );
  return result.affectedRows > 0;
};

// Restore hidden review
export const restoreReview = async (adminId, reviewId) => {
  const [result] = await db.query(
    `UPDATE reviews
     SET is_visible = TRUE, updated_by = ?, updated_at = NOW()
     WHERE id = ?`,
    [adminId, reviewId]
  );
  return result.affectedRows > 0;
};