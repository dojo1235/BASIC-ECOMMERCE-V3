export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful.',
    LOGIN_SUCCESS: 'Login successful.',
    EMAIL_IN_USE: 'Email already exist.',
    EMAIL_NOT_FOUND: 'Invalid credentials.',
    INVALID_PASSWORD: 'Invalid credentials.',
    USER_BANNED: 'Account banned.',
    USER_DELETED: 'Account deleted.'
  },
  USER: {
    FETCH_SUCCESS: 'User fetched successfully.',
    UPDATE_SUCCESS: 'User updated successfully.'
  },
  PRODUCT: {
    FETCH_PRODUCTS_SUCCESS: 'Products fetched successfully.',
    FETCH_PRODUCT_SUCCESS: 'Product fetched successfully.',
    NOT_FOUND: 'Product not found.',
    NOT_ENOUGH_STOCK: 'Not enough stock.'
  },
  CART: {
    FETCH_SUCCESS: 'Cart fetched successfully.',
    ADD_SUCCESS: 'Added to cart.',
    UPDATE_SUCCESS: 'Cart updated.',
    REMOVE_SUCCESS: 'Item removed from cart.',
    CLEAR_SUCCESS: 'Cart cleared.',
    COUNT_SUCCESS: 'Cart items counted.',
    NOT_FOUND: 'Carr is empty.',
    INSUFFICIENT_STOCK: (itemName, stock) =>
      `Only ${stock} left for ${itemName}`
  },
  ORDER: {
    FETCH_ORDERS_SUCCESS: 'Orders fetched successfully.',
    FETCH_ORDER_SUCCESS: 'Order fetched successfully.',
    CREATE_SUCCESS: 'Order placed successfully.',
    CANCEL_SUCCESS: 'Order cancelled successfully.',
    CANCEL_NOT_SUPPORTED: 'Cannot cancel order. Order already shipped.',
    NOT_FOUND: 'Order not found.',
  },
  REVIEW: {
    ADD_SUCCESS: 'Review added successfully.',
    UPDATE_SUCCESS: 'Review updated successfully.',
    FETCH_SUCCESS: 'Review fetched successfully',
    FETCH_PRODUCT_REVIEWS_SUCCESS: 'Product reviews fetched successfully.',
    NOT_FOUND: 'Review not found.'
  },
  WISHLIST: {
    ADD_SUCCESS: 'Added to wishlist.',
    FETCH_SUCCESS: 'Wishlist fetched successfully.',
    REMOVE_SUCCESS: 'Removed from wishlist.',
    COUNT_SUCCESS: 'Wishlist counted successfully.'
  },
  GENERAL: {
    FORBIDDEN: (fields) =>
      `ACCESS DENIED! The following field(s): (${fields.join(', ')}) are not allowed.`
  }
};