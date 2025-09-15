import db from '../../config/db.js';
import { buildFilters, getPagination } from '../../utils/query.util.js';

// Helper: attach order items
const attachOrderItems = async (orders) => {
  if (!orders.length) return orders;
  
  const orderIds = orders.map(o => o.id);
  const [items] = await db.query(
    `SELECT 
        oi.*, 
        p.name AS product_name, 
        p.image AS product_image
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id IN (?)`,
    [orderIds]
  );

  // Group items by order_id
  const itemsByOrderId = {};
  for (const item of items) {
    if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
    itemsByOrderId[item.order_id].push(item);
  }

  return orders.map(order => ({
    ...order,
    items: itemsByOrderId[order.id] || []
  }));
};

// Build filters for orders
const buildOrderFilters = (search, filters = {}) => {
  let { where, params } = buildFilters(search, filters);
  
  if (filters.status) {
    where += ' AND o.status = ?';
    params.push(filters.status);
  }
  if (filters.date_from) {
    where += ' AND o.created_at >= ?';
    params.push(filters.date_from);
  }
  if (filters.date_to) {
    where += ' AND o.created_at <= ?';
    params.push(filters.date_to);
  }
  if (filters.user_id) {
    where += ' AND o.user_id = ?';
    params.push(filters.user_id);
  }
  return { where, params };
};

// Get all orders
export const getAllOrders = async (query) => {
  const search = query.search || '';
  const filters = {
    status: query.status || '',
    date_from: query.date_from || '',
    date_to: query.date_to || '',
    user_id: query.user_id || ''
  };
  const page = query.page || 1;
  const pageSize = query.pageSize || 10;

  const { where, params } = buildOrderFilters(search, filters);
  const { limit, offset } = getPagination(page, pageSize);

  const sql = `
    SELECT 
      o.*, 
      u.name AS user_name, 
      u.email AS user_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ${where}
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `;
  const [rows] = await db.query(sql, [...params, limit, offset]);

  const countSql = `
    SELECT COUNT(*) AS total
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ${where}
  `;
  const [countRows] = await db.query(countSql, params);
  const total = countRows[0].total;

  const ordersWithItems = await attachOrderItems(rows);

  return {
    orders: ordersWithItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// Get orders for a specific user
export const getOrdersByUserId = async (userId, query) => {
  return getAllOrders({ ...query, user_id: userId });
};

// Get a single order by ID
export const getOrderByOrderId = async (orderId) => {
  const sql = `
    SELECT 
      o.*, 
      u.name AS user_name, 
      u.email AS user_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `;
  const [rows] = await db.query(sql, [orderId]);
  if (!rows[0]) return null;

  const ordersWithItems = await attachOrderItems(rows);
  return ordersWithItems[0];
};

// Update order status
export const updateOrderStatus = async (adminId, orderId, status) => {
  const [result] = await db.query(
    `UPDATE orders 
     SET status = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, adminId, orderId]
  );
  return result.affectedRows > 0;
};

// Soft delete order
export const deleteOrder = async (adminId, orderId) => {
  const [result] = await db.query(
    `UPDATE orders 
     SET is_deleted = 1, updated_by = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [adminId, orderId]
  );
  return result.affectedRows > 0;
};

// Restore soft deleted order
export const restoreOrder = async (adminId, orderId) => {
  const [result] = await db.query(
    `UPDATE orders 
     SET is_deleted = 0, updated_by = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [adminId, orderId]
  );
  return result.affectedRows > 0;
};