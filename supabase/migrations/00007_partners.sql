-- ─── Partners Table ────────────────────────────────────────
-- CMS-driven partner management with logo upload support.

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  logo_url TEXT NOT NULL,
  website TEXT,
  type VARCHAR(50) DEFAULT 'government'
    CHECK (type IN ('funder', 'implementing', 'government', 'media', 'academic')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Authenticated staff can read partners"
  ON partners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated staff can insert partners"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated staff can update partners"
  ON partners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated staff can delete partners"
  ON partners FOR DELETE
  TO authenticated
  USING (true);

-- Seed default partners from public/images/partners/
INSERT INTO partners (name, slug, logo_url, type, sort_order) VALUES
  ('Siaya County Government', 'siaya-county-government', '/images/partners/siaya-county-government-logo.webp', 'government', 1),
  ('World Health Organization (WHO)', 'world-health-organization', '/images/partners/who-logo.png', 'funder', 2),
  ('Jaramogi Oginga Odinga University of Science and Technology', 'jooust', '/images/partners/jooust-logo.png', 'academic', 3)
ON CONFLICT (slug) DO NOTHING;