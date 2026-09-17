-- 1. список партнёров с числом их доставок, по алфавиту
SELECT p.company_name, COUNT(s.sale_id) AS deliveries
FROM partners p
LEFT JOIN sales_history s ON s.partner_id = p.partner_id
GROUP BY p.partner_id, p.company_name
ORDER BY p.company_name;

-- 2. новый партнёр и его первая тестовая доставка одной транзакцией
BEGIN;

INSERT INTO partners (partner_id, company_name, inn, contact_email, phone, rating)
VALUES ((SELECT MAX(partner_id) + 1 FROM partners),
        'ООО "Новый Партнёр"', '7700000000', 'new@partner.ru', '+79990001122', 5.0);

INSERT INTO sales_history (sale_id, partner_id, product_id, sale_date, quantity, total_amount)
VALUES ((SELECT MAX(sale_id) + 1 FROM sales_history),
        (SELECT MAX(partner_id) FROM partners),
        1,
        CURRENT_DATE, 1, 1000.00);

COMMIT;

-- 3. история отгрузок партнёра за период
SELECT pr.product_name, s.sale_date, s.quantity, s.total_amount
FROM sales_history s
JOIN products pr ON pr.product_id = s.product_id
WHERE s.partner_id = 1
  AND s.sale_date BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY s.sale_date;
