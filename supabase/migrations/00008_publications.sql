-- ─── Publications Table ──────────────────────────────
-- CMS-driven publications management with file upload support.

CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'research'
    CHECK (type IN ('annual-report', 'research', 'policy-brief', 'factsheet', 'newsletter')),
  file_url TEXT NOT NULL,
  file_size_kb INTEGER DEFAULT 0,
  file_type VARCHAR(50) DEFAULT 'pdf',
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(100) DEFAULT 'general',
  is_archived BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Authenticated staff can read publications"
  ON publications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated staff can insert publications"
  ON publications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated staff can update publications"
  ON publications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated staff can delete publications"
  ON publications FOR DELETE
  TO authenticated
  USING (true);