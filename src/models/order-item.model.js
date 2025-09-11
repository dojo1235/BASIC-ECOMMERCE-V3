import db from '../config/db.js';

// Create single order items
export const createOrderItem = async (orderId, productId, quantity, price, connection) => {
  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `;
  const params = [orderId, productId, quantity, price];

  const [result] = connection
    ? await connection.query(sql, params)
    : await db.query(sql, params);

  return result.insertId;
};

// Create order items
export const createOrderItems = async (items, connection) => {
  const insertIds = [];
  for (const it of items) {
    const id = await createOrderItem(it.orderId, it.productId, it.quantity, it.price, connection);
    insertIds.push(id);
  }
  return insertIds;
};

// Get order items
export const getOrderItemsByOrderId = async (orderId, connection) => {
  const sql = `
    SELECT id, order_id, product_id, quantity, price, created_at, updated_at
    FROM order_items
    WHERE order_id = ?
  `;
  const params = [orderId];

  const [rows] = connection
    ? await connection.query(sql, params)
    : await db.query(sql, params);

  return rows;
};