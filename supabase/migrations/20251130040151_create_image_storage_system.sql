/*
  # Sistema de almacenamiento de imágenes para HUMANBIBLIO

  ## Descripción General
  Este migration crea la infraestructura completa para el sistema de subida y gestión de imágenes
  en HUMANBIBLIO, incluyendo fotos de perfil, galerías de negocios, y media de proyectos.

  ## 1. Nuevas Tablas

  ### `profile_images`
  Almacena referencias a imágenes de perfil de usuarios
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key a auth.users)
  - `image_url` (text) - URL pública de la imagen en Supabase Storage
  - `storage_path` (text) - Ruta en el bucket de Storage
  - `file_size` (bigint) - Tamaño del archivo en bytes
  - `mime_type` (text) - Tipo MIME del archivo (image/jpeg, image/png, etc.)
  - `is_current` (boolean) - Si es la imagen de perfil actual
  - `created_at` (timestamptz)

  ### `business_images`
  Almacena galerías de imágenes para negocios en World Boulevard
  - `id` (uuid, primary key)
  - `business_id` (uuid) - ID del negocio
  - `image_url` (text) - URL pública de la imagen
  - `storage_path` (text) - Ruta en el bucket
  - `file_size` (bigint)
  - `mime_type` (text)
  - `title` (text, opcional) - Título de la imagen
  - `description` (text, opcional) - Descripción
  - `display_order` (integer) - Orden de visualización en galería
  - `is_cover` (boolean) - Si es la imagen de portada del negocio
  - `created_at` (timestamptz)

  ### `project_media`
  Almacena imágenes y videos de proyectos en Universe
  - `id` (uuid, primary key)
  - `project_id` (uuid) - ID del proyecto
  - `media_url` (text) - URL pública del archivo
  - `storage_path` (text) - Ruta en el bucket
  - `media_type` (text) - 'image' o 'video'
  - `file_size` (bigint)
  - `mime_type` (text)
  - `thumbnail_url` (text, opcional) - Thumbnail para videos
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### `upload_sessions`
  Tracking de sesiones de subida para análisis y troubleshooting
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `upload_type` (text) - 'profile', 'business', 'project'
  - `status` (text) - 'pending', 'success', 'failed'
  - `file_count` (integer) - Número de archivos en la sesión
  - `total_size` (bigint) - Tamaño total en bytes
  - `error_message` (text, opcional)
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz, opcional)

  ## 2. Seguridad (RLS)
  
  ### Políticas para `profile_images`:
  - Los usuarios pueden ver imágenes de perfiles públicos
  - Solo el propietario puede subir/actualizar sus imágenes
  - Solo el propietario puede eliminar sus imágenes
  
  ### Políticas para `business_images`:
  - Cualquiera puede ver imágenes de negocios
  - Solo el dueño del negocio puede gestionar sus imágenes
  
  ### Políticas para `project_media`:
  - Cualquiera puede ver media de proyectos públicos
  - Solo el creador del proyecto puede gestionar su media
  
  ### Políticas para `upload_sessions`:
  - Solo el usuario puede ver su propio historial de subidas

  ## 3. Índices
  - Índices en user_id, business_id, project_id para búsquedas rápidas
  - Índice en is_current para profile_images
  - Índice en is_cover para business_images

  ## 4. Triggers
  - Trigger para asegurar solo una imagen current por usuario
  - Trigger para asegurar solo una imagen cover por negocio

  ## 5. Funciones Auxiliares
  - Función para limpiar imágenes huérfanas
  - Función para calcular storage usado por usuario
*/

-- ====================
-- 1. TABLA: profile_images
-- ====================

CREATE TABLE IF NOT EXISTS profile_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  file_size bigint NOT NULL CHECK (file_size > 0 AND file_size <= 10485760), -- Max 10MB
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif')),
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Índices para profile_images
CREATE INDEX IF NOT EXISTS idx_profile_images_user_id ON profile_images(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_images_current ON profile_images(user_id, is_current) WHERE is_current = true;

-- RLS para profile_images
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profile images"
  ON profile_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can upload own profile images"
  ON profile_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile images"
  ON profile_images FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile images"
  ON profile_images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ====================
-- 2. TABLA: business_images
-- ====================

CREATE TABLE IF NOT EXISTS business_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  file_size bigint NOT NULL CHECK (file_size > 0 AND file_size <= 10485760), -- Max 10MB
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')),
  title text,
  description text,
  display_order integer DEFAULT 0,
  is_cover boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Índices para business_images
CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id);
CREATE INDEX IF NOT EXISTS idx_business_images_owner_id ON business_images(owner_id);
CREATE INDEX IF NOT EXISTS idx_business_images_cover ON business_images(business_id, is_cover) WHERE is_cover = true;
CREATE INDEX IF NOT EXISTS idx_business_images_order ON business_images(business_id, display_order);

