import { ensureProductIsFound } from '../utils/validators/product-validators.util.js';
import { sanitizeForPublic } from '../utils/sanitize.util.js';
import { getProductById } from '../models/product.model.js';
import * as wishlistModel from '../models/wishlist.model.js';

// Get all wishlist items (with pagination)
export const getWishlistByUserId = async (userId, query) => {
  const { wishlist, pagination } = await wishlistModel.getWishlistByUserId(userId, query);
   return { wishlist: sanitizeForPublic(wishlist), pagination };
};

// Add to wishlist
export const addProductToWishlist = async (userId, productId) => {
  ensureProductIsFound(await getProductById(productId));
  const existing = await wishlistModel.checkIfWishlistItemExist(userId, productId);
  if (existing) return;
  await wishlistModel.addProductToWishlist(userId, productId);
};

// Remove product from wishlist
export const removeProductFromWishlist = async (userId, productId) => {
  ensureProductIsFound(await getProductById(productId));
  await wishlistModel.removeProductFromWishlist(userId, productId);
};

// Count wishlist items for a user
export const countWishlistItems = async (userId) => {
  const count = await wishlistModel.countWishlistItems(userId);
  return { wishlistCount: count };
};