import { MESSAGES } from '../../constants/admins/index.js';
import { HTTP_STATUS } from '../../constants/index.js';
import { asyncHandler } from '../../middlewares/async-handler.middleware.js';
import { buildResponse } from '../../utils/response.util.js';
import * as productService from "../../services/admins/product.service.js";

// Get all products with search, filters & pagination
export const getAllProducts = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.getAllProducts(req.user, req.query),
      MESSAGES.PRODUCT.FETCH_PRODUCTS_SUCCESS
  ));
});

// Get single product
export const getProductById = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.getProductById(req.user, req.params.productId),
      MESSAGES.PRODUCT.FETCH_PRODUCT_SUCCESS
  ));
});

// Create new product
export const createProduct = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.CREATED).json(buildResponse(
      await productService.createProduct(req.user, req.body),
      MESSAGES.PRODUCT.CREATE_SUCCESS
  ));
});

// Update product details
export const updateProductDetails = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.updateProduct(req.user, req.params.productId, req.body),
      MESSAGES.PRODUCT.UPDATE_SUCCESS
  ));
});

// Set product to out of stock
export const setProductToOutOfStock = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.updateProduct(req.user, req.params.productId, { status: 'out_of_stock' }),
      MESSAGES.PRODUCT.OUT_OF_STOCK_SUCCESS
  ));
});

// Set product to in stock
export const setProductToInStock = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.updateProduct(req.user, req.params.productId, { status: 'in_stock' }),
      MESSAGES.PRODUCT.IN_STOCK_SUCCESS
  ));
});

// Discontinue product
export const discontinueProduct = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.updateProduct(req.user, req.params.productId, { status: 'discontinued' }),
      MESSAGES.PRODUCT.DISCONTINUE_SUCCESS
  ));
});

// Soft-delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.updateProduct(req.user, req.params.productId, { isDeleted: true }),
      MESSAGES.PRODUCT.DELETE_SUCCESS
  ));
});

// Restore soft-deleted product
export const restoreProduct = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.updateProduct(req.user, req.params.productId, { isDeleted: false }),
      MESSAGES.PRODUCT.RESTORE_SUCCESS
  ));
});

// Count all product with search & filters
export const countProducts = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.countProducts(req.query),
      MESSAGES.PRODUCT.COUNT_SUCCESS
  ));
});