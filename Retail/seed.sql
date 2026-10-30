-- PostgreSQL Seed Data for Retail Supermarket Inventory Management System
-- Data imported from CSV files

-- ============================================================================
-- CATEGORIES TABLE (10 records)
-- ============================================================================
INSERT INTO categories (category_id, category_name, description) VALUES
(1, 'Beverages', 'Drinks and bottled beverages'),
(2, 'Dairy', 'Milk and dairy products'),
(3, 'Bakery', 'Bread and baked goods'),
(4, 'Produce', 'Fresh fruits and vegetables'),
(5, 'Meat', 'Meat and poultry'),
(6, 'Snacks', 'Packaged snacks'),
(7, 'Canned Goods', 'Canned and preserved foods'),
(8, 'Frozen Foods', 'Frozen products'),
(9, 'Household', 'Household cleaning and utility items'),
(10, 'Personal Care', 'Personal hygiene products');

-- ============================================================================
-- SUPPLIERS TABLE (3 records)
-- ============================================================================
INSERT INTO suppliers (supplier_id, supplier_name, phone, city) VALUES
(1, 'Fresh Farms Supply', '+91-8000000001', 'Bengaluru'),
(2, 'Daily Needs Distributors', '+91-8000000002', 'Mysuru'),
(3, 'City Wholesale Traders', '+91-8000000003', 'Bengaluru');

-- ============================================================================
-- WAREHOUSES TABLE (2 records)
-- ============================================================================
INSERT INTO warehouses (warehouse_id, warehouse_name, city) VALUES
(1, 'Main Warehouse', 'Bengaluru'),
(2, 'North Warehouse', 'Mysuru');

-- ============================================================================
-- BRANCHES TABLE (2 records)
-- ============================================================================
INSERT INTO branches (branch_id, branch_name, city) VALUES
(1, 'Central Branch', 'Bengaluru'),
(2, 'South Branch', 'Mysuru');

-- ============================================================================
-- PRODUCTS TABLE (30 records)
-- ============================================================================
INSERT INTO products (product_id, product_name, category_id, unit, unit_price, reorder_level) VALUES
(1, 'Milk', 2, 'litre', 32.00, 15),
(2, 'Bread', 3, 'pack', 40.00, 12),
(3, 'Eggs', 2, 'pack', 75.00, 10),
(4, 'Butter', 2, 'pack', 58.00, 10),
(5, 'Cheese', 2, 'pack', 95.00, 10),
(6, 'Rice', 7, 'kg', 65.00, 20),
(7, 'Wheat Flour', 7, 'kg', 48.00, 15),
(8, 'Sugar', 7, 'kg', 45.00, 15),
(9, 'Salt', 7, 'pack', 20.00, 12),
(10, 'Cooking Oil', 7, 'litre', 145.00, 15),
(11, 'Apple', 4, 'kg', 180.00, 12),
(12, 'Banana', 4, 'kg', 60.00, 12),
(13, 'Orange', 4, 'kg', 90.00, 10),
(14, 'Potato', 4, 'kg', 35.00, 20),
(15, 'Tomato', 4, 'kg', 42.00, 20),
(16, 'Onion', 4, 'kg', 38.00, 20),
(17, 'Chicken', 5, 'kg', 220.00, 10),
(18, 'Fish', 5, 'kg', 250.00, 8),
(19, 'Yogurt', 2, 'pack', 30.00, 12),
(20, 'Ice Cream', 8, 'pack', 120.00, 8),
(21, 'Orange Juice', 1, 'litre', 85.00, 10),
(22, 'Mineral Water', 1, 'bottle', 20.00, 20),
(23, 'Tea', 1, 'pack', 110.00, 10),
(24, 'Coffee', 1, 'pack', 160.00, 8),
(25, 'Biscuits', 6, 'pack', 30.00, 15),
(26, 'Chips', 6, 'pack', 25.00, 15),
(27, 'Chocolate', 6, 'pack', 50.00, 10),
(28, 'Soap', 10, 'pcs', 35.00, 12),
(29, 'Shampoo', 10, 'bottle', 130.00, 8),
(30, 'Dishwashing Liquid', 9, 'bottle', 90.00, 10);

-- ============================================================================
-- EMPLOYEES TABLE (5 records)
-- ============================================================================
INSERT INTO employees (employee_id, first_name, last_name, role, branch_id) VALUES
(1, 'Asha', 'Rao', 'Cashier', 1),
(2, 'Rahul', 'Kumar', 'Stock Manager', 1),
(3, 'Meena', 'Sharma', 'Cashier', 2),
(4, 'Arjun', 'Patil', 'Cashier', 2),
(5, 'Priya', 'Nair', 'Stock Manager', 2);

