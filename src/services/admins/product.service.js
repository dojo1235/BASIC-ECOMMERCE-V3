import { ALLOWED_FIELDS } from '../../constants/admins/index.js';
import { mapAllowedFields } from '../../utils/field-mapper.util.js';
import { ensureProductIsFound } from '../../utils/validators/product-validators.util.js';
import * as productModel from '../../models/admins/product.model.js';

// Get all products with search, filters & pagination
export const getAllProducts = async (query) => {
  const { products, pagination } = await productModel.getAllProducts(query);
  return { products, pagination };
};

// Get single product
export const getProductById = async (productId) => {
  const product = await productModel.getProductById(productId);
  ensureProductIsFound(product);
  return { product };
};

// Create new product
export const createProduct = async (adminId, payload) => {
  const filteredData = mapAllowedFields(payload, ALLOWED_FIELDS.PRODUCT.CREATE);
  filteredData.created_by = adminId;
  const productId = await productModel.createProduct(filteredData);
  const createdProduct = await productModel.getProductById(productId);
  return { product: createdProduct };
};

// Update product details
export const updateProduct = async (adminId, productId, updates) => {
  const filteredData = mapAllowedFields(updates, ALLOWED_FIELDS.PRODUCT.UPDATE);
  const product = await productModel.getProductById(productId);
  ensureProductIsFound(product);
  filteredData.updated_by = adminId;
  filteredData.updated_at = new Date();
  await productModel.updateProduct(productId, filteredData);
  const updatedProduct = await productModel.getProductById(productId);
  return { product: updatedProduct };
};

// Count products with search & filters
export const countProducts = async (query) => {
  const count = await productModel.countProducts(query);
  return { productsCount: count };
};