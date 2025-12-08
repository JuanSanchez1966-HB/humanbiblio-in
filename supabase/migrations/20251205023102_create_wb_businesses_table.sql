/*
  # Create World Boulevard Businesses Table

  1. New Tables
    - `wb_businesses`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references auth.users)
      - `name` (text) - Business name
      - `name_en` (text) - Business name in English
      - `category` (text) - Business category
      - `category_en` (text) - Category in English
      - `description` (text) - Business description
      - `description_en` (text) - Description in English
      - `products_services` (text[]) - Array of products/services
      - `products_services_en` (text[]) - Products in English
      - `contact_email` (text) - Contact email
      - `contact_phone` (text) - Contact phone
      - `website` (text) - Business website URL
      - `location` (text) - Physical location
      - `target_audience` (text) - Target audience description
      - `experience` (text) - Years of experience
      - `goals` (text) - Business goals and objectives
      - `avatar_url` (text) - Profile image URL
      - `is_featured` (boolean) - Featured status for carousel
      - `subscription_tier` (text) - Subscription level
      - `trust_score` (numeric) - Business trust score
      - `is_approved` (boolean) - Approval status (default true for pilot)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `wb_businesses` table
    - Anyone can view approved businesses (public read for discovery)
    - Authenticated users can create their own business profile
    - Business owners can update their own business
    - Business owners can delete their own business

  3. Indexes
    - Index on owner_id for fast lookups
    - Index on category for filtering by category
    - Index on is_approved for filtering active businesses
    - Index on is_featured for homepage carousel queries
    - Index on created_at for sorting newest businesses

  4. Important Notes for Pilot Phase
    - `is_approved` defaults to TRUE (instant publishing, no manual approval)
    - All businesses are immediately visible to everyone
    - Perfect for pilot to reduce friction and validate demand
    - Owners maintain full control of their profiles
*/

-- Create wb_businesses table
CREATE TABLE IF NOT EXISTS wb_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  name_en text,
  category text NOT NULL,
  category_en text,
  description text NOT NULL,
  description_en text,
  products_services text[] DEFAULT '{}',
  products_services_en text[] DEFAULT '{}',
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  website text,
  location text NOT NULL,
  target_audience text,
  experience text,
  goals text,
  avatar_url text,
  is_featured boolean DEFAULT false,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise')),
  trust_score numeric DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wb_businesses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved businesses
CREATE POLICY "Anyone can view approved businesses"
  ON wb_businesses
  FOR SELECT
  USING (is_approved = true);

-- Policy: Authenticated users can create their own business
CREATE POLICY "Users can create own business"
  ON wb_businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Business owners can update their own business
CREATE POLICY "Owners can update own business"
  ON wb_businesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Business owners can delete their own business
CREATE POLICY "Owners can delete own business"
  ON wb_businesses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wb_businesses_owner_id ON wb_businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_wb_businesses_category ON wb_businesses(category);
CREATE INDEX IF NOT EXISTS idx_wb_businesses_approved ON wb_businesses(is_approved);
CREATE INDEX IF NOT EXISTS idx_wb_businesses_featured ON wb_businesses(is_featured);
CREATE INDEX IF NOT EXISTS idx_wb_businesses_created_at ON wb_businesses(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wb_businesses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_wb_businesses_updated_at_trigger ON wb_businesses;
CREATE TRIGGER update_wb_businesses_updated_at_trigger
  BEFORE UPDATE ON wb_businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_wb_businesses_updated_at();
