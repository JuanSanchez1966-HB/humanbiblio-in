/*
  # Feature Interest Tracking System

  1. New Tables
    - `feature_interest`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - User who showed interest
      - `feature_name` (text) - Name of the feature (calls, translation, crm, yana)
      - `priority_vote` (integer, 1-5) - How important is this feature to user
      - `clicked_at` (timestamptz) - When user clicked
      - `created_at` (timestamptz)
    
    - `feature_feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `feature_name` (text)
      - `feedback_text` (text) - Optional feedback from user
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can insert their own interest
    - Users can view their own records
    - Admin function to view aggregated stats

  3. Indexes
    - Index on feature_name for fast aggregation
    - Index on user_id for user-specific queries
*/

-- Create feature_interest table
CREATE TABLE IF NOT EXISTS feature_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_name text NOT NULL CHECK (feature_name IN ('calls', 'translation', 'crm', 'yana')),
  priority_vote integer CHECK (priority_vote >= 1 AND priority_vote <= 5),
  clicked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, feature_name)
);

-- Create feature_feedback table
CREATE TABLE IF NOT EXISTS feature_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_name text NOT NULL CHECK (feature_name IN ('calls', 'translation', 'crm', 'yana')),
  feedback_text text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feature_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for feature_interest
CREATE POLICY "Users can insert their own interest"
  ON feature_interest
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interest"
  ON feature_interest
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own interest"
  ON feature_interest
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for feature_feedback
CREATE POLICY "Users can insert their own feedback"
  ON feature_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON feature_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feature_interest_feature_name ON feature_interest(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_interest_user_id ON feature_interest(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_interest_clicked_at ON feature_interest(clicked_at DESC);

CREATE INDEX IF NOT EXISTS idx_feature_feedback_feature_name ON feature_feedback(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_feedback_user_id ON feature_feedback(user_id);

-- Function to get aggregated feature interest stats (admin/analytics)
CREATE OR REPLACE FUNCTION get_feature_interest_stats()
RETURNS TABLE (
  feature_name text,
  total_clicks bigint,
  avg_priority numeric,
  unique_users bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    feature_name,
    COUNT(*) as total_clicks,
    ROUND(AVG(priority_vote), 2) as avg_priority,
    COUNT(DISTINCT user_id) as unique_users
  FROM feature_interest
  GROUP BY feature_name
  ORDER BY total_clicks DESC;
$$;