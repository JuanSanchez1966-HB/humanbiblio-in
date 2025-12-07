/*
  # Survey, Onboarding, and Tooltips System for Pilot

  ## Summary
  This migration creates a comprehensive feedback and guidance system for the pilot phase,
  including onboarding flows, micro-surveys, scheduled surveys, and contextual tooltips.

  ## New Tables

  ### 1. `user_onboarding_progress`
  Tracks each user's progress through the onboarding flow
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `current_step` (integer) - Current step in onboarding (0-4)
  - `completed` (boolean) - Whether onboarding is complete
  - `selected_role` (text) - User's primary interest (agora/boulevard/universe)
  - `skipped` (boolean) - If user skipped onboarding
  - `completed_at` (timestamptz) - When onboarding was completed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `surveys`
  Defines available surveys
  - `id` (uuid, primary key)
  - `survey_type` (text) - Type: 'micro', 'welcome', 'followup', 'nps', 'feature'
  - `trigger_context` (text) - When to show: 'after_registration', 'after_post', 'day_7', etc.
  - `title` (text) - Survey title
  - `questions` (jsonb) - Array of question objects
  - `active` (boolean) - Whether survey is active
  - `priority` (integer) - Display priority
  - `created_at` (timestamptz)

  ### 3. `survey_responses`
  Stores user responses to surveys
  - `id` (uuid, primary key)
  - `survey_id` (uuid, references surveys)
  - `user_id` (uuid, references auth.users)
  - `responses` (jsonb) - Question-answer pairs
  - `completed` (boolean) - Whether survey was completed
  - `created_at` (timestamptz)

  ### 4. `tooltips_seen`
  Tracks which tooltips each user has seen
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `tooltip_id` (text) - Unique identifier for tooltip
  - `seen_count` (integer) - How many times seen
  - `dismissed` (boolean) - User dismissed it
  - `created_at` (timestamptz)
  - `last_seen_at` (timestamptz)

  ### 5. `user_feedback`
  General feedback from users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `feedback_type` (text) - 'bug', 'feature_request', 'general', 'help'
  - `title` (text)
  - `description` (text)
  - `context` (jsonb) - Additional context (page, feature, etc.)
  - `status` (text) - 'new', 'reviewing', 'resolved', 'planned'
  - `priority` (text) - 'low', 'medium', 'high', 'critical'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can read/write their own onboarding progress
  - Users can create survey responses
  - Users can read active surveys
  - Users can manage their own tooltip states
  - Users can create feedback
  - Admin policies for managing surveys and feedback status

  ## Indexes
  - Index on user_id for all tables for fast lookups
  - Index on survey trigger_context for efficient survey matching
  - Index on tooltip_id for quick tooltip checks
*/

-- Create user_onboarding_progress table
CREATE TABLE IF NOT EXISTS user_onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_step integer DEFAULT 0 NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  selected_role text,
  skipped boolean DEFAULT false NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_type text NOT NULL CHECK (survey_type IN ('micro', 'welcome', 'followup', 'nps', 'feature', 'satisfaction')),
  trigger_context text NOT NULL,
  title text NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean DEFAULT true NOT NULL,
  priority integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create tooltips_seen table
CREATE TABLE IF NOT EXISTS tooltips_seen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tooltip_id text NOT NULL,
  seen_count integer DEFAULT 1 NOT NULL,
  dismissed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  last_seen_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, tooltip_id)
);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('bug', 'feature_request', 'general', 'help', 'complaint', 'praise')),
  title text NOT NULL,
  description text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'reviewing', 'resolved', 'planned', 'wont_fix')),
  priority text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON user_onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_completed ON user_onboarding_progress(completed);

CREATE INDEX IF NOT EXISTS idx_surveys_type ON surveys(survey_type);
CREATE INDEX IF NOT EXISTS idx_surveys_trigger ON surveys(trigger_context);
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(active);

CREATE INDEX IF NOT EXISTS idx_survey_responses_user ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created ON survey_responses(created_at);

