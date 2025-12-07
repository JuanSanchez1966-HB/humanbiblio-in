/*
  # Sistema de aceptación de términos y condiciones

  ## Descripción
  Sistema para gestionar la aceptación de términos y condiciones, política de privacidad,
  y otros documentos legales por parte de los usuarios.

  ## Tablas creadas:
  - legal_documents: Versiones de documentos legales
  - user_legal_acceptances: Registro de aceptaciones por usuario
*/

-- ====================
-- 1. TABLA: legal_documents
-- ====================

CREATE TABLE IF NOT EXISTS legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type text NOT NULL CHECK (
    document_type IN ('terms_of_service', 'privacy_policy', 'cookie_policy', 'community_guidelines')
  ),
  version text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  effective_date date NOT NULL,
  is_current boolean DEFAULT false,
  requires_acceptance boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(document_type, version)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_legal_docs_type ON legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_docs_current ON legal_documents(document_type, is_current) WHERE is_current = true;

-- RLS
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view legal documents"
  ON legal_documents FOR SELECT
  TO authenticated
  USING (true);

-- ====================
-- 2. TABLA: user_legal_acceptances
-- ====================

CREATE TABLE IF NOT EXISTS user_legal_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_version text NOT NULL,
  accepted_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  UNIQUE(user_id, document_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_legal_user ON user_legal_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_legal_doc ON user_legal_acceptances(document_id);
CREATE INDEX IF NOT EXISTS idx_user_legal_type ON user_legal_acceptances(user_id, document_type);

-- RLS
ALTER TABLE user_legal_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own acceptances"
  ON user_legal_acceptances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own acceptances"
  ON user_legal_acceptances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ====================
-- 3. FUNCIONES
-- ====================

-- Función: Verificar si usuario ha aceptado términos actuales
CREATE OR REPLACE FUNCTION user_has_accepted_current_terms(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  has_accepted boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_legal_acceptances ula
    INNER JOIN legal_documents ld ON ula.document_id = ld.id
    WHERE ula.user_id = p_user_id
      AND ld.document_type = 'terms_of_service'
      AND ld.is_current = true
  ) INTO has_accepted;
  
  RETURN COALESCE(has_accepted, false);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Función: Obtener documentos pendientes de aceptación
CREATE OR REPLACE FUNCTION get_pending_legal_documents(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  document_type text,
  version text,
  title text,
  content text,
  effective_date date,
  requires_acceptance boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ld.id,
    ld.document_type,
    ld.version,
    ld.title,
    ld.content,
    ld.effective_date,
    ld.requires_acceptance
  FROM legal_documents ld
  WHERE ld.is_current = true
    AND ld.requires_acceptance = true
    AND NOT EXISTS (
      SELECT 1 FROM user_legal_acceptances ula
      WHERE ula.user_id = p_user_id
        AND ula.document_id = ld.id
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Función: Registrar aceptación de documento legal
CREATE OR REPLACE FUNCTION accept_legal_document(
  p_user_id uuid,
  p_document_id uuid,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  acceptance_id uuid;
  doc_type text;
  doc_version text;
BEGIN
  -- Obtener tipo y versión del documento
  SELECT document_type, version
  INTO doc_type, doc_version
  FROM legal_documents
  WHERE id = p_document_id;

  -- Insertar aceptación
  INSERT INTO user_legal_acceptances (
    user_id,
    document_id,
    document_type,
    document_version,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_document_id,
    doc_type,
    doc_version,
    p_ip_address,
    p_user_agent
  )
  ON CONFLICT (user_id, document_id) DO UPDATE
  SET accepted_at = now()
  RETURNING id INTO acceptance_id;

  RETURN acceptance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- 4. TRIGGER
-- ====================

-- Trigger: Solo un documento current por tipo
CREATE OR REPLACE FUNCTION ensure_single_current_document()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE legal_documents
    SET is_current = false
    WHERE document_type = NEW.document_type AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_single_current_document
  BEFORE INSERT OR UPDATE ON legal_documents
  FOR EACH ROW
  WHEN (NEW.is_current = true)
  EXECUTE FUNCTION ensure_single_current_document();

-- ====================
-- 5. DATOS INICIALES
-- ====================

-- Insertar términos de servicio iniciales (versión piloto)
INSERT INTO legal_documents (
  document_type,
  version,
  title,
  content,
  effective_date,
  is_current,
  requires_acceptance
) VALUES (
  'terms_of_service',
  '1.0.0',
  'Términos de Servicio - HUMANBIBLIO Piloto',
  E'# TÉRMINOS DE SERVICIO - HUMANBIBLIO\n\n## 1. Aceptación de los Términos\n\nAl acceder y utilizar HUMANBIBLIO, aceptas estar sujeto a estos Términos de Servicio.\n\n## 2. Descripción del Servicio\n\nHUMANBIBLIO es una plataforma que conecta personas, negocios y proyectos en tu comunidad local.\n\n## 3. Uso de la Plataforma\n\n### 3.1 Registro de Usuario\n- Debes proporcionar información veraz y actualizada\n- Eres responsable de mantener la confidencialidad de tu cuenta\n- Solo mayores de 18 años pueden usar la plataforma\n\n### 3.2 Contenido del Usuario\n- Eres propietario del contenido que publicas\n- Otorgas a HUMANBIBLIO licencia para mostrar y distribuir tu contenido\n- No puedes publicar contenido ilegal, ofensivo o que viole derechos de terceros\n\n### 3.3 Conducta del Usuario\n- Debes respetar a otros usuarios\n- No puedes usar la plataforma para spam o fraude\n- No puedes hacer scraping o usar bots\n\n## 4. Privacidad\n\nTu privacidad es importante. Consulta nuestra Política de Privacidad para más información.\n\n## 5. Propiedad Intelectual\n\nTodos los derechos de propiedad intelectual de HUMANBIBLIO pertenecen a sus creadores.\n\n## 6. Limitación de Responsabilidad\n\nHUMANBIBLIO se proporciona "tal cual" sin garantías de ningún tipo.\n\n## 7. Modificaciones\n\nNos reservamos el derecho de modificar estos términos en cualquier momento.\n\n## 8. Contacto\n\nPara preguntas sobre estos términos, contacta: support@humanbiblio.com\n\n**Fecha de vigencia:** Diciembre 2024\n**Versión:** 1.0.0 (Piloto)',
  '2024-12-01',
  true,
  true
) ON CONFLICT (document_type, version) DO NOTHING;

-- Insertar política de privacidad inicial
INSERT INTO legal_documents (
  document_type,
  version,
  title,
  content,
  effective_date,
  is_current,
  requires_acceptance
) VALUES (
  'privacy_policy',
  '1.0.0',
  'Política de Privacidad - HUMANBIBLIO',
  E'# POLÍTICA DE PRIVACIDAD - HUMANBIBLIO\n\n## 1. Información que Recopilamos\n\n### 1.1 Información que proporcionas\n- Nombre, email, foto de perfil\n- Ubicación geográfica (con tu consentimiento)\n- Información de negocios y proyectos que publiques\n\n### 1.2 Información recopilada automáticamente\n- Datos de uso de la plataforma\n- Dirección IP y tipo de dispositivo\n- Cookies y tecnologías similares\n\n## 2. Cómo Usamos tu Información\n\n- Para proporcionar y mejorar nuestros servicios\n- Para conectarte con otros usuarios, negocios y proyectos\n- Para enviar notificaciones importantes\n- Para analizar el uso de la plataforma\n- Para prevenir fraude y garantizar seguridad\n\n## 3. Compartir tu Información\n\n- Con otros usuarios según tus preferencias de privacidad\n- Con proveedores de servicios (hosting, analytics)\n- Cuando sea requerido por ley\n- NO vendemos tu información personal\n\n## 4. Tus Derechos\n\n- Acceder a tu información personal\n- Corregir información incorrecta\n- Eliminar tu cuenta y datos\n- Exportar tus datos\n- Retirar consentimientos\n\n## 5. Seguridad de Datos\n\nImplementamos medidas de seguridad para proteger tu información, pero ningún sistema es 100% seguro.\n\n## 6. Geolocalización\n\nSolo accedemos a tu ubicación con tu permiso explícito. Puedes desactivarla en cualquier momento.\n\n## 7. Retención de Datos\n\nMantenemos tus datos mientras tu cuenta esté activa o según sea necesario legalmente.\n\n## 8. Menores de Edad\n\nNuestro servicio no está dirigido a menores de 18 años.\n\n## 9. Cambios a esta Política\n\nTe notificaremos sobre cambios importantes en esta política.\n\n## 10. Contacto\n\nPara ejercer tus derechos o preguntas sobre privacidad: privacy@humanbiblio.com\n\n**Fecha de vigencia:** Diciembre 2024\n**Versión:** 1.0.0 (Piloto)',
  '2024-12-01',
  true,
  false
) ON CONFLICT (document_type, version) DO NOTHING;

-- ====================
-- 6. COMENTARIOS
-- ====================

COMMENT ON TABLE legal_documents IS 'Versiones de documentos legales (términos, privacidad, etc.)';
COMMENT ON TABLE user_legal_acceptances IS 'Registro de aceptación de documentos legales por usuario';
COMMENT ON FUNCTION user_has_accepted_current_terms IS 'Verifica si usuario aceptó términos actuales';
COMMENT ON FUNCTION get_pending_legal_documents IS 'Obtiene documentos legales pendientes de aceptación';
COMMENT ON FUNCTION accept_legal_document IS 'Registra aceptación de documento legal';
