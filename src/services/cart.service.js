import { ensureProductIsFound, ensureStockIsSufficient } from '../utils/validators/product-validators.util.js';
import { sanitizeForPublic } from '../utils/sanitize.util.js';
import { AppError } from '../utils/app-error.js';
import { getProductById } from '../models/product.model.js';
import * as cartModel from '../models/cart.model.js';

// Get user cart
export const getCartByUserId = async (userId) => {
  const cart = await cartModel.getCartByUserId(userId);
  return { cart: sanitizeForPublic(cart) };
};

// Add or update product quantity in cart if already added
export const addOrIncrementCartItem = async (userId, productId, quantity) => {
  const product = await getProductById(productId);
  ensureProductIsFound(product);
  ensureStockIsSufficient(quantity, product.stock);
  await cartModel.addOrIncrementCartItem(userId, productId, quantity || 1);
  const cart = await cartModel.getCartByUserId(userId);
  return { cart: sanitizeForPublic(cart) };
};

// Update cart product quantity
export const updateCartProductQuantity = async (userId, productId, quantity) => {
  const product = await getProductById(productId);
  ensureProductIsFound(product);
  ensureStockIsSufficient(quantity, product.stock);
  await cartModel.updateCartProductQuantity(userId, productId, quantity || 1);
  const cart = await cartModel.getCartByUserId(userId);
  return { cart: sanitizeForPublic(cart) };
};

// Remove product from cart
export const removeProductFromCart = async (userId, productId) => {
  ensureProductIsFound(await getProductById(productId));
  await cartModel.removeProductFromCart(userId, productId);
  const cart = await cartModel.getCartByUserId(userId);
  return { cart: sanitizeForPublic(cart) };
};

// Count user cart items
export const countCartItems = async (userId) => {
  const count = await cartModel.countCartItems(userId);
  return { cartCount: count };
};