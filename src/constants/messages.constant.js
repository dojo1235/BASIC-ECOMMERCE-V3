export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful.',
    LOGIN_SUCCESS: 'Login successful.',
    EMAIL_IN_USE: 'Email already exist.',
    EMAIL_NOT_FOUND: 'Invalid credentials.',
    INVALID_PASSWORD: 'Invalid credentials.',
    USER_BANNED: 'Account banned.',
    USER_DELETED: 'Account deleted.',
    INVALID_AUTH_FORMAT: 'Invalid auth format. Authorization header and Bearer required.',
    NO_TOKEN: 'Token not provided. Authentication required.',
    INVALID_TOKEN_PAYLOAD: 'Invalid token payload.',
    TOKEN_EXPIRED: 'Token expired.',
    INVALID_TOKEN: 'Invalid token.',
    ROUTE_ACCESS_DENIED: 'ACCESS DENIED! Route forbidden.',
    EMAIL_MISSING: 'Email not provided.',
    INVALID_EMAIL_FORMAT:'Invalid Email Format.'
  },
  USER: {
    FETCH_SUCCESS: 'User fetched successfully.',
    UPDATE_SUCCESS: 'User updated successfully.',
    UPDATE_PASSWORD_SUCCESS: 'Password updated successfully.',
    OLD_PASSWORD_MISSING: 'Old password is required in order to update new password.',
    PASSWORD_UNCHANGED: 'New password cannot be the same with old password.',
    INVALID_OLD_PASSWORD: 'Old password is incorrect.',
    PASSWORD_MISSING: 'New Passord cannot be empty.',
    PASSWORD_TOO_SHORT: 'New password must be at least 6 characters long.',
    PASSWORD_LOWERCASE_MISSING: 'New password must contain at least one lowercase letter.',
    PASSWORD_UPPERCASE_MISSING: 'New password must contain at least one uppercase letter.',
    PASSWORD_NUMBER_MISSING: 'New password must contain at least one number.',
    PASSWORD_SPECIALCHAR_MISSING: 'New Password must contain at least one special character.'
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