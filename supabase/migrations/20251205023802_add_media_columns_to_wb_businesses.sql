/*
  # Add Media Columns to wb_businesses

  1. New Columns
    - `media_gallery` (jsonb[]) - Array of media items with URLs, types, and metadata
    - `featured_image_url` (text) - Special image for carousel/featured display
    - `gallery_updated_at` (timestamptz) - Last time gallery was updated

  2. Purpose
    - Enable businesses to upload and manage their own images
    - Support multimedia galleries for business profiles
    - Allow businesses to select a featured image for carousel display
    - Track when galleries are updated for cache invalidation

  3. Schema for media_gallery
    Each item in the array is a JSON object:
    {
      "url": "https://...",
      "type": "image" | "video",
      "title": "optional title",
      "description": "optional description",
      "order": 0
    }
*/

-- Add media columns to wb_businesses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wb_businesses' AND column_name = 'media_gallery'
  ) THEN
    ALTER TABLE wb_businesses ADD COLUMN media_gallery jsonb[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wb_businesses' AND column_name = 'featured_image_url'
  ) THEN
    ALTER TABLE wb_businesses ADD COLUMN featured_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wb_businesses' AND column_name = 'gallery_updated_at'
  ) THEN
    ALTER TABLE wb_businesses ADD COLUMN gallery_updated_at timestamptz;
  END IF;
END $$;

-- Create index for featured businesses with images
CREATE INDEX IF NOT EXISTS idx_wb_businesses_featured_image 
ON wb_businesses(is_featured, featured_image_url) 
WHERE is_featured = true AND featured_image_url IS NOT NULL;

-- Create function to update gallery_updated_at automatically
CREATE OR REPLACE FUNCTION update_gallery_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.media_gallery IS DISTINCT FROM OLD.media_gallery 
     OR NEW.avatar_url IS DISTINCT FROM OLD.avatar_url 
     OR NEW.featured_image_url IS DISTINCT FROM OLD.featured_image_url THEN
    NEW.gallery_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update gallery timestamp
DROP TRIGGER IF EXISTS update_gallery_timestamp_trigger ON wb_businesses;
CREATE TRIGGER update_gallery_timestamp_trigger
  BEFORE UPDATE ON wb_businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_timestamp();
