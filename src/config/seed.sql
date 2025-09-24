-- seed.sql

-- NOTE:
-- For running automated E2E tests, only `super-admin-seed.sql` is required.
-- For demo/testing with Postman, run `seed.sql` (admins + users + products).
-- Run this file once on a fresh DB to bootstrap admins, users and products.
-- Useful for quick db seed for postman tests.
-- The token should be console logged in the terminal during login for authenticated tests.

-- Passwords are pre-hashed with bcryptjs.

-- For admins:
-- Example Super Admin plaintext password: SuperAdminPassword123#
-- Example General Admin plaintext password: GeneralAdminPassword123#
-- Example User Manager plaintext password: UserManagerPassword123#
-- Example Product Manager plaintext password: ProductManagerPassword123#
-- Example Order Manager plaintext password: OrderManagerPassword123#
-- Example View Only Admin plaintext password: ViewOnlyAdminPassword123#

-- For users:
-- Example Divine plaintext password: DivinePassword123#
-- Example Tobin plaintext password: TobinPassword123#
-- Example Briggs plaintext password: BriggsPassword123#

-- insert admins
INSERT INTO admins (name, email, password, role, created_by) VALUES
('Super Admin', 'superadmin@example.com',
'$2b$10$iyjE9n5g4H..5wVIxthz9OV9JipHV/L9UW12ZOgVcxylxqs.QqFJq',
'super_admin', NULL),

('General Admin', 'generaladmin@example.com',
'$2b$10$6vPcHJSZCjYcv4XEwjZTJ.j8dX8MujA.H8zCKevfdZa42XX3TsPkW',
'general_admin', 1),

('User Manager', 'usermanager@example.com',
'$2b$10$xuakFrh2nkJUUcpc2/gQ0ePx2MOTjfHcPLWKrbbp0cPubohjaZkfe',
'user_manager', 1),

('Product Manager', 'productmanager@example.com',
'$2b$10$90JFWHxgFcXLaBDoSvSOBOTwSq2D1GsmBi3MlSeyhpOYSRvm0eO8u',
'product_manager', 1),

('Order Manager', 'ordermanager@example.com',
'$2b$10$mVMUjbrqsw23v61.SqemOesWlxzB23c595Y9ijpl8w5emPCTgTcEa',
'order_manager', 1),

('View Only Admin', 'viewonlyadmin@example.com',
'$2b$10$cbu57pRIXzPVJi9IT0mGOu6tSIN15DIXza/OmvhsIYCds3oR9Wj2G',
'view_only_admin', 1);


-- insert users
INSERT INTO users (name, email, password) VALUES
('Divine', 'divine@example.com',
'$2b$10$qd9JyCdKmaeydeUljcekMuC029XKyQ1NPH5VUQAAt.qR4qgIujkkG'),

('Tobin', 'tobin@example.com',
'$2b$10$q6soj1Ml7jSUpjJh72gJpu2hBsrcviT9GdoDlnGGl63wEEdjjWjlu'),

('Briggs', 'briggs@example.com',
'$2b$10$UnWM77zwrjavjcTjdlSkf.FBumseC2z1pw/ia9E.tL3Ku4YvNRcjC');


-- Insert products
INSERT INTO products (name, description, price, image, stock) VALUES
('MacBook Pro 16\" M3 Max', 'High performance MacBook Pro with Apple M3 Max chip, 64GB RAM, 4TB SSD.', 5500.00, 'macbook-pro-m3-max.jpg', 50),
('Dell XPS 17 9720', 'Dell XPS 17 with Intel i9, 64GB RAM, NVIDIA RTX 4090, 4K display.', 4500.00, 'dell-xps-17.jpg', 30),
('MSI MEG Aegis Ti5', 'Gaming monster, i9, 128GB RAM, dual RTX 4090, liquid-cooled.', 13500.00, 'msi-meg-aegis-ti5.jpg', 4),
('ASUS ROG Strix GT35', 'Desktop beast, i9, 128GB RAM, dual RTX 4080, advanced cooling.', 11000.00, 'asus-rog-strix-gt35.jpg', 6),
('Alienware Aurora R16', 'Dual RTX 4090, i9, 128GB RAM, liquid-cooled.', 12000.00, 'alienware-aurora-r16.jpg', 5);