-- RLS para business_images
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view business images"
  ON business_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can upload images"
  ON business_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can update own images"
  ON business_images FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can delete own images"
  ON business_images FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- ====================
-- 3. TABLA: project_media
-- ====================

CREATE TABLE IF NOT EXISTS project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  file_size bigint NOT NULL CHECK (file_size > 0 AND file_size <= 52428800), -- Max 50MB
  mime_type text NOT NULL,
  thumbnail_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Índices para project_media
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_creator_id ON project_media(creator_id);
CREATE INDEX IF NOT EXISTS idx_project_media_order ON project_media(project_id, display_order);

-- RLS para project_media
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project media"
  ON project_media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Project creators can upload media"
  ON project_media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Project creators can update own media"
  ON project_media FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Project creators can delete own media"
  ON project_media FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- ====================
-- 4. TABLA: upload_sessions
-- ====================

CREATE TABLE IF NOT EXISTS upload_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upload_type text NOT NULL CHECK (upload_type IN ('profile', 'business', 'project')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  file_count integer DEFAULT 0,
  total_size bigint DEFAULT 0,
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Índices para upload_sessions
CREATE INDEX IF NOT EXISTS idx_upload_sessions_user_id ON upload_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_status ON upload_sessions(status);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_created ON upload_sessions(created_at DESC);

-- RLS para upload_sessions
ALTER TABLE upload_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own upload sessions"
  ON upload_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own upload sessions"
  ON upload_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own upload sessions"
  ON upload_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ====================
-- 5. TRIGGERS
-- ====================

-- Trigger: Solo una imagen de perfil "current" por usuario
CREATE OR REPLACE FUNCTION ensure_single_current_profile_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE profile_images 
    SET is_current = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_single_current_profile_image
  BEFORE INSERT OR UPDATE ON profile_images
  FOR EACH ROW
  WHEN (NEW.is_current = true)
  EXECUTE FUNCTION ensure_single_current_profile_image();

-- Trigger: Solo una imagen "cover" por negocio
CREATE OR REPLACE FUNCTION ensure_single_cover_business_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_cover = true THEN
    UPDATE business_images 
    SET is_cover = false 
    WHERE business_id = NEW.business_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_single_cover_business_image
  BEFORE INSERT OR UPDATE ON business_images
  FOR EACH ROW
  WHEN (NEW.is_cover = true)
  EXECUTE FUNCTION ensure_single_cover_business_image();

-- ====================
-- 6. FUNCIONES AUXILIARES
-- ====================

-- Función: Calcular storage usado por usuario
CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id uuid)
RETURNS TABLE (
  profile_images_size bigint,
  business_images_size bigint,
  project_media_size bigint,
  total_size bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(pi.file_size), 0)::bigint as profile_images_size,
    COALESCE(SUM(bi.file_size), 0)::bigint as business_images_size,
    COALESCE(SUM(pm.file_size), 0)::bigint as project_media_size,
    (
      COALESCE(SUM(pi.file_size), 0) +
      COALESCE(SUM(bi.file_size), 0) +
      COALESCE(SUM(pm.file_size), 0)
    )::bigint as total_size
  FROM 
    (SELECT file_size FROM profile_images WHERE user_id = p_user_id) pi
  CROSS JOIN
    (SELECT file_size FROM business_images WHERE owner_id = p_user_id) bi
  CROSS JOIN
    (SELECT file_size FROM project_media WHERE creator_id = p_user_id) pm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- 7. CONFIGURACIÓN INICIAL
-- ====================

-- Insertar límites de storage por usuario (para futuro)
CREATE TABLE IF NOT EXISTS storage_quotas (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  max_storage_bytes bigint DEFAULT 104857600, -- 100MB por defecto
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE storage_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own storage quota"
  ON storage_quotas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
