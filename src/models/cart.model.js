import db from '../config/db.js';

// Get all cart items for a user
export const getCartByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT 
        c.id,
        c.quantity,
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.stock,
        p.status
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId]
  );
  return rows;
};

// Add a product to cart or increment quantity if it already exists
export const addOrIncrementCartItem = async (userId, productId, quantity) => {
  const [rows] = await db.query(
    'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (rows.length > 0) {
    const [result] = await db.query(
      'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    return result.affectedRows;
  } else {
    const [result] = await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
    return result.insertId;
  }
};

// Update the quantity of a specific product in the cart
export const updateCartProductQuantity = async (userId, productId, quantity) => {
  const [result] = await db.query(
    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
    [quantity, userId, productId]
  );
  return result.affectedRows;
};

// Remove a specific product from the cart
export const removeProductFromCart = async (userId, productId) => {
  const [result] = await db.query(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return result.affectedRows;
};

// Clear all products from user cart
export const clearCartByUserId = async (userId, connection = db) => {
  const [result] = await connection.query(
    'DELETE FROM cart WHERE user_id = ?',
    [userId]
  );
  return result.affectedRows;
};

// Count the number of units in a user's cart (sums quantity)
export const countCartItems = async (userId) => {
  const [rows] = await db.query(
    'SELECT COALESCE(SUM(quantity), 0) AS count FROM cart WHERE user_id = ?',
    [userId]
  );
  return Number(rows[0]?.count ?? 0);
};;