-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Secuencias para las tablas con IDs auto-incrementales
CREATE SEQUENCE IF NOT EXISTS habitaciones_id_seq;
CREATE SEQUENCE IF NOT EXISTS hoteles_id_seq;
CREATE SEQUENCE IF NOT EXISTS migrations_id_seq;


CREATE TABLE public.cache (
  key character varying NOT NULL,
  value text NOT NULL,
  expiration integer NOT NULL,
  CONSTRAINT cache_pkey PRIMARY KEY (key)
);

CREATE TABLE public.cache_locks (
  key character varying NOT NULL,
  owner character varying NOT NULL,
  expiration integer NOT NULL,
  CONSTRAINT cache_locks_pkey PRIMARY KEY (key)
);

CREATE TABLE public.hoteles (
  id bigint NOT NULL DEFAULT nextval('hoteles_id_seq'::regclass),
  nombre character varying NOT NULL UNIQUE,
  direccion character varying NOT NULL,
  ciudad character varying NOT NULL,
  nit character varying NOT NULL UNIQUE,
  numero_habitaciones integer NOT NULL,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT hoteles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.habitaciones (
  id bigint NOT NULL DEFAULT nextval('habitaciones_id_seq'::regclass),
  hotel_id bigint NOT NULL,
  tipo character varying NOT NULL CHECK (tipo::text = ANY (ARRAY['Estandar'::character varying, 'Junior'::character varying, 'Suite'::character varying]::text[])),
  acomodacion character varying NOT NULL CHECK (acomodacion::text = ANY (ARRAY['Sencilla'::character varying, 'Doble'::character varying, 'Triple'::character varying, 'Cuadruple'::character varying]::text[])),
  cantidad integer NOT NULL,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT habitaciones_pkey PRIMARY KEY (id),
  CONSTRAINT habitaciones_hotel_id_foreign FOREIGN KEY (hotel_id) REFERENCES public.hoteles(id)
);

CREATE TABLE public.migrations (
  id integer NOT NULL DEFAULT nextval('migrations_id_seq'::regclass),
  migration character varying NOT NULL,
  batch integer NOT NULL,
  CONSTRAINT migrations_pkey PRIMARY KEY (id)
);