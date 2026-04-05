-- ================================================
-- DAM1M04 Exercici 401 - TechShop ERP
-- Base de dades: erp401
-- ================================================

DROP DATABASE IF EXISTS erp401;
CREATE DATABASE erp401 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE erp401;

-- ===== TAULES =====

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(40) DEFAULT 'Targeta',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ===== PRODUCTES (30) =====

INSERT INTO products (name, category, price, stock, active) VALUES
('Portàtil ASUS VivoBook 15', 'Portàtils', 649.99, 12, 1),
('Portàtil Lenovo IdeaPad 3', 'Portàtils', 549.00, 8, 1),
('MacBook Air M2', 'Portàtils', 1299.00, 4, 1),
('PC Gaming Torre RTX4070', 'Sobretaula', 1499.00, 3, 1),
('PC Sobretaula Intel i5', 'Sobretaula', 699.00, 6, 1),
('Monitor LG 27" 4K', 'Monitors', 379.99, 10, 1),
('Monitor Samsung 24" FHD', 'Monitors', 189.99, 15, 1),
('Monitor Ultrawide 34"', 'Monitors', 529.00, 2, 1),
('Teclat Mecànic Redragon', 'Perifèrics', 59.99, 20, 1),
('Teclat Logitech MX Keys', 'Perifèrics', 119.00, 14, 1),
('Ratolí Gaming Razer', 'Perifèrics', 69.99, 18, 1),
('Ratolí Logitech MX Master 3', 'Perifèrics', 99.00, 9, 1),
('Auriculars Sony WH-1000XM5', 'Àudio', 329.00, 5, 1),
('Auriculars JBL Tune 520BT', 'Àudio', 49.99, 22, 1),
('Altaveus Creative Pebble', 'Àudio', 29.99, 30, 1),
('Webcam Logitech C920', 'Perifèrics', 79.99, 7, 1),
('Disc SSD Samsung 1TB', 'Emmagatzematge', 89.99, 25, 1),
('Disc SSD Kingston 500GB', 'Emmagatzematge', 49.99, 20, 1),
('Disc Dur Extern WD 2TB', 'Emmagatzematge', 69.99, 11, 1),
('Memòria RAM 16GB DDR5', 'Components', 79.99, 13, 1),
('Memòria RAM 32GB DDR5', 'Components', 139.99, 6, 1),
('Targeta Gràfica RTX 4060', 'Components', 399.00, 3, 1),
('Router WiFi 6 TP-Link', 'Xarxa', 89.99, 8, 1),
('Switch 8 ports Netgear', 'Xarxa', 39.99, 16, 1),
('Hub USB-C 7 en 1', 'Accessoris', 34.99, 28, 1),
('Suport Portàtil Alumini', 'Accessoris', 24.99, 35, 1),
('Cable HDMI 2.1 2m', 'Accessoris', 12.99, 40, 1),
('Netejador Aire Comprimit', 'Accessoris', 7.99, 50, 1),
('Impressora HP LaserJet', 'Impressores', 249.00, 4, 1),
('Tablet Samsung Galaxy Tab A9', 'Tablets', 329.00, 7, 1);

-- ===== CLIENTS (30) =====

INSERT INTO customers (name, email, phone) VALUES
('Marc Puig', 'marc.puig@email.com', '612345678'),
('Anna Gómez', 'anna.gomez@email.com', '623456789'),
('Joan Martínez', 'joan.martinez@email.com', '634567890'),
('Laura Sánchez', 'laura.sanchez@email.com', '645678901'),
('Pere Fernández', 'pere.fernandez@email.com', '656789012'),
('Marta Torres', 'marta.torres@email.com', '667890123'),
('Jordi López', 'jordi.lopez@email.com', '678901234'),
('Núria Roca', 'nuria.roca@email.com', '689012345'),
('David Vila', 'david.vila@email.com', '690123456'),
('Carla Mas', 'carla.mas@email.com', '601234567'),
('Miquel Font', 'miquel.font@email.com', '611111111'),
('Sílvia Pons', 'silvia.pons@email.com', '622222222'),
('Francesc Sala', 'francesc.sala@email.com', '633333333'),
('Montserrat Gil', 'montserrat.gil@email.com', '644444444'),
('Albert Soler', 'albert.soler@email.com', '655555555'),
('Rosa Ferrer', 'rosa.ferrer@email.com', '666666666'),
('Enric Vidal', 'enric.vidal@email.com', '677777777'),
('Gemma Costa', 'gemma.costa@email.com', '688888888'),
('Ramon Moll', 'ramon.moll@email.com', '699999999'),
('Isabel Coll', 'isabel.coll@email.com', '600000001'),
('Xavier Bosch', 'xavier.bosch@email.com', '611000001'),
('Pilar Camps', 'pilar.camps@email.com', '622000002'),
('Toni Ribas', 'toni.ribas@email.com', '633000003'),
('Laia Nadal', 'laia.nadal@email.com', '644000004'),
('Sergi Jové', 'sergi.jove@email.com', '655000005'),
('Elena Prat', 'elena.prat@email.com', '666000006'),
('Oscar Mir', 'oscar.mir@email.com', '677000007'),
('Júlia Fàbregas', 'julia.fabregas@email.com', '688000008'),
('Pol Llenas', 'pol.llenas@email.com', '699000009'),
('Berta Casas', 'berta.casas@email.com', '600000010');