CREATE INDEX IF NOT EXISTS idx_tooltips_user ON tooltips_seen(user_id);
CREATE INDEX IF NOT EXISTS idx_tooltips_id ON tooltips_seen(tooltip_id);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON user_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON user_feedback(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tooltips_seen ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for user_onboarding_progress
CREATE POLICY "Users can view own onboarding progress"
  ON user_onboarding_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding progress"
  ON user_onboarding_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress"
  ON user_onboarding_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for surveys
CREATE POLICY "Anyone can view active surveys"
  ON surveys FOR SELECT
  TO authenticated
  USING (active = true);

-- Policies for survey_responses
CREATE POLICY "Users can view own survey responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own survey responses"
  ON survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own survey responses"
  ON survey_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for tooltips_seen
CREATE POLICY "Users can view own tooltip states"
  ON tooltips_seen FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tooltip states"
  ON tooltips_seen FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tooltip states"
  ON tooltips_seen FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_feedback
CREATE POLICY "Users can view own feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create feedback"
  ON user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Insert default surveys for pilot
INSERT INTO surveys (survey_type, trigger_context, title, questions, priority) VALUES
  -- Welcome survey (Day 1)
  ('welcome', 'day_1', '¡Bienvenido a HUMANBIBLIO!', 
   '[
     {"id": "q1", "type": "rating", "question": "¿Qué tan clara fue la explicación de HUMANBIBLIO?", "scale": 5},
     {"id": "q2", "type": "choice", "question": "¿Qué te trajo aquí?", "options": ["Buscar conexiones", "Buscar negocios", "Buscar proyectos", "Explorar", "Otro"]},
     {"id": "q3", "type": "text", "question": "¿Qué esperas lograr con HUMANBIBLIO? (opcional)", "required": false}
   ]'::jsonb, 100),
  
  -- Micro-survey after creating first post
  ('micro', 'after_first_post', '¿Qué tal la experiencia?', 
   '[
     {"id": "q1", "type": "rating", "question": "¿Qué tan fácil fue crear tu primera publicación?", "scale": 5}
   ]'::jsonb, 80),
  
  -- Micro-survey after first search
  ('micro', 'after_first_search', 'Búsqueda', 
   '[
     {"id": "q1", "type": "rating", "question": "¿Encontraste lo que buscabas?", "scale": 5}
   ]'::jsonb, 70),
  
  -- NPS survey (Day 7)
  ('nps', 'day_7', 'Tu opinión es importante', 
   '[
     {"id": "q1", "type": "nps", "question": "¿Qué tan probable es que recomiendes HUMANBIBLIO a un amigo o colega?", "scale": 10},
     {"id": "q2", "type": "text", "question": "¿Por qué diste esa calificación?", "required": false}
   ]'::jsonb, 90),
  
  -- Feature satisfaction (Day 14)
  ('satisfaction', 'day_14', 'Evaluación de funcionalidades', 
   '[
     {"id": "q1", "type": "rating", "question": "¿Qué tan útiles son las conexiones en Ágora?", "scale": 5},
     {"id": "q2", "type": "rating", "question": "¿Qué tan útil es World Boulevard?", "scale": 5},
     {"id": "q3", "type": "rating", "question": "¿Qué tan útil es Universe?", "scale": 5},
     {"id": "q4", "type": "choice", "question": "¿Qué feature usas más?", "options": ["Ágora", "World Boulevard", "Universe", "Ninguna todavía"]},
     {"id": "q5", "type": "text", "question": "¿Qué feature te gustaría ver próximamente?", "required": false}
   ]'::jsonb, 85),
  
  -- Follow-up survey (Day 30)
  ('followup', 'day_30', 'Un mes con HUMANBIBLIO', 
   '[
     {"id": "q1", "type": "rating", "question": "¿Qué tan satisfecho estás con HUMANBIBLIO?", "scale": 5},
     {"id": "q2", "type": "choice", "question": "¿Has logrado conexiones valiosas?", "options": ["Sí, varias", "Sí, algunas", "No muchas", "No, ninguna"]},
     {"id": "q3", "type": "choice", "question": "¿Continuarás usando HUMANBIBLIO?", "options": ["Definitivamente sí", "Probablemente sí", "No estoy seguro", "Probablemente no", "Definitivamente no"]},
     {"id": "q4", "type": "text", "question": "¿Qué mejorarías de HUMANBIBLIO?", "required": true},
     {"id": "q5", "type": "text", "question": "¿Algún comentario adicional?", "required": false}
   ]'::jsonb, 95);
