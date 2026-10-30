-- PostgreSQL Business Queries for Retail Supermarket Inventory Management System
-- Six required queries to answer common business questions

-- ============================================================================
-- QUERY 1: Top 10 Products by Sales Revenue
-- Question: Which products generate the most revenue from sales?
-- ============================================================================
SELECT
    p.product_id,
    p.product_name,
    c.category_name,
    p.unit_price,
    SUM(stl.quantity) as total_quantity_sold,
    SUM(stl.quantity * stl.unit_price) as total_revenue,
    COUNT(DISTINCT stl.sale_id) as number_of_sales
FROM products p
JOIN sales_transaction_lines stl ON p.product_id = stl.product_id
JOIN categories c ON p.category_id = c.category_id
GROUP BY p.product_id, p.product_name, c.category_name, p.unit_price
ORDER BY total_revenue DESC
LIMIT 10;

-- ============================================================================
-- QUERY 2: Low Stock Alert (Products Below Reorder Level)
-- Question: Which products are running low on stock and need to be reordered?
-- ============================================================================
SELECT
    p.product_id,
    p.product_name,
    c.category_name,
    b.branch_name,
    b.city,
    i.quantity as current_stock,
    p.reorder_level,
    (p.reorder_level - i.quantity) as units_needed,
    p.unit as unit_of_measure
FROM inventory i
JOIN products p ON i.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
JOIN branches b ON i.branch_id = b.branch_id
WHERE i.quantity <= p.reorder_level
ORDER BY i.quantity ASC;

-- ============================================================================
-- QUERY 3: Sales Performance by Category
-- Question: Which product categories generate the most revenue?
-- ============================================================================
SELECT
    c.category_id,
    c.category_name,
    COUNT(DISTINCT p.product_id) as number_of_products,
    COUNT(DISTINCT stl.sale_line_id) as total_items_sold,
    SUM(stl.quantity) as total_units_sold,
    SUM(stl.quantity * stl.unit_price) as total_revenue,
    ROUND(AVG(stl.unit_price), 2) as average_unit_price
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
LEFT JOIN sales_transaction_lines stl ON p.product_id = stl.product_id
GROUP BY c.category_id, c.category_name
ORDER BY total_revenue DESC;

-- ============================================================================
-- QUERY 4: Supplier Performance Analysis
-- Question: Which suppliers have the most purchase orders and what is the total value?
-- ============================================================================
SELECT
    s.supplier_id,
    s.supplier_name,
    s.phone,
    s.city,
    COUNT(DISTINCT po.purchase_order_id) as total_purchase_orders,
    COUNT(DISTINCT pol.purchase_order_line_id) as total_line_items,
    SUM(pol.quantity) as total_units_purchased,
    SUM(pol.quantity * pol.unit_cost) as total_purchase_value,
    ROUND(AVG(pol.unit_cost), 2) as average_unit_cost
FROM suppliers s
LEFT JOIN purchase_orders po ON s.supplier_id = po.supplier_id
LEFT JOIN purchase_order_lines pol ON po.purchase_order_id = pol.purchase_order_id
GROUP BY s.supplier_id, s.supplier_name, s.phone, s.city
ORDER BY total_purchase_value DESC;

-- ============================================================================
-- QUERY 5: Branch Performance Comparison
-- Question: How do different branches compare in terms of sales and revenue?
-- ============================================================================
SELECT
    b.branch_id,
    b.branch_name,
    b.city,
    COUNT(DISTINCT st.sale_id) as total_transactions,
    COUNT(DISTINCT e.employee_id) as employees_involved,
    COUNT(DISTINCT stl.sale_line_id) as total_items_sold,
    SUM(stl.quantity) as total_units_sold,
    SUM(stl.quantity * stl.unit_price) as total_revenue,
    ROUND(AVG(stl.quantity * stl.unit_price), 2) as average_transaction_value,
    MIN(st.sale_date) as first_sale_date,
    MAX(st.sale_date) as last_sale_date
FROM branches b
LEFT JOIN sales_transactions st ON b.branch_id = st.branch_id
LEFT JOIN sales_transaction_lines stl ON st.sale_id = stl.sale_id
LEFT JOIN employees e ON st.employee_id = e.employee_id
GROUP BY b.branch_id, b.branch_name, b.city
ORDER BY total_revenue DESC;

-- ============================================================================
-- QUERY 6: Products Never Sold
-- Question: Which products have never been sold in any transaction?
-- ============================================================================
SELECT
    p.product_id,
    p.product_name,
    c.category_name,
    p.unit,
    p.unit_price,
    p.reorder_level,
    SUM(i.quantity) as total_stock_across_branches
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN inventory i ON p.product_id = i.product_id
LEFT JOIN sales_transaction_lines stl ON p.product_id = stl.product_id
WHERE stl.sale_line_id IS NULL
GROUP BY p.product_id, p.product_name, c.category_name, p.unit, p.unit_price, p.reorder_level
ORDER BY p.product_name;
