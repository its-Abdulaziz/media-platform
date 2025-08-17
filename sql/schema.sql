CREATE EXTENSION IF NOT EXISTS pgcrypto;   
CREATE EXTENSION IF NOT EXISTS unaccent;   
CREATE EXTENSION IF NOT EXISTS pg_trgm;    

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS content_managers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  password_hash  TEXT NOT NULL,              
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cm_active ON content_managers(is_active);

DROP TRIGGER IF EXISTS trg_cm_updated_at ON content_managers;
CREATE TRIGGER trg_cm_updated_at
BEFORE UPDATE ON content_managers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


CREATE TABLE IF NOT EXISTS programs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  type               TEXT CHECK (type IN ('podcast','documentary','video','playlist')) DEFAULT 'podcast',
  published_at       TIMESTAMPTZ,
  status             TEXT CHECK (status IN ('draft','review','published','archived')) DEFAULT 'draft',
  content_manager_id UUID REFERENCES content_managers(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_programs_content_manager_id ON programs(content_manager_id);
CREATE INDEX IF NOT EXISTS idx_programs_published_at ON programs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_programs_title ON programs USING btree (title);

DROP TRIGGER IF EXISTS trg_programs_updated_at ON programs;
CREATE TRIGGER trg_programs_updated_at
BEFORE UPDATE ON programs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS episodes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id       UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,

  title            TEXT NOT NULL,
  description      TEXT,
  media_url        TEXT,
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  published_at     TIMESTAMPTZ,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  search_vec       TSVECTOR
);

CREATE INDEX IF NOT EXISTS idx_episodes_program_id      ON episodes(program_id);
CREATE INDEX IF NOT EXISTS idx_episodes_published_at    ON episodes(published_at);

CREATE INDEX IF NOT EXISTS idx_episodes_search          ON episodes USING GIN (search_vec);

CREATE INDEX IF NOT EXISTS idx_episodes_title_trgm      ON episodes USING GIN (title gin_trgm_ops);


DROP TRIGGER IF EXISTS trg_episodes_updated_at ON episodes;
CREATE TRIGGER trg_episodes_updated_at
BEFORE UPDATE ON episodes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


CREATE OR REPLACE FUNCTION episodes_tsv_update() RETURNS trigger AS $$
BEGIN

  NEW.search_vec :=
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.description, ''))), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_episodes_tsv ON episodes;
CREATE TRIGGER trg_episodes_tsv
BEFORE INSERT OR UPDATE OF title, description
ON episodes
FOR EACH ROW EXECUTE FUNCTION episodes_tsv_update();



CREATE OR REPLACE FUNCTION search_episodes(q TEXT, limit_count INT DEFAULT 20, skip INT DEFAULT 0)
RETURNS TABLE(
  id UUID,
  program_id UUID,
  title TEXT,
  description TEXT,
  media_url TEXT,
  published_at TIMESTAMPTZ,
  rank REAL
)
LANGUAGE sql
AS $$
  WITH cleaned AS (
    SELECT NULLIF(trim(unaccent(coalesce(q, ''))), '') AS nq
  ),
  tsq AS (
    SELECT CASE WHEN nq IS NULL THEN NULL ELSE plainto_tsquery('simple', nq) END AS ts
    FROM cleaned
  )
  
  SELECT e.id, e.program_id, e.title, e.description, e.media_url, e.published_at,
         ts_rank(e.search_vec, tsq.ts) AS rank
  FROM episodes e, tsq
  WHERE tsq.ts IS NOT NULL
    AND e.search_vec @@ tsq.ts
  ORDER BY rank DESC, e.published_at DESC NULLS LAST
  LIMIT limit_count OFFSET skip;
$$;
