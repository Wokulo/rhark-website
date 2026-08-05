-- ─── Featured Images Storage Bucket ───────────────────────
-- Storage bucket for news and events featured images.

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('featured-images', 'featured-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated staff to upload images
CREATE POLICY IF NOT EXISTS "Authenticated staff can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'featured-images');

-- Allow everyone to read images
CREATE POLICY IF NOT EXISTS "Public can read images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'featured-images');

-- Allow authenticated staff to update images
CREATE POLICY IF NOT EXISTS "Authenticated staff can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'featured-images');

-- Allow authenticated staff to delete images
CREATE POLICY IF NOT EXISTS "Authenticated staff can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'featured-images');