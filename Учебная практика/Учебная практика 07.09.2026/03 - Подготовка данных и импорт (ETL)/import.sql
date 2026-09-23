-- импорт очищенных данных
TRUNCATE TABLE sales_history, products, partners RESTART IDENTITY CASCADE;

-- партнёры
\copy partners(partner_id, company_name, inn, contact_email, phone, rating) FROM 'partners_clean.csv' CSV HEADER

-- продажи грузим во временную таблицу, там product_name
CREATE TEMP TABLE stg_sales (
    sale_id int,
    partner_id int,
    product_name varchar(150),
    sale_date date,
    quantity int,
    total_amount numeric(12,2)
);

\copy stg_sales FROM 'sales_clean.csv' CSV HEADER

-- товары из уникальных названий
INSERT INTO products(product_name)
SELECT DISTINCT product_name FROM stg_sales;

-- история продаж: вместо названия ставим product_id
INSERT INTO sales_history(sale_id, partner_id, product_id, sale_date, quantity, total_amount)
SELECT s.sale_id, s.partner_id, p.product_id, s.sale_date, s.quantity, s.total_amount
FROM stg_sales s
JOIN products p ON p.product_name = s.product_name;

DROP TABLE stg_sales;

-- проверка количества строк
SELECT COUNT(*) FROM partners;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM sales_history;
