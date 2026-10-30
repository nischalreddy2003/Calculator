# PostgreSQL Assignment - Step by Step Guide

## Files Created:

1. **schema.sql** - Database schema with 11 tables based on your CSV data
2. **seed.sql** - Complete INSERT statements with all data from CSV files
3. **queries.sql** - 6 business queries
4. **ER_diagram_guide.md** - Instructions for creating the ER diagram

---

## Step 1: Set Up PostgreSQL Database

### Option A: Using Command Line (psql)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE inventory_management;

# Connect to the database
\c inventory_management

# Run schema file
\i 'C:/Users/badri/Desktop/PHANI/schema.sql'

# Run seed data
\i 'C:/Users/badri/Desktop/PHANI/seed.sql'

# Run queries
\i 'C:/Users/badri/Desktop/PHANI/queries.sql'
```

### Option B: Using pgAdmin

1. Open pgAdmin
2. Right-click on Databases → Create → Database
3. Name it: inventory_management
4. Open the database → Tools → Query Tool
5. Open schema.sql and execute
6. Open seed.sql and execute
7. Open queries.sql and execute

---

## Step 2: Verify Data

Run this query to check record counts:

```sql
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
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
```

Expected counts:
- categories: 10
- suppliers: 3
- warehouses: 2
- branches: 2
- products: 30
- employees: 5
- inventory: 60
- purchase_orders: 5
- purchase_order_lines: 10
- sales_transactions: 10
- sales_transaction_lines: 20

---

## Step 3: Create ER Diagram

1. Open ER_diagram_guide.md for detailed instructions
2. Go to https://app.diagrams.net/ (draw.io)
3. Create a diagram with 11 tables:
   - categories, suppliers, warehouses, branches, products, employees, inventory, purchase_orders, purchase_order_lines, sales_transactions, sales_transaction_lines
4. Draw all relationships as shown in the guide
5. Export as PDF or PNG
6. Name it: ER_diagram.pdf or ER_diagram.png

---

## Step 4: Create ZIP File

Zip these 4 files:
- schema.sql
- seed.sql
- queries.sql
- ER_diagram.pdf (or ER_diagram.png)

Name the ZIP file: LASTNAME_FIRSTNAME_MATRICNO_inventory.zip

Example: SMITH_JOHN_123456_inventory.zip

---

## Database Schema Overview:

### Tables (11 total):
1. **categories** - Product categories (10 records)
2. **suppliers** - Vendor information (3 records)
3. **warehouses** - Storage locations (2 records)
4. **branches** - Store locations (2 records)
5. **products** - Product details (30 records)
6. **employees** - Staff information (5 records)
7. **inventory** - Stock levels per branch (60 records)
8. **purchase_orders** - Orders to suppliers (5 records)
9. **purchase_order_lines** - Line items in purchase orders (10 records)
10. **sales_transactions** - Sales transactions (10 records)
11. **sales_transaction_lines** - Line items in sales (20 records)

### Key Relationships:
- categories → products (1:N)
- branches → employees (1:N)
- branches → inventory (1:N)
- branches → sales_transactions (1:N)
- products → inventory (1:N)
- products → purchase_order_lines (1:N)
- products → sales_transaction_lines (1:N)
- suppliers → purchase_orders (1:N)
- warehouses → purchase_orders (1:N)
- purchase_orders → purchase_order_lines (1:N)
- sales_transactions → sales_transaction_lines (1:N)
- employees → sales_transactions (1:N)

---

## Six Business Queries:

1. **Top 10 Products by Sales Revenue** - Which products generate the most revenue?
2. **Low Stock Alert** - Which products are below reorder level?
3. **Sales by Category** - Which categories perform best?
4. **Supplier Performance** - Which suppliers have the most purchase orders?
5. **Branch Comparison** - How do branches compare in sales?
6. **Products Never Sold** - Which products have never been sold?

---

## Assignment Details:

- Due: Wednesday, 21 October 2026, 11:59 PM
- Submit via Teams Assignment
- PostgreSQL version: 18
- Format must be exact or you get zero marks
