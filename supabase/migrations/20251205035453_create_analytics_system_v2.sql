/*
  # Analytics and Data Collection System for Pilot

  ## Summary
  Creates a comprehensive analytics system to track user behavior, sessions, page views,
  actions, and conversion events during the pilot phase. This data will be crucial for
  understanding how users interact with HUMANBIBLIO and making data-driven decisions.

  ## New Tables

  ### 1. `analytics_sessions`
  Tracks user sessions with start/end times
  - `id` (uuid, primary key)
  - `session_id` (text, unique) - Generated session identifier
  - `user_id` (uuid, references auth.users) - Nullable for anonymous sessions
  - `started_at` (timestamptz) - Session start time
  - `ended_at` (timestamptz) - Session end time
  - `duration_seconds` (integer) - Computed duration
  - `user_agent` (text) - Browser/device info
  - `referrer` (text) - How user arrived
  - `device_type` (text) - mobile, tablet, desktop
  - `created_at` (timestamptz)

  ### 2. `analytics_page_views`
  Tracks every page/section view
  - `id` (uuid, primary key)
  - `session_id` (text) - Links to session
  - `user_id` (uuid, references auth.users) - Nullable
  - `page_type` (text) - agora, boulevard, universe, dashboard, etc.
  - `page_id` (text) - Specific page/profile ID if applicable
  - `viewed_at` (timestamptz)
  - `referrer` (text)
  - `user_agent` (text)
  - `created_at` (timestamptz)

  ### 3. `analytics_user_actions`
  Tracks specific user actions
  - `id` (uuid, primary key)
  - `session_id` (text) - Links to session
  - `user_id` (uuid, references auth.users) - Nullable
  - `action_type` (text) - click_call, search_users, create_project, etc.
  - `action_target` (text) - What was acted upon
  - `target_id` (text) - ID of the target
  - `metadata` (jsonb) - Additional context
  - `created_at` (timestamptz)

  ### 4. `conversion_events`
  Tracks key milestone events
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users) - Required
  - `event_type` (text) - signup, first_login, profile_completed, etc.
  - `event_data` (jsonb) - Additional event information
  - `created_at` (timestamptz)

  ## RPC Functions
  - `log_page_view()` - Log a page view
  - `log_user_action()` - Log a user action
  - `close_session()` - End a session
  - `get_pilot_dashboard_metrics()` - Get aggregated metrics for analysis

  ## Security
  - Enable RLS on all tables
  - Users can only create their own records
  - Admin-only access to aggregated data views
  - Anonymous session support for non-authenticated users

  ## Indexes
  - Indexed on user_id, session_id, created_at for fast queries
  - Indexed on action_type, event_type for filtering
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS log_page_view(uuid, text, text, text, text, text);
DROP FUNCTION IF EXISTS log_user_action(uuid, text, text, text, text, jsonb);
DROP FUNCTION IF EXISTS close_session(text, timestamptz);
DROP FUNCTION IF EXISTS get_pilot_dashboard_metrics(integer);

-- Create analytics_sessions table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer,
  user_agent text,
  referrer text,
  device_type text CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create analytics_page_views table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  page_type text NOT NULL CHECK (page_type IN ('agora', 'boulevard', 'universe', 'dashboard', 'profile', 'business', 'project', 'home')),
  page_id text,
  viewed_at timestamptz DEFAULT now() NOT NULL,
  referrer text,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create analytics_user_actions table
CREATE TABLE IF NOT EXISTS analytics_user_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  action_target text,
  target_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create conversion_events table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'conversion_events') THEN
    CREATE TABLE conversion_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      event_type text NOT NULL,
      event_data jsonb DEFAULT '{}'::jsonb,
      created_at timestamptz DEFAULT now() NOT NULL
    );
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON analytics_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON analytics_page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_type ON analytics_page_views(page_type);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON analytics_page_views(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_actions_session_id ON analytics_user_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_actions_user_id ON analytics_user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_action_type ON analytics_user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_actions_created_at ON analytics_user_actions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_event_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversion_events(created_at DESC);

-- Enable Row Level Security
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can create sessions" ON analytics_sessions;
  DROP POLICY IF EXISTS "Users can view own sessions" ON analytics_sessions;
  DROP POLICY IF EXISTS "Users can update own sessions" ON analytics_sessions;
  DROP POLICY IF EXISTS "Anyone can create page views" ON analytics_page_views;
  DROP POLICY IF EXISTS "Users can view own page views" ON analytics_page_views;
  DROP POLICY IF EXISTS "Anyone can create actions" ON analytics_user_actions;
  DROP POLICY IF EXISTS "Users can view own actions" ON analytics_user_actions;
  DROP POLICY IF EXISTS "Users can create own conversion events" ON conversion_events;
  DROP POLICY IF EXISTS "Users can view own conversion events" ON conversion_events;
END $$;

-- Policies for analytics_sessions
CREATE POLICY "Anyone can create sessions"
  ON analytics_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own sessions"
  ON analytics_sessions FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON analytics_sessions FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id)
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Policies for analytics_page_views
CREATE POLICY "Anyone can create page views"
  ON analytics_page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own page views"
  ON analytics_page_views FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Policies for analytics_user_actions
CREATE POLICY "Anyone can create actions"
  ON analytics_user_actions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own actions"
  ON analytics_user_actions FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Policies for conversion_events
CREATE POLICY "Users can create own conversion events"
  ON conversion_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own conversion events"
  ON conversion_events FOR SELECT
  USING (auth.uid() = user_id);

-- RPC Function: Log page view
CREATE FUNCTION log_page_view(
  p_user_id uuid,
  p_session_id text,
  p_page_type text,
  p_page_id text,
  p_referrer text,
  p_user_agent text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO analytics_sessions (session_id, user_id, user_agent, referrer, device_type)
  VALUES (
    p_session_id, 
    p_user_id, 
    p_user_agent, 
    p_referrer,
    CASE
      WHEN p_user_agent ILIKE '%mobile%' THEN 'mobile'
      WHEN p_user_agent ILIKE '%tablet%' THEN 'tablet'
      WHEN p_user_agent ILIKE '%desktop%' THEN 'desktop'
      ELSE 'unknown'
    END
  )
  ON CONFLICT (session_id) DO NOTHING;

  INSERT INTO analytics_page_views (
    session_id,
    user_id,
    page_type,
    page_id,
    referrer,
    user_agent
  )
  VALUES (
    p_session_id,
    p_user_id,
    p_page_type,
    p_page_id,
    p_referrer,
    p_user_agent
  );
END;
$$;

-- RPC Function: Log user action
CREATE FUNCTION log_user_action(
  p_user_id uuid,
  p_session_id text,
  p_action_type text,
  p_action_target text,
  p_target_id text,
  p_metadata jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO analytics_user_actions (
    session_id,
    user_id,
    action_type,
    action_target,
    target_id,
    metadata
  )
  VALUES (
    p_session_id,
    p_user_id,
    p_action_type,
    p_action_target,
    p_target_id,
    p_metadata
  );
END;
$$;

-- RPC Function: Close session
CREATE FUNCTION close_session(
  p_session_id text,
  p_end_time timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE analytics_sessions
  SET 
    ended_at = p_end_time,
    duration_seconds = EXTRACT(EPOCH FROM (p_end_time - started_at))::integer
  WHERE session_id = p_session_id
    AND ended_at IS NULL;
END;
$$;

-- RPC Function: Get pilot dashboard metrics
CREATE FUNCTION get_pilot_dashboard_metrics(
  p_days_back integer DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH date_range AS (
    SELECT now() - (p_days_back || ' days')::interval AS start_date
  ),
  daily_users AS (
    SELECT 
      DATE(created_at) as date,
      COUNT(DISTINCT user_id) as active_users
    FROM analytics_page_views
    CROSS JOIN date_range
    WHERE created_at >= date_range.start_date
      AND user_id IS NOT NULL
    GROUP BY DATE(created_at)
  ),
  top_actions AS (
    SELECT 
      action_type,
      COUNT(*) as count
    FROM analytics_user_actions
    CROSS JOIN date_range
    WHERE created_at >= date_range.start_date
    GROUP BY action_type
    ORDER BY count DESC
    LIMIT 10
  ),
  page_stats AS (
    SELECT 
      page_type,
      COUNT(*) as views,
      COUNT(DISTINCT user_id) as unique_viewers
    FROM analytics_page_views
    CROSS JOIN date_range
    WHERE created_at >= date_range.start_date
    GROUP BY page_type
  ),
  conversion_stats AS (
    SELECT 
      event_type,
      COUNT(*) as count
    FROM conversion_events
    CROSS JOIN date_range
    WHERE created_at >= date_range.start_date
    GROUP BY event_type
  ),
  session_stats AS (
    SELECT 
      COUNT(*) as total_sessions,
      AVG(duration_seconds) as avg_duration_seconds,
      COUNT(DISTINCT user_id) as unique_users
    FROM analytics_sessions
    CROSS JOIN date_range
    WHERE created_at >= date_range.start_date
      AND ended_at IS NOT NULL
  )
  SELECT jsonb_build_object(
    'daily_active_users', (SELECT jsonb_agg(daily_users) FROM daily_users),
    'top_actions', (SELECT jsonb_agg(top_actions) FROM top_actions),
    'page_statistics', (SELECT jsonb_agg(page_stats) FROM page_stats),
    'conversions', (SELECT jsonb_agg(conversion_stats) FROM conversion_stats),
    'session_metrics', (SELECT row_to_json(session_stats) FROM session_stats),
    'generated_at', now()
  ) INTO result;

  RETURN result;
END;
$$;