-- ============================================================================
-- INVENTORY TABLE (60 records)
-- ============================================================================
INSERT INTO inventory (inventory_id, product_id, branch_id, quantity) VALUES
(1, 1, 1, 86),
(2, 1, 2, 19),
(3, 2, 1, 8),
(4, 2, 2, 40),
(5, 3, 1, 36),
(6, 3, 2, 33),
(7, 4, 1, 22),
(8, 4, 2, 18),
(9, 5, 1, 74),
(10, 5, 2, 7),
(11, 6, 1, 20),
(12, 6, 2, 16),
(13, 7, 1, 32),
(14, 7, 2, 34),
(15, 8, 1, 69),
(16, 8, 2, 82),
(17, 9, 1, 8),
(18, 9, 2, 76),
(19, 10, 1, 30),
(20, 10, 2, 88),
(21, 11, 1, 74),
(22, 11, 2, 58),
(23, 12, 1, 33),
(24, 12, 2, 10),
(25, 13, 1, 9),
(26, 13, 2, 59),
(27, 14, 1, 48),
(28, 14, 2, 40),
(29, 15, 1, 24),
(30, 15, 2, 32),
(31, 16, 1, 48),
(32, 16, 2, 18),
(33, 17, 1, 16),
(34, 17, 2, 53),
(35, 18, 1, 17),
(36, 18, 2, 50),
(37, 19, 1, 49),
(38, 19, 2, 10),
(39, 20, 1, 5),
(40, 20, 2, 73),
(41, 21, 1, 20),
(42, 21, 2, 53),
(43, 22, 1, 15),
(44, 22, 2, 75),
(45, 23, 1, 42),
(46, 23, 2, 85),
(47, 24, 1, 84),
(48, 24, 2, 51),
(49, 25, 1, 78),
(50, 25, 2, 29),
(51, 26, 1, 13),
(52, 26, 2, 14),
(53, 27, 1, 10),
(54, 27, 2, 34),
(55, 28, 1, 17),
(56, 28, 2, 53),
(57, 29, 1, 40),
(58, 29, 2, 63),
(59, 30, 1, 86),
(60, 30, 2, 51);

-- ============================================================================
-- PURCHASE ORDERS TABLE (5 records)
-- ============================================================================
INSERT INTO purchase_orders (purchase_order_id, supplier_id, warehouse_id, order_date, status) VALUES
(1, 1, 1, '2026-10-07', 'Received'),
(2, 2, 2, '2026-10-10', 'Received'),
(3, 3, 1, '2026-10-14', 'Pending'),
(4, 1, 2, '2026-10-16', 'Received'),
(5, 2, 1, '2026-10-18', 'Pending');

-- ============================================================================
-- PURCHASE ORDER LINES TABLE (10 records)
-- ============================================================================
INSERT INTO purchase_order_lines (purchase_order_line_id, purchase_order_id, product_id, quantity, unit_cost) VALUES
(1, 1, 1, 15, 22.00),
(2, 1, 2, 21, 25.00),
(3, 2, 6, 21, 48.00),
(4, 2, 7, 16, 35.00),
(5, 3, 11, 31, 130.00),
(6, 3, 12, 18, 40.00),
(7, 4, 21, 32, 60.00),
(8, 4, 22, 39, 10.00),
(9, 5, 28, 31, 22.00),
(10, 5, 29, 30, 90.00);

-- ============================================================================
-- SALES TRANSACTIONS TABLE (10 records)
-- ============================================================================
INSERT INTO sales_transactions (sale_id, branch_id, employee_id, sale_date) VALUES
(1, 1, 1, '2026-10-19'),
(2, 2, 3, '2026-10-19'),
(3, 1, 2, '2026-10-18'),
(4, 2, 4, '2026-10-18'),
(5, 1, 1, '2026-10-17'),
(6, 2, 3, '2026-10-16'),
(7, 1, 1, '2026-10-15'),
(8, 2, 4, '2026-10-14'),
(9, 1, 2, '2026-10-13'),
(10, 2, 3, '2026-10-11');

-- ============================================================================
-- SALES TRANSACTION LINES TABLE (20 records)
-- ============================================================================
INSERT INTO sales_transaction_lines (sale_line_id, sale_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1, 32.00),
(2, 1, 2, 5, 40.00),
(3, 2, 3, 2, 75.00),
(4, 2, 6, 5, 65.00),
(5, 3, 1, 2, 32.00),
(6, 3, 11, 2, 180.00),
(7, 4, 2, 4, 40.00),
(8, 4, 12, 4, 60.00),
(9, 5, 6, 3, 65.00),
(10, 5, 10, 5, 145.00),
(11, 6, 21, 2, 85.00),
(12, 6, 22, 3, 20.00),
(13, 7, 25, 1, 30.00),
(14, 7, 26, 2, 25.00),
(15, 8, 1, 1, 32.00),
(16, 8, 3, 3, 75.00),
(17, 9, 11, 4, 180.00),
(18, 9, 15, 3, 42.00),
(19, 10, 2, 1, 40.00),
(20, 10, 27, 2, 50.00);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'warehouses', COUNT(*) FROM warehouses
UNION ALL
SELECT 'branches', COUNT(*) FROM branches
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'inventory', COUNT(*) FROM inventory
UNION ALL
SELECT 'purchase_orders', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'purchase_order_lines', COUNT(*) FROM purchase_order_lines
UNION ALL
SELECT 'sales_transactions', COUNT(*) FROM sales_transactions
UNION ALL
SELECT 'sales_transaction_lines', COUNT(*) FROM sales_transaction_lines;
