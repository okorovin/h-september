CREATE TABLE IF NOT EXISTS product_types (
    product_type_id SERIAL PRIMARY KEY,
    name varchar(100) NOT NULL,
    coefficient numeric(6, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS material_types (
    material_type_id SERIAL PRIMARY KEY,
    name varchar(100) NOT NULL,
    defect_percent numeric(6, 2) NOT NULL
);

INSERT INTO product_types (product_type_id, name, coefficient) VALUES
    (1, 'Тип продукции А', 1.50),
    (2, 'Тип продукции Б', 2.50),
    (3, 'Тип продукции В', 1.00)
ON CONFLICT (product_type_id) DO NOTHING;

INSERT INTO material_types (material_type_id, name, defect_percent) VALUES
    (1, 'Материал первого типа', 0.50),
    (2, 'Материал второго типа', 3.00)
ON CONFLICT (material_type_id) DO NOTHING;
