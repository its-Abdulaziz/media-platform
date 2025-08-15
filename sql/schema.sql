-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;   
CREATE EXTENSION IF NOT EXISTS unaccent;   
CREATE EXTENSION IF NOT EXISTS pg_trgm;    


CREATE TABLE IF NOT EXISTS content_managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cm_active ON content_managers(is_active);

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  language TEXT,
  type TEXT CHECK (type IN ('podcast','documentary','video','playlist')) DEFAULT 'podcast',
  duration_sec INT,
  published_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('draft','review','published','archived')) DEFAULT 'draft',
  thumbnail_url TEXT,

  created_by UUID REFERENCES content_managers(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES content_managers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  search_vec TSVECTOR
);