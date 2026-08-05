-- ─── Events Status Migration ────────────────────────────────────────
-- Add status field to events for archive functionality.

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'ongoing', 'completed', 'archived'));

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS featured_image TEXT;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Update existing events to have a status
UPDATE events SET status = 'completed' WHERE event_date < CURRENT_DATE;
UPDATE events SET status = 'upcoming' WHERE event_date >= CURRENT_DATE AND status = 'upcoming';

-- ─── RLS ──────────────────────────────────────────────────────────────
-- Ensure RLS is enabled on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Authenticated staff can read all events
CREATE POLICY IF NOT EXISTS "Authenticated staff can read events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated staff can insert events
CREATE POLICY IF NOT EXISTS "Authenticated staff can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated staff can update events
CREATE POLICY IF NOT EXISTS "Authenticated staff can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated staff can delete events
CREATE POLICY IF NOT EXISTS "Authenticated staff can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);