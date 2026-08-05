-- ─── Gallery Enhancement Migration ──────────────────────
-- Add featured, media_type, and video_url columns to gallery.

ALTER TABLE gallery
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

ALTER TABLE gallery
  ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'image'
    CHECK (media_type IN ('image', 'video'));

ALTER TABLE gallery
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Ensure RLS is enabled on gallery
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Authenticated staff can read gallery
CREATE POLICY IF NOT EXISTS "Authenticated staff can read gallery"
  ON gallery FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated staff can insert gallery items
CREATE POLICY IF NOT EXISTS "Authenticated staff can insert gallery"
  ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated staff can update gallery items
CREATE POLICY IF NOT EXISTS "Authenticated staff can update gallery"
  ON gallery FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated staff can delete gallery items
CREATE POLICY IF NOT EXISTS "Authenticated staff can delete gallery"
  ON gallery FOR DELETE
  TO authenticated
  USING (true);