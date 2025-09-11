# Architecture Overview – Basic e-commerce with RBAC supporting super admin, general admin, product manager, order manager, and user manager. Got all core features covered - auth, product, cart, order, review, wishlist, user. 

## Stack

- **Backend:** Node.js (Express)
- **Database:** MySQL
---

## Backend Structure


### Key Concepts

#### Auth
- JWT for auth. `authenticate` middleware checks token (header or cookie).
- User passwords hashed (bcryptjs).
- Token contains: `{ id, role }`.

#### API
- RESTful endpoints, all `/api/*`.
- Errors returned as `{ message }`, status codes as per REST standards.

#### Database
- See `/src/config/schema.sql` for schema.
- `users`, `products`, `cart`, `orders`, `order_items etc` tables.
- Foreign keys with cascade deletes for referential integrity.

---

## Deployment

- Single `npm start` runs Express backend and serves frontend.
- Configure `/config/db.js` and `.env` for your DB.
- Place product images in `/public/images/`.
- Add admin features (CRUD for products) as desired.

---

## Security & Quality

- All passwords hashed, tokens signed and expire in 7 days.
- Input validation and centralized error handling.
- No sensitive info in tokens or responses.
- Clean, modular codebase suitable for scaling and production.

---

## Customization

- To add categories, payments, or admin dashboard: extend models/controllers/routes.
- To internationalize: add language support in frontend and error messages.
- Admins test automation remaining. public already covered

---

**Contact:** dojo@example.com