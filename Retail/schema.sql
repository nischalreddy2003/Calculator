-- PostgreSQL 18 Schema for Retail Supermarket Inventory Management System
-- Based on actual CSV dataset structure

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS sales_transaction_lines CASCADE;
DROP TABLE IF EXISTS sales_transactions CASCADE;
DROP TABLE IF EXISTS purchase_order_lines CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories Table
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Suppliers Table
CREATE TABLE suppliers (
    supplier_id INTEGER PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(50)
);

-- Warehouses Table
CREATE TABLE warehouses (
    warehouse_id INTEGER PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL,
    city VARCHAR(50)
);

-- Branches Table
CREATE TABLE branches (
    branch_id INTEGER PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    city VARCHAR(50)
);

-- Products Table
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES categories(category_id),
    unit VARCHAR(20),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
    reorder_level INTEGER NOT NULL CHECK (reorder_level >= 0)
);

-- Employees Table
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    branch_id INTEGER REFERENCES branches(branch_id)
);

-- Inventory Table
CREATE TABLE inventory (
    inventory_id INTEGER PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    branch_id INTEGER REFERENCES branches(branch_id),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    UNIQUE(product_id, branch_id)
);

-- Purchase Orders Table
CREATE TABLE purchase_orders (
    purchase_order_id INTEGER PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(supplier_id),
    warehouse_id INTEGER REFERENCES warehouses(warehouse_id),
    order_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Received', 'Pending', 'Cancelled'))
);

-- Purchase Order Lines Table
CREATE TABLE purchase_order_lines (
    purchase_order_line_id INTEGER PRIMARY KEY,
    purchase_order_id INTEGER REFERENCES purchase_orders(purchase_order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL CHECK (unit_cost > 0)
);

-- Sales Transactions Table
CREATE TABLE sales_transactions (
    sale_id INTEGER PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    employee_id INTEGER REFERENCES employees(employee_id),
    sale_date DATE NOT NULL
);

-- Sales Transaction Lines Table
CREATE TABLE sales_transaction_lines (
    sale_line_id INTEGER PRIMARY KEY,
    sale_id INTEGER REFERENCES sales_transactions(sale_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_branch ON inventory(branch_id);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_warehouse ON purchase_orders(warehouse_id);
CREATE INDEX idx_purchase_order_lines_order ON purchase_order_lines(purchase_order_id);
CREATE INDEX idx_purchase_order_lines_product ON purchase_order_lines(product_id);
CREATE INDEX idx_sales_transactions_branch ON sales_transactions(branch_id);
CREATE INDEX idx_sales_transactions_employee ON sales_transactions(employee_id);
CREATE INDEX idx_sales_transactions_date ON sales_transactions(sale_date);
CREATE INDEX idx_sales_transaction_lines_sale ON sales_transaction_lines(sale_id);
CREATE INDEX idx_sales_transaction_lines_product ON sales_transaction_lines(product_id);
