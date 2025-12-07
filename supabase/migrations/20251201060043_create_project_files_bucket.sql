/*
  # Create Public Storage Bucket for Project Files

  1. New Storage Bucket
    - `project-files` bucket for storing downloadable project files
    - Public access enabled
    - Allows gzip, tar, zip files
    - 50MB file size limit
  
  2. Security
    - Public bucket (anyone can read)
    - Only authenticated users can upload/update
    - RLS policies for upload control
*/

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  true,
  52428800,
  ARRAY['application/gzip', 'application/x-gzip', 'application/x-tar', 'application/zip', 'application/octet-stream']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/gzip', 'application/x-gzip', 'application/x-tar', 'application/zip', 'application/octet-stream'];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for project files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project files" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for project files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-files');

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload project files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-files');

-- Allow authenticated updates
CREATE POLICY "Authenticated users can update project files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-files');