/*
  # Arreglar TODAS las políticas RLS para permitir registro sin confirmación de email
  
  ## Problema
  - Múltiples tablas requieren rol 'authenticated' que depende de email_confirmed en Dashboard
  - Usuarios no pueden usar funcionalidades después de registrarse
  
  ## Solución
  - Cambiar todas las políticas críticas de 'authenticated' a 'public'
  - Mantener validación de ownership con auth.uid()
  - Garantizar que funcione independientemente de configuración de Dashboard
  
  ## Tablas afectadas
  - wb_businesses (World Boulevard)
  - user_posts (Agora posts)
  - conversations (Mensajería)
  - messages (Mensajería)
  - post_likes, post_comments (Interacciones)
  
  ## Seguridad
  - Se mantiene auth.uid() = id/owner_id/user_id
  - Solo pueden crear/modificar su propio contenido
  - No se compromete seguridad, solo se remueve dependencia de email confirmation
*/

-- ===========================================
-- WB_BUSINESSES: Permitir crear negocios sin confirmación
-- ===========================================

DROP POLICY IF EXISTS "Users can create own business" ON wb_businesses;
CREATE POLICY "Users can create own business"
  ON wb_businesses
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update own business" ON wb_businesses;
CREATE POLICY "Owners can update own business"
  ON wb_businesses
  FOR UPDATE
  TO public
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete own business" ON wb_businesses;
CREATE POLICY "Owners can delete own business"
  ON wb_businesses
  FOR DELETE
  TO public
  USING (auth.uid() = owner_id);

-- ===========================================
-- USER_POSTS: Permitir crear posts sin confirmación
-- ===========================================

DROP POLICY IF EXISTS "Users can create own posts" ON user_posts;
CREATE POLICY "Users can create own posts"
  ON user_posts
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON user_posts;
CREATE POLICY "Users can update own posts"
  ON user_posts
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON user_posts;
CREATE POLICY "Users can delete own posts"
  ON user_posts
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Permitir ver posts públicos a todos
DROP POLICY IF EXISTS "Users can view public posts" ON user_posts;
CREATE POLICY "Users can view public posts"
  ON user_posts
  FOR SELECT
  TO public
  USING (is_public = true OR auth.uid() = user_id);

-- ===========================================
-- CONVERSATIONS: Permitir crear conversaciones sin confirmación
-- ===========================================

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
CREATE POLICY "Users can view own conversations"
  ON conversations
  FOR SELECT
  TO public
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
CREATE POLICY "Users can update own conversations"
  ON conversations
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2)
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- ===========================================
-- MESSAGES: Permitir enviar mensajes sin confirmación
-- ===========================================

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations"
  ON messages
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own messages" ON messages;
CREATE POLICY "Users can update own messages"
  ON messages
  FOR UPDATE
  TO public
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can delete own messages" ON messages;
CREATE POLICY "Users can delete own messages"
  ON messages
  FOR DELETE
  TO public
  USING (auth.uid() = sender_id);

-- ===========================================
-- POST_LIKES: Permitir dar likes sin confirmación
-- ===========================================

DROP POLICY IF EXISTS "Users can like posts" ON post_likes;
CREATE POLICY "Users can like posts"
  ON post_likes
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view likes" ON post_likes;
CREATE POLICY "Users can view likes"
  ON post_likes
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can unlike posts" ON post_likes;
CREATE POLICY "Users can unlike posts"
  ON post_likes
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- ===========================================
-- POST_COMMENTS: Permitir comentar sin confirmación
-- ===========================================

DROP POLICY IF EXISTS "Users can comment on posts" ON post_comments;
CREATE POLICY "Users can comment on posts"
  ON post_comments
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view comments" ON post_comments;
CREATE POLICY "Users can view comments"
  ON post_comments
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
CREATE POLICY "Users can delete own comments"
  ON post_comments
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- ===========================================
-- Comentarios de verificación
-- ===========================================

COMMENT ON TABLE wb_businesses IS 'World Boulevard businesses - RLS policies configured for registration without email confirmation';
COMMENT ON TABLE user_posts IS 'User posts - RLS policies configured for registration without email confirmation';
COMMENT ON TABLE conversations IS 'User conversations - RLS policies configured for registration without email confirmation';
COMMENT ON TABLE messages IS 'Messages - RLS policies configured for registration without email confirmation';
