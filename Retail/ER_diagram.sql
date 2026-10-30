-- ER Diagram for Retail Supermarket Inventory Management System
-- This file describes the database structure and relationships
-- Use this as a reference to create the visual ER diagram in draw.io

-- ============================================
-- TABLES AND COLUMNS
-- ============================================

-- categories
-- category_id (PK) INTEGER
-- category_name VARCHAR(100)
-- description TEXT

-- suppliers
-- supplier_id (PK) INTEGER
-- supplier_name VARCHAR(150)
-- phone VARCHAR(20)
-- city VARCHAR(50)

-- warehouses
-- warehouse_id (PK) INTEGER
-- warehouse_name VARCHAR(100)
-- city VARCHAR(50)

-- branches
-- branch_id (PK) INTEGER
-- branch_name VARCHAR(100)
-- city VARCHAR(50)

-- products
-- product_id (PK) INTEGER
-- product_name VARCHAR(200)
-- category_id (FK) → categories
-- unit VARCHAR(20)
-- unit_price DECIMAL(10,2)
-- reorder_level INTEGER

-- employees
-- employee_id (PK) INTEGER
-- first_name VARCHAR(100)
-- last_name VARCHAR(100)
-- role VARCHAR(50)
-- branch_id (FK) → branches

-- inventory
-- inventory_id (PK) INTEGER
-- product_id (FK) → products
-- branch_id (FK) → branches
-- quantity INTEGER
-- UNIQUE(product_id, branch_id)

-- purchase_orders
-- purchase_order_id (PK) INTEGER
-- supplier_id (FK) → suppliers
-- warehouse_id (FK) → warehouses
-- order_date DATE
-- status VARCHAR(20)

-- purchase_order_lines
-- purchase_order_line_id (PK) INTEGER
-- purchase_order_id (FK) → purchase_orders
-- product_id (FK) → products
-- quantity INTEGER
-- unit_cost DECIMAL(10,2)

-- sales_transactions
-- sale_id (PK) INTEGER
-- branch_id (FK) → branches
-- employee_id (FK) → employees
-- sale_date DATE

-- sales_transaction_lines
-- sale_line_id (PK) INTEGER
-- sale_id (FK) → sales_transactions
-- product_id (FK) → products
-- quantity INTEGER
-- unit_price DECIMAL(10,2)

-- ============================================
-- RELATIONSHIPS (One-to-Many)
-- ============================================

-- categories (1) ----< (N) products
-- branches (1) ----< (N) employees
-- branches (1) ----< (N) inventory
-- branches (1) ----< (N) sales_transactions
-- products (1) ----< (N) inventory
-- products (1) ----< (N) purchase_order_lines
-- products (1) ----< (N) sales_transaction_lines
-- suppliers (1) ----< (N) purchase_orders
-- warehouses (1) ----< (N) purchase_orders
-- purchase_orders (1) ----< (N) purchase_order_lines
-- sales_transactions (1) ----< (N) sales_transaction_lines
-- employees (1) ----< (N) sales_transactions

-- ============================================
-- RECORD COUNTS
-- ============================================

-- categories: 10
-- suppliers: 3
-- warehouses: 2
-- branches: 2
-- products: 30
-- employees: 5
-- inventory: 60
-- purchase_orders: 5
-- purchase_order_lines: 10
-- sales_transactions: 10
-- sales_transaction_lines: 20
