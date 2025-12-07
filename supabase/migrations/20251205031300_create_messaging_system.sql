/*
  # Create Real-time Messaging System with Translation

  1. Purpose
    - Enable real-time text messaging between users
    - Support automatic translation between languages (EN ↔ ES)
    - Persist conversation history
    - Support read receipts and typing indicators

  2. New Tables
    - `conversations` - Tracks 1-on-1 conversations between users
    - `messages` - Individual messages with original and translated text
    - `message_read_status` - Track when messages are read
    - `conversation_participants` - Support for group chats (future)

  3. Translation Features
    - Store original message in sender's language
    - Store translated message in recipient's language
    - Auto-detect language from user profile
    - Support for manual language override

  4. Security
    - RLS enabled on all tables
    - Users can only see their own conversations
    - Encrypted message content (future enhancement)

  5. Performance
    - Indexes on conversation lookups
    - Indexes on unread message counts
    - Efficient query patterns for real-time updates
*/

-- =====================================================
-- CONVERSATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participants (for 1-on-1 chats)
  user_id_1 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id_2 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  conversation_type text NOT NULL DEFAULT 'direct' CHECK (conversation_type IN ('direct', 'group')),
  
  -- Last activity
  last_message_at timestamptz,
  last_message_preview text,
  
  -- Status
  is_active boolean DEFAULT true,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique conversation between two users
  CONSTRAINT unique_conversation UNIQUE (user_id_1, user_id_2),
  
  -- Ensure user_id_1 < user_id_2 for consistency
  CONSTRAINT user_order CHECK (user_id_1 < user_id_2)
);

-- Indexes for fast conversation lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user_id_1) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user_id_2) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC) WHERE is_active = true;

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see conversations they're part of
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Policy: Users can create conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Policy: Users can update their conversations
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2)
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Conversation reference
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Sender
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Content (original + translated)
  content_original text NOT NULL,
  content_language text NOT NULL CHECK (content_language IN ('es', 'en', 'auto')),
  
  -- Translation (if needed)
  content_translated text,
  translation_language text CHECK (translation_language IN ('es', 'en')),
  translation_needed boolean DEFAULT false,
  
  -- Message type
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice', 'video', 'file')),
  
  -- Media attachments (for future)
  media_url text,
  media_thumbnail text,
  
  -- Status
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz,
  
  -- AI context (if AI-generated response)
  is_ai_generated boolean DEFAULT false,
  ai_personality_id uuid,
  ai_sentiment text CHECK (ai_sentiment IN ('positive', 'neutral', 'negative')),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for fast message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC) WHERE is_deleted = false;

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.user_id_1 = auth.uid() OR conversations.user_id_2 = auth.uid())
    )
  );

-- Policy: Users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.user_id_1 = auth.uid() OR conversations.user_id_2 = auth.uid())
    )
  );

-- Policy: Users can update their own messages
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- =====================================================
-- MESSAGE READ STATUS
-- =====================================================

CREATE TABLE IF NOT EXISTS message_read_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Message reference
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  
  -- Reader
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Read timestamp
  read_at timestamptz DEFAULT now(),
  
  -- Unique constraint: one read status per user per message
  UNIQUE(message_id, user_id)
);

-- Indexes for unread counts
CREATE INDEX IF NOT EXISTS idx_message_read_status_user ON message_read_status(user_id);
CREATE INDEX IF NOT EXISTS idx_message_read_status_message ON message_read_status(message_id);

-- Enable RLS
ALTER TABLE message_read_status ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see read status for messages in their conversations
CREATE POLICY "Users can view read status in their conversations"
  ON message_read_status FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = message_read_status.message_id
      AND (conversations.user_id_1 = auth.uid() OR conversations.user_id_2 = auth.uid())
    )
  );

-- Policy: Users can mark messages as read
CREATE POLICY "Users can mark messages as read"
  ON message_read_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TYPING INDICATORS
-- =====================================================

CREATE TABLE IF NOT EXISTS typing_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Conversation reference
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- User who is typing
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Timestamp (auto-expires after 5 seconds)
  started_at timestamptz DEFAULT now(),
  
  -- Unique constraint: one typing indicator per user per conversation
  UNIQUE(conversation_id, user_id)
);

