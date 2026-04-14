CREATE DATABASE IF NOT EXISTS escola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE escola;

CREATE TABLE IF NOT EXISTS products (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  category   VARCHAR(100) NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  stock      INT NOT NULL DEFAULT 0,
  active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  phone      VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  product_id  INT NOT NULL,
  qty         INT NOT NULL DEFAULT 1,
  total       DECIMAL(10,2) NOT NULL,
  sale_date   DATE NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id)  REFERENCES products(id)
);

-- Dades de prova (26 productes)
INSERT INTO products (name, category, price, stock, active) VALUES
('Portàtil HP 15', 'Informàtica', 599.99, 12, 1),
('Ratolí Logitech', 'Perifèrics', 29.99, 45, 1),
('Teclat mecànic', 'Perifèrics', 89.99, 20, 1),
('Monitor 24"', 'Pantalles', 189.99, 8, 1),
('Auriculars Sony', 'So', 79.99, 15, 1),
('Webcam HD', 'Perifèrics', 49.99, 3, 1),
('SSD 1TB', 'Emmagatzematge', 99.99, 30, 1),
('RAM 16GB', 'Components', 59.99, 22, 1),
('Targeta gràfica RTX', 'Components', 399.99, 2, 1),
('Hub USB-C', 'Perifèrics', 39.99, 18, 1),
('Altaveus 2.1', 'So', 69.99, 10, 1),
('Càmera web 4K', 'Perifèrics', 129.99, 4, 1),
('Disco dur extern', 'Emmagatzematge', 79.99, 14, 1),
('Tauleta gràfica', 'Dibuix', 149.99, 6, 1),
('Switch 8 ports', 'Xarxa', 44.99, 9, 1),
('Cable HDMI 2m', 'Cables', 9.99, 60, 1),
('Regleta 6 endolls', 'Electricitat', 19.99, 35, 1),
('Portàtil Lenovo', 'Informàtica', 749.99, 7, 1),
('Impressora làser', 'Impressió', 299.99, 5, 1),
('Paper A4 500f', 'Oficina', 7.99, 100, 1),
('Bolígrafs pack 10', 'Oficina', 4.99, 80, 1),
('Cadira ergonòmica', 'Mobiliari', 249.99, 3, 1),
('Llum LED escriptori', 'Il·luminació', 34.99, 20, 1),
('Micròfon USB', 'So', 59.99, 11, 1),
('Almohadilla ratolí XL', 'Perifèrics', 14.99, 40, 1),
('Netbook 11"', 'Informàtica', 299.99, 0, 0);

-- Dades de prova (26 clients)
INSERT INTO customers (name, email, phone) VALUES
('Anna García', 'anna@mail.com', '612345678'),
('Joan Puig', 'joan@mail.com', '623456789'),
('Maria Ferrer', 'maria@mail.com', '634567890'),
('Pere Mas', 'pere@mail.com', '645678901'),
('Laura Vidal', 'laura@mail.com', '656789012'),
('Carles Font', 'carles@mail.com', '667890123'),
('Núria Soler', 'nuria@mail.com', '678901234'),
('Marc Roca', 'marc@mail.com', '689012345'),
('Elena Bosch', 'elena@mail.com', '690123456'),
('Jordi Serra', 'jordi@mail.com', '601234567'),
('Marta Pons', 'marta@mail.com', '612345670'),
('David Vila', 'david@mail.com', '623456780'),
('Silvia Mora', 'silvia@mail.com', '634567800'),
('Pau Gimenez', 'pau@mail.com', '645678900'),
('Rosa Llopis', 'rosa@mail.com', '656789000'),
('Antoni Sanz', 'toni@mail.com', '667890000'),
('Gemma Planas', 'gemma@mail.com', '678900000'),
('Ricard Costa', 'ricard@mail.com', '689000000'),
('Assumpta Rius', 'assumpta@mail.com', '690000000'),
('Francesc Nadal', 'francesc@mail.com', '600000001'),
('Cristina Sala', 'cristina@mail.com', '611111111'),
('Miquel Tort', 'miquel@mail.com', '622222222'),
('Berta Casas', 'berta@mail.com', '633333333'),
('Albert Mir', 'albert@mail.com', '644444444'),
('Laia Camps', 'laia@mail.com', '655555555'),
('Oriol Figueras', 'oriol@mail.com', '666666666');

-- Dades de prova (26 vendes)
INSERT INTO sales (customer_id, product_id, qty, total, sale_date) VALUES
(1, 1, 1, 599.99, CURDATE()),
(2, 2, 2, 59.98, CURDATE()),
(3, 5, 1, 79.99, CURDATE()),
(4, 7, 1, 99.99, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(5, 3, 1, 89.99, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(6, 4, 1, 189.99, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(7, 8, 2, 119.98, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(8, 10, 1, 39.99, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(9, 16, 3, 29.97, DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
(10, 18, 1, 749.99, DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(11, 6, 1, 49.99, DATE_SUB(CURDATE(), INTERVAL 8 DAY)),
(12, 13, 1, 79.99, DATE_SUB(CURDATE(), INTERVAL 9 DAY)),
(13, 11, 1, 69.99, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(14, 24, 1, 59.99, DATE_SUB(CURDATE(), INTERVAL 11 DAY)),
(15, 20, 5, 39.95, DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(16, 17, 2, 39.98, DATE_SUB(CURDATE(), INTERVAL 13 DAY)),
(17, 9, 1, 399.99, DATE_SUB(CURDATE(), INTERVAL 14 DAY)),
(18, 14, 1, 149.99, DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
(19, 23, 1, 34.99, DATE_SUB(CURDATE(), INTERVAL 16 DAY)),
(20, 25, 2, 29.98, DATE_SUB(CURDATE(), INTERVAL 17 DAY)),
(21, 12, 1, 129.99, DATE_SUB(CURDATE(), INTERVAL 18 DAY)),
(22, 15, 1, 44.99, DATE_SUB(CURDATE(), INTERVAL 19 DAY)),
(23, 19, 1, 299.99, DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
(24, 22, 1, 249.99, DATE_SUB(CURDATE(), INTERVAL 21 DAY)),
(25, 21, 3, 14.97, DATE_SUB(CURDATE(), INTERVAL 22 DAY)),
(26, 2, 1, 29.99, DATE_SUB(CURDATE(), INTERVAL 23 DAY));
