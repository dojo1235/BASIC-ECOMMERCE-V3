-- product.seed.sql
USE BASIC_ECOMMERCE_V3;

-- Insert products
INSERT INTO products (name, description, price, image, stock) VALUES
('MacBook Pro 16\" M3 Max', 'High performance MacBook Pro with Apple M3 Max chip, 64GB RAM, 4TB SSD.', 5500.00, 'macbook-pro-m3-max.jpg', 50),
('Dell XPS 17 9720', 'Dell XPS 17 with Intel i9, 64GB RAM, NVIDIA RTX 4090, 4K display.', 4500.00, 'dell-xps-17.jpg', 30),
('MSI MEG Aegis Ti5', 'Gaming monster, i9, 128GB RAM, dual RTX 4090, liquid-cooled.', 13500.00, 'msi-meg-aegis-ti5.jpg', 4),
('ASUS ROG Strix GT35', 'Desktop beast, i9, 128GB RAM, dual RTX 4080, advanced cooling.', 11000.00, 'asus-rog-strix-gt35.jpg', 6),
('Alienware Aurora R16', 'Dual RTX 4090, i9, 128GB RAM, liquid-cooled.', 12000.00, 'alienware-aurora-r16.jpg', 5);