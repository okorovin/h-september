CREATE TABLE IF NOT EXISTS partner_types (
    partner_type_id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL UNIQUE
);

INSERT INTO partner_types (name)
VALUES ('ЗАО'), ('ООО'), ('ИП'), ('ПАО')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE partners ADD COLUMN IF NOT EXISTS partner_type_id integer REFERENCES partner_types (partner_type_id);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS director_name varchar(150);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS address varchar(255);
ALTER TABLE partners ALTER COLUMN inn DROP NOT NULL;

SELECT setval('partners_partner_id_seq', (SELECT MAX(partner_id) FROM partners));
