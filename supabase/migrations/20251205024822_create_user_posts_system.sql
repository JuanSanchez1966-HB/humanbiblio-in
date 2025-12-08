/*
  # Create User Posts System for Agora

  1. New Tables
    - `user_posts` - User-generated content (images, videos, text)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `content_type` ('image' | 'video' | 'text')
      - `media_url` (text) - URL to image/video in storage
      - `thumbnail_url` (text) - Thumbnail for videos
      - `caption` (text) - Description/caption
      - `tags` (text[]) - Hashtags or topics
      - `likes_count` (integer)
      - `comments_count` (integer)
      - `views_count` (integer)
      - `is_public` (boolean) - Visibility setting
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `post_likes` - Track who liked what
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to user_posts)
      - `user_id` (uuid, foreign key to profiles)
      - `created_at` (timestamptz)

    - `post_comments` - Comments on posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to user_posts)
      - `user_id` (uuid, foreign key to profiles)
      - `comment_text` (text)
      - `created_at` (timestamptz)

  2. Updates to profiles table
    - `media_gallery` (jsonb[]) - Personal photo gallery
    - `gallery_updated_at` (timestamptz)
    - `cover_image_url` (text) - Banner/cover photo

  3. Security
    - Enable RLS on all new tables
    - Users can create, read, update, delete their own posts
    - Public posts are readable by all authenticated users
    - Only post owners can delete their posts

  4. Indexes
    - Performance indexes for queries by user, date, visibility
*/

-- Add multimedia columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'media_gallery'
  ) THEN
    ALTER TABLE profiles ADD COLUMN media_gallery jsonb[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'gallery_updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gallery_updated_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN cover_image_url text;
  END IF;
END $$;

-- Create user_posts table
CREATE TABLE IF NOT EXISTS user_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('image', 'video', 'text')),
  media_url text,
  thumbnail_url text,
  caption text,
  tags text[] DEFAULT '{}',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_posts
CREATE POLICY "Users can view public posts"
  ON user_posts FOR SELECT
  TO authenticated
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create own posts"
  ON user_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON user_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON user_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_likes
CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_posts_user_id ON user_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_posts_created_at ON user_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_posts_public ON user_posts(is_public, created_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

-- Function to update post counts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain counts
DROP TRIGGER IF EXISTS post_likes_count_trigger ON post_likes;
CREATE TRIGGER post_likes_count_trigger
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

DROP TRIGGER IF EXISTS post_comments_count_trigger ON post_comments;
CREATE TRIGGER post_comments_count_trigger
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- Function to update profile gallery timestamp
CREATE OR REPLACE FUNCTION update_profile_gallery_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.media_gallery IS DISTINCT FROM OLD.media_gallery 
     OR NEW.cover_image_url IS DISTINCT FROM OLD.cover_image_url THEN
    NEW.gallery_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profile_gallery_timestamp_trigger ON profiles;
CREATE TRIGGER profile_gallery_timestamp_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_gallery_timestamp();
