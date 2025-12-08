/*
  # Sistema de Reviews y Ratings para World Boulevard

  ## Descripción
  Sistema completo de reseñas y calificaciones para negocios en World Boulevard,
  con validación, moderación y cálculo automático de promedios.

  ## Tablas creadas:
  - business_reviews: Reseñas de usuarios para negocios
  - review_helpfulness: Sistema de "útil/no útil" para reviews
  - business_rating_summary: Tabla agregada con promedios y distribución

  ## Características:
  - Calificación de 1-5 estrellas
  - Solo usuarios autenticados pueden dejar reviews
  - Una review por usuario por negocio
  - Cálculo automático de promedio y distribución
  - Sistema de moderación
  - Reviews "helpful" voting
*/

-- ====================
-- 1. TABLA: business_reviews
-- ====================

CREATE TABLE IF NOT EXISTS business_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  not_helpful_count integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('published', 'pending', 'flagged', 'removed')),
  flagged_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_business_reviews_business ON business_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_user ON business_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_rating ON business_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_business_reviews_status ON business_reviews(status);
CREATE INDEX IF NOT EXISTS idx_business_reviews_created ON business_reviews(created_at DESC);

-- RLS
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published reviews"
  ON business_reviews FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Users can create own reviews"
  ON business_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON business_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON business_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ====================
-- 2. TABLA: review_helpfulness
-- ====================

CREATE TABLE IF NOT EXISTS review_helpfulness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES business_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_review ON review_helpfulness(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_user ON review_helpfulness(user_id);

-- RLS
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can vote on helpfulness"
  ON review_helpfulness FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON review_helpfulness FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view helpfulness votes"
  ON review_helpfulness FOR SELECT
  TO authenticated
  USING (true);

-- ====================
-- 3. TABLA: business_rating_summary
-- ====================

CREATE TABLE IF NOT EXISTS business_rating_summary (
  business_id uuid PRIMARY KEY,
  total_reviews integer DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
  rating_5_count integer DEFAULT 0,
  rating_4_count integer DEFAULT 0,
  rating_3_count integer DEFAULT 0,
  rating_2_count integer DEFAULT 0,
  rating_1_count integer DEFAULT 0,
  last_review_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_rating_summary_avg ON business_rating_summary(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_rating_summary_total ON business_rating_summary(total_reviews DESC);

-- RLS
ALTER TABLE business_rating_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rating summaries"
  ON business_rating_summary FOR SELECT
  TO authenticated
  USING (true);

-- ====================
-- 4. FUNCIONES
-- ====================

-- Función: Actualizar resumen de ratings
CREATE OR REPLACE FUNCTION update_business_rating_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular y actualizar el resumen
  INSERT INTO business_rating_summary (
    business_id,
    total_reviews,
    average_rating,
    rating_5_count,
    rating_4_count,
    rating_3_count,
    rating_2_count,
    rating_1_count,
    last_review_at,
    updated_at
  )
  SELECT
    business_id,
    COUNT(*)::integer as total_reviews,
    ROUND(AVG(rating)::numeric, 2) as average_rating,
    COUNT(*) FILTER (WHERE rating = 5)::integer as rating_5_count,
    COUNT(*) FILTER (WHERE rating = 4)::integer as rating_4_count,
    COUNT(*) FILTER (WHERE rating = 3)::integer as rating_3_count,
    COUNT(*) FILTER (WHERE rating = 2)::integer as rating_2_count,
    COUNT(*) FILTER (WHERE rating = 1)::integer as rating_1_count,
    MAX(created_at) as last_review_at,
    now() as updated_at
  FROM business_reviews
  WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    AND status = 'published'
  GROUP BY business_id
  ON CONFLICT (business_id) DO UPDATE SET
    total_reviews = EXCLUDED.total_reviews,
    average_rating = EXCLUDED.average_rating,
    rating_5_count = EXCLUDED.rating_5_count,
    rating_4_count = EXCLUDED.rating_4_count,
    rating_3_count = EXCLUDED.rating_3_count,
    rating_2_count = EXCLUDED.rating_2_count,
    rating_1_count = EXCLUDED.rating_1_count,
    last_review_at = EXCLUDED.last_review_at,
    updated_at = now();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Actualizar contador de helpful
CREATE OR REPLACE FUNCTION update_review_helpfulness_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE business_reviews
  SET
    helpful_count = (
      SELECT COUNT(*) FROM review_helpfulness
      WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
        AND is_helpful = true
    ),
    not_helpful_count = (
      SELECT COUNT(*) FROM review_helpfulness
      WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
        AND is_helpful = false
    )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Obtener reviews de un negocio con paginación
CREATE OR REPLACE FUNCTION get_business_reviews(
  p_business_id uuid,
  p_sort_by text DEFAULT 'recent', -- 'recent', 'rating_high', 'rating_low', 'helpful'
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_name text,
  rating integer,
  title text,
  comment text,
  helpful_count integer,
  not_helpful_count integer,
  created_at timestamptz,
  user_review_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    br.id,
    br.user_id,
    COALESCE(u.raw_user_meta_data->>'full_name', 'Usuario') as user_name,
    br.rating,
    br.title,
    br.comment,
    br.helpful_count,
    br.not_helpful_count,
    br.created_at,
    (SELECT COUNT(*)::integer FROM business_reviews WHERE user_id = br.user_id AND status = 'published') as user_review_count
  FROM business_reviews br
  LEFT JOIN auth.users u ON br.user_id = u.id
  WHERE br.business_id = p_business_id
    AND br.status = 'published'
  ORDER BY
    CASE
      WHEN p_sort_by = 'recent' THEN br.created_at
    END DESC,
    CASE
      WHEN p_sort_by = 'rating_high' THEN br.rating
    END DESC,
    CASE
      WHEN p_sort_by = 'rating_low' THEN br.rating
    END ASC,
    CASE
      WHEN p_sort_by = 'helpful' THEN br.helpful_count
    END DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ====================
-- 5. TRIGGERS
-- ====================

-- Trigger: Actualizar resumen al insertar/actualizar/eliminar review
CREATE TRIGGER trigger_update_rating_summary_insert
  AFTER INSERT ON business_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating_summary();

CREATE TRIGGER trigger_update_rating_summary_update
  AFTER UPDATE ON business_reviews
  FOR EACH ROW
  WHEN (OLD.rating IS DISTINCT FROM NEW.rating OR OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_business_rating_summary();

CREATE TRIGGER trigger_update_rating_summary_delete
  AFTER DELETE ON business_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating_summary();

-- Trigger: Actualizar contador de helpful/not helpful
CREATE TRIGGER trigger_update_helpfulness_count_insert
  AFTER INSERT ON review_helpfulness
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpfulness_count();

CREATE TRIGGER trigger_update_helpfulness_count_update
  AFTER UPDATE ON review_helpfulness
  FOR EACH ROW
  WHEN (OLD.is_helpful IS DISTINCT FROM NEW.is_helpful)
  EXECUTE FUNCTION update_review_helpfulness_count();

CREATE TRIGGER trigger_update_helpfulness_count_delete
  AFTER DELETE ON review_helpfulness
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpfulness_count();

-- ====================
-- 6. COMENTARIOS
-- ====================

COMMENT ON TABLE business_reviews IS 'Reseñas de usuarios para negocios en World Boulevard';
COMMENT ON TABLE review_helpfulness IS 'Sistema de votación útil/no útil para reviews';
COMMENT ON TABLE business_rating_summary IS 'Resumen agregado de ratings por negocio';
COMMENT ON FUNCTION get_business_reviews IS 'Obtiene reviews de un negocio con paginación y ordenamiento';