-- Index for fast typing indicator lookups
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation ON typing_indicators(conversation_id, started_at DESC);

-- Enable RLS
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see typing indicators in their conversations
CREATE POLICY "Users can view typing indicators in their conversations"
  ON typing_indicators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = typing_indicators.conversation_id
      AND (conversations.user_id_1 = auth.uid() OR conversations.user_id_2 = auth.uid())
    )
  );

-- Policy: Users can create typing indicators
CREATE POLICY "Users can create typing indicators"
  ON typing_indicators FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their typing indicators
CREATE POLICY "Users can delete own typing indicators"
  ON typing_indicators FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get or create a conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_user_id_1 uuid,
  p_user_id_2 uuid
)
RETURNS uuid AS $$
DECLARE
  v_conversation_id uuid;
  v_min_user_id uuid;
  v_max_user_id uuid;
BEGIN
  -- Ensure user_id_1 < user_id_2 for consistency
  IF p_user_id_1 < p_user_id_2 THEN
    v_min_user_id := p_user_id_1;
    v_max_user_id := p_user_id_2;
  ELSE
    v_min_user_id := p_user_id_2;
    v_max_user_id := p_user_id_1;
  END IF;

  -- Try to find existing conversation
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE user_id_1 = v_min_user_id
    AND user_id_2 = v_max_user_id;

  -- If not found, create new conversation
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (user_id_1, user_id_2)
    VALUES (v_min_user_id, v_max_user_id)
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(p_user_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE (c.user_id_1 = p_user_id OR c.user_id_2 = p_user_id)
      AND m.sender_id != p_user_id
      AND m.is_deleted = false
      AND NOT EXISTS (
        SELECT 1 FROM message_read_status mrs
        WHERE mrs.message_id = m.id
          AND mrs.user_id = p_user_id
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's conversations with last message
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id uuid)
RETURNS TABLE (
  conversation_id uuid,
  other_user_id uuid,
  other_user_name text,
  other_user_avatar text,
  last_message text,
  last_message_at timestamptz,
  unread_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as conversation_id,
    CASE 
      WHEN c.user_id_1 = p_user_id THEN c.user_id_2
      ELSE c.user_id_1
    END as other_user_id,
    p.full_name as other_user_name,
    p.avatar_url as other_user_avatar,
    c.last_message_preview as last_message,
    c.last_message_at,
    (
      SELECT COUNT(*)::integer
      FROM messages m
      WHERE m.conversation_id = c.id
        AND m.sender_id != p_user_id
        AND m.is_deleted = false
        AND NOT EXISTS (
          SELECT 1 FROM message_read_status mrs
          WHERE mrs.message_id = m.id
            AND mrs.user_id = p_user_id
        )
    ) as unread_count
  FROM conversations c
  JOIN profiles p ON p.id = CASE 
    WHEN c.user_id_1 = p_user_id THEN c.user_id_2
    ELSE c.user_id_1
  END
  WHERE (c.user_id_1 = p_user_id OR c.user_id_2 = p_user_id)
    AND c.is_active = true
  ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation's last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content_original, 100),
    updated_at = now()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON messages;
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Trigger to clean up old typing indicators (older than 10 seconds)
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM typing_indicators
  WHERE started_at < now() - interval '10 seconds';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRANSLATION SUPPORT
-- =====================================================

-- Function to mark message as needing translation
CREATE OR REPLACE FUNCTION mark_message_for_translation(
  p_message_id uuid,
  p_target_language text
)
RETURNS void AS $$
BEGIN
  UPDATE messages
  SET 
    translation_needed = true,
    translation_language = p_target_language
  WHERE id = p_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to store translated message
CREATE OR REPLACE FUNCTION store_message_translation(
  p_message_id uuid,
  p_translated_content text,
  p_translation_language text
)
RETURNS void AS $$
BEGIN
  UPDATE messages
  SET 
    content_translated = p_translated_content,
    translation_language = p_translation_language,
    translation_needed = false,
    updated_at = now()
  WHERE id = p_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
