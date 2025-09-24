-- super-admin-seed.sql

-- NOTE:
-- For demo/testing with Postman, run `seed.sql` (admins + users + products).
-- For running automated E2E tests, only `super-admin-seed.sql` is required.
-- Tests can spin up their own dependencies automatically e.g. products, users etc.
-- Once only super admin is seeded, you are green light to run the test command.
-- It should all go green.
-- Example Super Admin plaintext password: SuperAdminPassword123#

-- insert super-admin
INSERT INTO admins (name, email, password, role)  
VALUES  
('Super Admin', 'superadmin@example.com', '$2b$10$iyjE9n5g4H..5wVIxthz9OV9JipHV/L9UW12ZOgVcxylxqs.QqFJq', 'super_admin');