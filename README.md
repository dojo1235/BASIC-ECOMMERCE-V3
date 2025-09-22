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

controllers/  -> Handles HTTP requests and responses
services/     -> Business logic for different modules
models/       -> Database interactions and schemas
routes/       -> API endpoint definitions
tests/        -> E2E test
server.js     -> Entry point for the backend

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


## Database Seeding

This project comes with two seed files to make setup and testing easier.

### 1. `seed.sql` (Full Seed)
- Inserts:
  - Admin accounts (Super Admin + other roles)
  - Sample users
  - Sample products
- **Use case:** For quick Postman or manual API testing where you want ready-made data.

> Example Super Admin plaintext password: `SuperAdminPassword123#`

---

### 2. `super-admin-seed.sql` (Minimal Seed)
- Inserts **only the Super Admin** account.
- **Use case:** For automated E2E tests or fresh environments where tests create their own data.
- Keeps dependencies minimal → once the Super Admin is seeded, you’re ready to run tests.

---

### Usage
From inside your MariaDB/MySQL shell:
```sql
SOURCE seed.sql;

Or for the minimal seed:

SOURCE super-admin-seed.sql;


---

Tip: Run only one of these depending on your workflow:

Full playground: seed.sql

Clean E2E tests: super-admin-seed.sql



## Seeded Account Pattern

All seeded accounts (admins and users) follow a consistent, predictable pattern for testing:

- **Email:** fullname@example.com  
- **Password:** FullNamePassword123#

Examples:

| Role/User          | Email                     | Password                  |
|--------------------|---------------------------|---------------------------|
| Super Admin        | superadmin@example.com    | SuperAdminPassword123#    |
| General Admin      | generaladmin@example.com  | GeneralAdminPassword123#  |
| User Manager       | usermanager@example.com   | UserManagerPassword123#   |
| Product Manager    | productmanager@example.com| ProductManagerPassword123#|
| Order Manager      | ordermanager@example.com  | OrderManagerPassword123#  |
| View Only Admin    | viewonlyadmin@example.com | ViewOnlyAdminPassword123# |
| Divine (user)      | divine@example.com        | DivinePassword123#        |
| Tobin (user)       | tobin@example.com         | TobinPassword123#         |
| Briggs (user)      | briggs@example.com        | BriggsPassword123#        |

All passwords are pre-hashed in the database. This pattern is purely for educational and testing purposes, making it easy to login during Postman tests or local development.

---


LICENSE

This project is released under the **Premium Educational License (PEL)**.

### You are allowed to:
- ✅ Clone this repository  
- ✅ Use it for **personal learning, testing, or educational purposes**  
- ✅ Run and explore the project locally  

### You are **not** allowed to:
- ❌ Modify the source code for redistribution  
- ❌ Redistribute or publish this code as your own
- ❌ Use it for commercial purposes  

For full details, see the [LICENSE](./LICENSE) file.


**Unlock The Full Potential**

The full potential of the system is intentionally left for exploration. The visible features of this system are only the beginning. Beneath the surface lies a collection of **premium capabilities, elegant workflows, and hidden patterns** that only the author fully understands.

You’re welcome to poke around, explore, and experiment with what you can — but the true power is intentionally concealed. Those who dig deeper will discover the system’s full potential.

To unlock all **baked-in features**, reach out to the author directly.


CREATED BY: **BRIGGS DIVINE TOBIN**
EMAIL: **dojo10295@gmail.com**



src/services/auth.service.js replacement to create a super admin through the normal register means if needed.
Or use the seeded super admin to create other super admins if already seeded.

import { ALLOWED_FIELDS, ROLES } from '../constants/index.js';
import { mapAllowedFields } from '../utils/field-mapper.util.js';
import { ensureUserIsActive, ensurePasswordIsCorrect } from '../utils/validators/auth-validators.util.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateToken } from '../utils/jwt.util.js';
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