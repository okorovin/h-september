DROP TABLE IF EXISTS public.sales_history;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.partners;

-- SEQUENCE: public.partners_partner_id_seq

CREATE SEQUENCE IF NOT EXISTS public.partners_partner_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Table: public.partners

CREATE TABLE IF NOT EXISTS public.partners
(
    partner_id integer NOT NULL DEFAULT nextval('partners_partner_id_seq'::regclass),
    company_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    inn character varying(12) COLLATE pg_catalog."default" NOT NULL,
    contact_email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    rating numeric(2,1),
    CONSTRAINT partners_pkey PRIMARY KEY (partner_id),
    CONSTRAINT partners_inn_key UNIQUE (inn),
    CONSTRAINT partners_contact_email_key UNIQUE (contact_email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.partners
    OWNER to postgres;

ALTER SEQUENCE public.partners_partner_id_seq
    OWNED BY public.partners.partner_id;

-- SEQUENCE: public.products_product_id_seq

CREATE SEQUENCE IF NOT EXISTS public.products_product_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Table: public.products

CREATE TABLE IF NOT EXISTS public.products
(
    product_id integer NOT NULL DEFAULT nextval('products_product_id_seq'::regclass),
    product_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (product_id),
    CONSTRAINT products_product_name_key UNIQUE (product_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.products
    OWNER to postgres;

ALTER SEQUENCE public.products_product_id_seq
    OWNED BY public.products.product_id;

-- Table: public.sales_history

CREATE TABLE IF NOT EXISTS public.sales_history
(
    sale_id integer NOT NULL,
    partner_id integer NOT NULL,
    product_id integer NOT NULL,
    sale_date date NOT NULL,
    quantity integer NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    CONSTRAINT sales_history_pkey PRIMARY KEY (sale_id),
    CONSTRAINT sales_history_partner_id_fkey FOREIGN KEY (partner_id)
        REFERENCES public.partners (partner_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT sales_history_product_id_fkey FOREIGN KEY (product_id)
        REFERENCES public.products (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sales_history
    OWNER to postgres;
