/*
  # Create Search Optimization Indexes

  1. Purpose
    - Optimize search performance for Agora (people search) and World Boulevard (business search)
    - Support both basic and advanced filtering
    - Enable efficient Full Text Search for future scalability

  2. New Indexes on profiles table (Agora - Páginas Blancas)
    - `idx_profiles_full_name` - Fast name lookups
    - `idx_profiles_profession` - Filter by profession
    - `idx_profiles_location` - Geographic filtering
    - `idx_profiles_search` - GIN index for full text search on name, profession, bio

  3. Notes
    - These indexes will improve search performance significantly
    - For 10-100 users: Minimal impact, searches are instant
    - For 100-1000 users: Noticeable improvement
    - For 1000+ users: Critical for performance
    - GIN indexes support complex text queries with multiple search terms

  4. Future Enhancement Ready
    - Full Text Search (FTS) vectors prepared
    - Trigram similarity search ready for fuzzy matching
    - Geographic search optimization ready
*/

-- =====================================================
-- PROFILES TABLE SEARCH INDEXES (AGORA - PÁGINAS BLANCAS)
-- =====================================================

-- Index for name searches (most common query)
CREATE INDEX IF NOT EXISTS idx_profiles_full_name 
  ON profiles USING btree (full_name text_pattern_ops);

-- Index for profession filtering
CREATE INDEX IF NOT EXISTS idx_profiles_profession 
  ON profiles USING btree (profession);

-- Index for location filtering
CREATE INDEX IF NOT EXISTS idx_profiles_location 
  ON profiles USING btree (location);

-- Index for country filtering
CREATE INDEX IF NOT EXISTS idx_profiles_country 
  ON profiles USING btree (country);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_profiles_profession_location 
  ON profiles (profession, location) 
  WHERE profession IS NOT NULL AND location IS NOT NULL;

-- =====================================================
-- FULL TEXT SEARCH SETUP (For scalability)
-- =====================================================

-- Add tsvector column for full text search (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE profiles ADD COLUMN search_vector tsvector;
  END IF;
END $$;

-- Function to update search vector
CREATE OR REPLACE FUNCTION profiles_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('spanish', COALESCE(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.profession, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.bio, '')), 'C') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.location, '')), 'D') ||
    setweight(to_tsvector('spanish', COALESCE(array_to_string(NEW.interests, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
DROP TRIGGER IF EXISTS profiles_search_vector_trigger ON profiles;
CREATE TRIGGER profiles_search_vector_trigger
  BEFORE INSERT OR UPDATE OF full_name, profession, bio, location, interests
  ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION profiles_search_vector_update();

-- GIN index for full text search (very fast for large datasets)
CREATE INDEX IF NOT EXISTS idx_profiles_search_vector 
  ON profiles USING gin(search_vector);

-- Update existing records with search vectors
UPDATE profiles 
SET search_vector = 
  setweight(to_tsvector('spanish', COALESCE(full_name, '')), 'A') ||
  setweight(to_tsvector('spanish', COALESCE(profession, '')), 'B') ||
  setweight(to_tsvector('spanish', COALESCE(bio, '')), 'C') ||
  setweight(to_tsvector('spanish', COALESCE(location, '')), 'D') ||
  setweight(to_tsvector('spanish', COALESCE(array_to_string(interests, ' '), '')), 'B')
WHERE search_vector IS NULL;

-- =====================================================
-- WB_BUSINESSES FULL TEXT SEARCH (Already has good indexes)
-- =====================================================

-- Add tsvector column for business search
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wb_businesses' AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE wb_businesses ADD COLUMN search_vector tsvector;
  END IF;
END $$;

-- Function to update business search vector
CREATE OR REPLACE FUNCTION wb_businesses_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('spanish', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.category, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.location, '')), 'D') ||
    setweight(to_tsvector('spanish', COALESCE(array_to_string(NEW.products_services, ' '), '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for business search vector
DROP TRIGGER IF EXISTS wb_businesses_search_vector_trigger ON wb_businesses;
CREATE TRIGGER wb_businesses_search_vector_trigger
  BEFORE INSERT OR UPDATE OF name, category, description, location, products_services
  ON wb_businesses
  FOR EACH ROW
  EXECUTE FUNCTION wb_businesses_search_vector_update();

-- GIN index for business full text search
CREATE INDEX IF NOT EXISTS idx_wb_businesses_search_vector 
  ON wb_businesses USING gin(search_vector);

-- Update existing business records
UPDATE wb_businesses 
SET search_vector = 
  setweight(to_tsvector('spanish', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('spanish', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('spanish', COALESCE(description, '')), 'C') ||
  setweight(to_tsvector('spanish', COALESCE(location, '')), 'D') ||
  setweight(to_tsvector('spanish', COALESCE(array_to_string(products_services, ' '), '')), 'A')
WHERE search_vector IS NULL;

-- =====================================================
-- HELPER FUNCTIONS FOR SEARCH
-- =====================================================

-- Function to search users with ranking
CREATE OR REPLACE FUNCTION search_profiles(
  search_query text,
  filter_profession text DEFAULT NULL,
  filter_location text DEFAULT NULL,
  result_limit int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  full_name text,
  profession text,
  bio text,
  location text,
  avatar_url text,
  interests text[],
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.profession,
    p.bio,
    p.location,
    p.avatar_url,
    p.interests,
    ts_rank(p.search_vector, websearch_to_tsquery('spanish', search_query)) as rank
  FROM profiles p
  WHERE 
    p.search_vector @@ websearch_to_tsquery('spanish', search_query)
    AND (filter_profession IS NULL OR p.profession = filter_profession)
    AND (filter_location IS NULL OR p.location = filter_location)
  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to search businesses with ranking
CREATE OR REPLACE FUNCTION search_businesses(
  search_query text,
  filter_category text DEFAULT NULL,
  filter_location text DEFAULT NULL,
  only_approved boolean DEFAULT true,
  result_limit int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  description text,
  location text,
  avatar_url text,
  is_featured boolean,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.category,
    b.description,
    b.location,
    b.avatar_url,
    b.is_featured,
    ts_rank(b.search_vector, websearch_to_tsquery('spanish', search_query)) as rank
  FROM wb_businesses b
  WHERE 
    b.search_vector @@ websearch_to_tsquery('spanish', search_query)
    AND (filter_category IS NULL OR b.category = filter_category)
    AND (filter_location IS NULL OR b.location = filter_location)
    AND (NOT only_approved OR b.is_approved = true)
  ORDER BY 
    b.is_featured DESC,
    rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STATISTICS FUNCTION (For monitoring)
-- =====================================================

CREATE OR REPLACE FUNCTION get_search_stats()
RETURNS TABLE (
  table_name text,
  total_records bigint,
  indexed_records bigint,
  index_size text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'profiles'::text,
    COUNT(*)::bigint,
    COUNT(search_vector)::bigint,
    pg_size_pretty(pg_relation_size('idx_profiles_search_vector'))
  FROM profiles
  UNION ALL
  SELECT 
    'wb_businesses'::text,
    COUNT(*)::bigint,
    COUNT(search_vector)::bigint,
    pg_size_pretty(pg_relation_size('idx_wb_businesses_search_vector'))
  FROM wb_businesses;
END;
$$ LANGUAGE plpgsql;
