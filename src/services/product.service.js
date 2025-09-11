import { ensureProductIsFound } from "../utils/validators/product-validators.util.js";
import { sanitizeForPublic } from '../utils/sanitize.util.js';
import * as productModel from "../models/product.model.js";

// Get all products with search, filters & pagination
export const getAllProducts = async (query) => {
  const { products, pagination } = await productModel.getAllProducts(query);
  return { products: sanitizeForPublic(products), pagination };
};

// Get single product
export const getProductById = async (productId) => {
  const product = await productModel.getProductById(productId);
  ensureProductIsFound(product);
  return { product: sanitizeForPublic(product) };
};