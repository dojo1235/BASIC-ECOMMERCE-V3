# PFalcon-Ecommerce

## Overview

PFalcon-Ecommerce is a **modular e-commerce backend** designed to manage users, admins, products, carts, orders, reviews, and wishlists. It is structured with a clean separation of concerns using controllers, services, and routes, enabling maintainable and scalable code.

The system supports both **regular users** and **admin users**, with role-based functionality to manage products, orders, and reviews.

---

## Features

### 1. Authentication & User Management
- **User Registration & Login**: Users can register and log in with secure password hashing.
- **Admin & User Roles**: Different roles with access control for admins and regular users.
- **Profile Management**: Users can view and update their profile, including name, email, and password.

### 2. Product Management
- **CRUD Operations**: Admins can create, update, and delete products.
- **Product Retrieval**: Users can get all products with pagination or fetch single products by ID.
- **Search & Filtering (extendable)**: Designed to allow future search and filter capabilities.

### 3. Cart Management
- **Add Products to Cart**: Users can add available products to their cart.
- **Update Quantity**: Modify quantity with stock validation.
- **Remove Products**: Delete items from cart.
- **Cart Details**: View all items in the cart and count of items.

### 4. Wishlist Management
- **Add to Wishlist**: Users can save products they like.
- **Remove from Wishlist**: Delete products from wishlist.
- **View Wishlist**: Retrieve a list of wishlist items and counts.

### 5. Order Management
- **Place Orders**: Checkout items from the cart.
- **Retrieve Orders**: Users can view their orders; admins can extend to view all.
- **Cancel Orders**: Users can cancel orders with status validation.

### 6. Review Management
- **Add Reviews**: Users can leave reviews on products they purchased.
- **Retrieve Reviews**: Get all reviews for a product or a single user’s review.
- **Update Reviews**: Users can update their reviews.

### 7. Role-based Access
- Admins can manage products, view all orders, and moderate reviews.
- Regular users have access to their cart, orders, wishlist, and profile.

---

## Technical Stack

- **Node.js & Express** – Backend runtime and framework.
- **MySQL2** – Relational database for storing users, products, orders, etc.
- **JWT & bcryptjs** – Authentication and password hashing.
- **Supertest & Vitest** – Testing framework for unit and E2E tests.
- **dotenv** – Configuration management.

---

## Project Structure

controllers/  -> Handles HTTP requests and responses services/     -> Business logic for different modules models/       -> Database interactions and schemas routes/       -> API endpoint definitions tests/        -> Unit and E2E tests server.js     -> Entry point for the backend

---

## Testing

- Sequential test execution to prevent collisions between token-dependent tests.
- E2E tests cover authentication, product operations, cart, orders, reviews, wishlist, and user operations.
- Example command to run all E2E tests sequentially:

```bash
npm run test:E2E:All


---

Notes

Designed to work in lightweight environments (like Termux) for development and testing.

The system uses role-based access, with admins having extended permissions.

Each module is self-contained and extendable for future features like search, filtering, or reporting.



---

License

ISC License – created by BRIGGS DIVINE TOBIN





src/services/auth.service.js replacement to create a super admin through the normal register means.

import { ALLOWED_FIELDS, ROLES } from '../constants/index.js';
import { mapAllowedFields } from '../utils/field-mapper.util.js';
import { ensureUserIsActive, ensurePasswordIsCorrect } from '../utils/validators/auth-validators.util.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateToken } from '../utils/jwt.util.js';
import { AppError } from '../utils/app-error.js';
import { ensureEmailIsUnique } from './shared/email.service.js';
import { findAdminByEmail, updateAdmin } from '../models/admins/admin.model.js';
import { createAdmin, findAdminById } from '../models/admins/super-admin.model.js';
import * as userModel from '../models/user.model.js';

// Register new user
export const registerUser = async (payload) => {
  const filteredData = mapAllowedFields(payload, ALLOWED_FIELDS.AUTH.CREATE);
  await ensureEmailIsUnique(filteredData.email);
  filteredData.password = await hashPassword(filteredData.password);
  filteredData.role = ROLES.SUPER_ADMIN;
  const user = await findAdminById(await createAdmin(filteredData));
  const token = generateToken({ email: user.email });
  console.log('ADMIN_TOKEN: ', token);
  return { token, user };
};

// Login existing user
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await userModel.findUserByEmail(email) || await findAdminByEmail(email);
  ensureUserIsActive(user);
  ensurePasswordIsCorrect(await comparePassword(password, user.password));
  if (user.role !== ROLES.USER)
    await updateAdmin(user.id, { last_login: new Date() });
  if (user.role === ROLES.USER)
    await userModel.updateUser(user.id, { last_login: new Date() });
  const token = generateToken({ email: user.email });
  return { token, user };
};