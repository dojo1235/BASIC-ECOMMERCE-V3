import db from '../config/db.js';

// Place order 
export const placeOrder = async (userId, total, contact, shippingAddress, connection) => {
  const sql = `
    INSERT INTO orders (user_id, total, contact, shipping_address)
    VALUES (?, ?, ?, ?)
  `;
  const params = [userId, total, contact, shippingAddress];

  const [result] = connection
    ? await connection.query(sql, params)
    : await db.query(sql, params);

  return result.insertId;
};

// Get user orders
export const getOrdersByUserId = async (userId, connection) => {
  const sql = `
    SELECT id, user_id, total, contact, shipping_address, status, is_deleted, updated_by, created_at, updated_at
    FROM orders
    WHERE user_id = ? AND is_deleted = FALSE
    ORDER BY created_at DESC
  `;
  const params = [userId];

  const [rows] = connection
    ? await connection.query(sql, params)
    : await db.query(sql, params);

  return rows;
};

// Get single order for user
export const getOrderByOrderId = async (userId, orderId, connection) => {
  const sql = `
    SELECT id, user_id, total, contact, shipping_address, status, is_deleted, updated_by, created_at, updated_at
    FROM orders
    WHERE id = ? AND user_id = ? AND is_deleted = FALSE
    LIMIT 1
  `;
  const params = [orderId, userId];

  const [rows] = connection
    ? await connection.query(sql, params)
    : await db.query(sql, params);

  return rows[0] || null;
};

// Cancel and order placed
export const cancelOrderByOrderId = async (userId, orderId, connection) => {
  const sql = `
    UPDATE orders
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = ? AND user_id = ? AND is_deleted = FALSE
  `;
  const params = [orderId, userId];

  const [result] = connection
    ? await connection.query(sql, params)
    : await db.query(sql, params);

  return result.affectedRows;
};