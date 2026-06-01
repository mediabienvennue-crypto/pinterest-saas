-- ============================================================
-- PLANNERAI — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- -------------------------------------------------------
-- TABLE 1: planners
-- Stores all AI-generated planners for p-SEO indexing
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS planners (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  topic         TEXT NOT NULL,
  title         TEXT NOT NULL,
  subtitle      TEXT,
  emoji         TEXT DEFAULT '✨',
  sections      JSONB DEFAULT '[]',   -- Array of {heading, items[{text, priority}]}
  tips          JSONB DEFAULT '[]',   -- Array of tip strings
  time_estimate TEXT,
  difficulty    TEXT DEFAULT 'Beginner',
  tags          JSONB DEFAULT '[]',   -- Array of tag strings
  seo_article   TEXT,                 -- Full markdown article
  meta_description TEXT,
  how_to_steps  JSONB DEFAULT '[]',   -- Array of {name, text} for schema.org
  view_count    INTEGER DEFAULT 0,
  share_count   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookups (used on every page load)
CREATE INDEX IF NOT EXISTS planners_slug_idx ON planners (slug);

-- Index for topic search (useful for deduplication later)
CREATE INDEX IF NOT EXISTS planners_topic_idx ON planners (topic);

-- Index for chronological listing (sitemap, recent planners)
CREATE INDEX IF NOT EXISTS planners_created_at_idx ON planners (created_at DESC);

-- -------------------------------------------------------
-- TABLE 2: leads
-- Stores email lead magnet signups
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT NOT NULL,
  planner_slug    TEXT REFERENCES planners(slug) ON DELETE SET NULL,
  planner_title   TEXT,
  source          TEXT DEFAULT 'email_planner_magnet',
  subscribed      BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one signup per email per planner
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_slug_unique 
  ON leads (email, planner_slug);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email);

-- -------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS to protect data, allow service role full access
-- -------------------------------------------------------
ALTER TABLE planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to READ planners (needed for public p-SEO pages)
CREATE POLICY "Public can read planners"
  ON planners FOR SELECT
  USING (true);

-- Only service role (server-side) can INSERT/UPDATE planners
CREATE POLICY "Service role can insert planners"
  ON planners FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update planners"
  ON planners FOR UPDATE
  USING (auth.role() = 'service_role');

-- Only service role can read/write leads (email data is private)
CREATE POLICY "Service role can manage leads"
  ON leads FOR ALL
  USING (auth.role() = 'service_role');

-- -------------------------------------------------------
-- TRIGGER: auto-update updated_at on planners
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON planners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- OPTIONAL: Sitemap helper view
-- Lists all planners for sitemap generation
-- -------------------------------------------------------
CREATE OR REPLACE VIEW sitemap_planners AS
  SELECT slug, title, created_at, updated_at
  FROM planners
  ORDER BY created_at DESC;
