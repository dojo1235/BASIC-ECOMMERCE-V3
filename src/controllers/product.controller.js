import { MESSAGES, HTTP_STATUS } from '../constants/index.js';
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import { buildResponse } from "../utils/response.util.js";
import * as productService from "../services/product.service.js";

// Get all prosducts with search, filters & pagination
export const getAllProducts = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.getAllProducts(req.query),
      MESSAGES.PRODUCT.FETCH_PRODUCTS_SUCCESS
  ));
});

// Get single product
export const getProductById = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json(buildResponse(
      await productService.getProductById(req.params.productId),
      MESSAGES.PRODUCT.FETCH_PRODUCT_SUCCESS
  ));
});