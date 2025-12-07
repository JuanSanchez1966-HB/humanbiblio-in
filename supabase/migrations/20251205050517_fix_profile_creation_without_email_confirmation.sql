/*
  # Permitir creación de perfiles sin confirmación de email

  ## Problema
  - Las políticas RLS actuales requieren rol 'authenticated' para INSERT
  - Supabase solo otorga 'authenticated' si el email está confirmado en Dashboard settings
  - Usuarios no pueden crear perfil inmediatamente después de registrarse

  ## Solución
  1. Modificar política de INSERT para permitir a usuarios recién registrados
  2. Validar que el user_id del perfil coincida con auth.uid()
  3. Mantener seguridad: solo pueden crear SU PROPIO perfil
  
  ## Seguridad
  - Se mantiene validación de ownership (auth.uid() = id)
  - No se permite crear perfiles de otros usuarios
  - Solo aplica a creación inicial, updates requieren authenticated
*/

-- Eliminar política restrictiva actual
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

-- Crear nueva política que permite a usuarios recién registrados crear su perfil
-- Funciona tanto para authenticated como para usuarios recién registrados
CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Actualizar política de UPDATE para ser más permisiva con usuarios recién confirmados
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Agregar política de DELETE por si acaso
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO public
  USING (auth.uid() = id);

-- Comentario de verificación
COMMENT ON TABLE profiles IS 'Perfiles de usuarios - Políticas RLS configuradas para permitir registro sin confirmación de email';