-- ===== VENDES I LÍNIES (30 vendes) =====

INSERT INTO sales (customer_id, sale_date, payment_method, total) VALUES
(1, '2025-04-01 10:15:00', 'Targeta', 649.99),
(2, '2025-04-01 11:30:00', 'Efectiu', 59.99),
(3, '2025-04-02 09:00:00', 'Targeta', 469.98),
(4, '2025-04-02 14:20:00', 'Bizum', 89.99),
(5, '2025-04-03 10:05:00', 'Targeta', 1299.00),
(6, '2025-04-03 16:45:00', 'Efectiu', 49.99),
(7, '2025-04-04 09:30:00', 'Targeta', 379.99),
(8, '2025-04-04 11:00:00', 'Bizum', 164.98),
(9, '2025-04-05 08:45:00', 'Targeta', 329.00),
(10,'2025-04-05 12:30:00', 'Efectiu', 99.00),
(1, '2025-03-20 10:00:00', 'Targeta', 139.99),
(2, '2025-03-21 11:00:00', 'Bizum', 79.99),
(3, '2025-03-22 09:30:00', 'Targeta', 1499.00),
(4, '2025-03-23 14:00:00', 'Efectiu', 69.99),
(5, '2025-03-24 10:30:00', 'Targeta', 529.00),
(11,'2025-03-25 09:00:00', 'Targeta', 699.00),
(12,'2025-03-26 10:15:00', 'Bizum', 119.00),
(13,'2025-03-27 11:45:00', 'Targeta', 399.00),
(14,'2025-03-28 09:20:00', 'Efectiu', 34.99),
(15,'2025-03-29 14:10:00', 'Targeta', 249.00),
(16,'2025-03-15 10:00:00', 'Targeta', 329.00),
(17,'2025-03-16 11:30:00', 'Bizum', 89.99),
(18,'2025-03-17 09:45:00', 'Targeta', 79.99),
(19,'2025-03-18 13:00:00', 'Efectiu', 49.99),
(20,'2025-03-19 10:30:00', 'Targeta', 59.99),
(21,'2025-02-10 09:00:00', 'Targeta', 649.99),
(22,'2025-02-11 10:30:00', 'Bizum', 379.99),
(23,'2025-02-12 11:15:00', 'Targeta', 189.99),
(24,'2025-02-13 09:30:00', 'Efectiu', 69.99),
(25,'2025-02-14 14:00:00', 'Targeta', 329.00);

INSERT INTO sale_items (sale_id, product_id, qty, unit_price, line_total) VALUES
(1, 1, 1, 649.99, 649.99),
(2, 9, 1, 59.99, 59.99),
(3, 6, 1, 379.99, 379.99),
(3, 18, 2, 44.995, 89.99),
(4, 23, 1, 89.99, 89.99),
(5, 3, 1, 1299.00, 1299.00),
(6, 18, 1, 49.99, 49.99),
(7, 6, 1, 379.99, 379.99),
(8, 10, 1, 119.00, 119.00),
(8, 14, 1, 49.99, 49.99),  
(9, 13, 1, 329.00, 329.00),
(10, 12, 1, 99.00, 99.00),
(11, 21, 1, 139.99, 139.99),
(12, 20, 1, 79.99, 79.99),
(13, 4, 1, 1499.00, 1499.00),
(14, 19, 1, 69.99, 69.99),
(15, 8, 1, 529.00, 529.00),
(16, 5, 1, 699.00, 699.00),
(17, 10, 1, 119.00, 119.00),
(18, 22, 1, 399.00, 399.00),
(19, 25, 1, 34.99, 34.99),
(20, 29, 1, 249.00, 249.00),
(21, 30, 1, 329.00, 329.00),
(22, 23, 1, 89.99, 89.99),
(23, 20, 1, 79.99, 79.99),
(24, 18, 1, 49.99, 49.99),
(25, 9, 1, 59.99, 59.99),
(26, 1, 1, 649.99, 649.99),
(27, 6, 1, 379.99, 379.99),
(28, 7, 1, 189.99, 189.99),
(29, 19, 1, 69.99, 69.99),
(30, 13, 1, 329.00, 329.00);
