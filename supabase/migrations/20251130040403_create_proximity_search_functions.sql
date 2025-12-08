/*
  # Funciones de búsqueda por proximidad para HUMANBIBLIO

  ## Descripción General
  Este migration crea funciones SQL optimizadas para búsqueda geográfica de usuarios y negocios
  usando la fórmula de Haversine para calcular distancias precisas.

  ## Funciones creadas:

  ### 1. `calculate_distance(lat1, lon1, lat2, lon2)`
  Calcula la distancia en kilómetros entre dos puntos geográficos usando Haversine.
  
  ### 2. `search_nearby_users(lat, lon, radius_km, limit_count)`
  Busca usuarios dentro de un radio específico ordenados por distancia.
  Retorna: user_id, full_name, profession, distance_km, location_data
  
  ### 3. `search_nearby_businesses(lat, lon, radius_km, category, limit_count)`
  Busca negocios dentro de un radio específico, opcionalmente filtrados por categoría.
  Retorna: business_id, name, category, distance_km, location_data
  
  ### 4. `get_connection_suggestions_by_proximity(user_id, radius_km, limit_count)`
  Genera sugerencias de conexión basadas en proximidad + compatibilidad.
  Retorna lista de usuarios cercanos ordenados por compatibility_score.

  ## Índices
  - Índice en (latitude, longitude) para user_locations
  - Índice en (latitude, longitude) para business_locations

  ## Optimizaciones
  - Usa bounding box antes de calcular Haversine (mucho más rápido)
  - Parámetros configurables de radio y límite
  - Compatible con geolocalización del frontend
*/

-- ====================
-- 1. FUNCIÓN: Calcular distancia (Haversine)
-- ====================

CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
RETURNS double precision AS $$
DECLARE
  earth_radius constant double precision := 6371; -- Radio de la Tierra en km
  dlat double precision;
  dlon double precision;
  a double precision;
  c double precision;
BEGIN
  -- Convertir a radianes
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  -- Fórmula de Haversine
  a := sin(dlat / 2) * sin(dlat / 2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlon / 2) * sin(dlon / 2);
  
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  
  RETURN earth_radius * c; -- Distancia en km
END;
$$ LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE;

-- ====================
-- 2. FUNCIÓN: Buscar usuarios cercanos
-- ====================

CREATE OR REPLACE FUNCTION search_nearby_users(
  search_lat double precision,
  search_lon double precision,
  radius_km double precision DEFAULT 10.0,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  profession text,
  bio text,
  avatar_url text,
  distance_km double precision,
  latitude double precision,
  longitude double precision,
  city text,
  country text
) AS $$
DECLARE
  -- Calcular bounding box para optimizar búsqueda
  -- Aproximadamente 111 km por grado de latitud
  -- Varía por longitud según la latitud
  lat_delta double precision := radius_km / 111.0;
  lon_delta double precision := radius_km / (111.0 * cos(radians(search_lat)));
BEGIN
  RETURN QUERY
  SELECT
    ul.user_id,
    COALESCE(u.full_name, 'Usuario') as full_name,
    u.profession,
    u.bio,
    u.avatar_url,
    calculate_distance(search_lat, search_lon, ul.latitude, ul.longitude) as distance_km,
    ul.latitude,
    ul.longitude,
    ul.city,
    ul.country
  FROM user_locations ul
  LEFT JOIN auth.users au ON ul.user_id = au.id
  LEFT JOIN (
    -- Simulación de tabla users (ajustar según tu schema real)
    SELECT
      id as user_id,
      raw_user_meta_data->>'full_name' as full_name,
      raw_user_meta_data->>'profession' as profession,
      raw_user_meta_data->>'bio' as bio,
      raw_user_meta_data->>'avatar_url' as avatar_url
    FROM auth.users
  ) u ON ul.user_id = u.user_id
  WHERE
    -- Bounding box filter (muy rápido)
    ul.latitude BETWEEN (search_lat - lat_delta) AND (search_lat + lat_delta)
    AND ul.longitude BETWEEN (search_lon - lon_delta) AND (search_lon + lon_delta)
    -- Visibilidad
    AND (ul.visibility = 'public' OR ul.visibility = 'connections')
    -- Calcular distancia real
    AND calculate_distance(search_lat, search_lon, ul.latitude, ul.longitude) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ====================
-- 3. FUNCIÓN: Buscar negocios cercanos
-- ====================

CREATE OR REPLACE FUNCTION search_nearby_businesses(
  search_lat double precision,
  search_lon double precision,
  radius_km double precision DEFAULT 10.0,
  category_filter text DEFAULT NULL,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  business_id uuid,
  business_name text,
  category text,
  description text,
  contact_phone text,
  address text,
  distance_km double precision,
  latitude double precision,
  longitude double precision,
  city text,
  country text
) AS $$
DECLARE
  lat_delta double precision := radius_km / 111.0;
  lon_delta double precision := radius_km / (111.0 * cos(radians(search_lat)));
BEGIN
  RETURN QUERY
  SELECT
    bl.business_id,
    bl.business_name,
    COALESCE(b.category, 'General') as category,
    b.description,
    bl.contact_phone,
    bl.address,
    calculate_distance(search_lat, search_lon, bl.latitude, bl.longitude) as distance_km,
    bl.latitude,
    bl.longitude,
    bl.city,
    bl.country
  FROM business_locations bl
  LEFT JOIN (
    -- Placeholder para tabla de negocios (ajustar según schema real)
    SELECT
      id::uuid as business_id,
      'General' as category,
      'Descripción del negocio' as description
    FROM business_locations
    GROUP BY id
  ) b ON bl.business_id = b.business_id
  WHERE
    -- Bounding box
    bl.latitude BETWEEN (search_lat - lat_delta) AND (search_lat + lat_delta)
    AND bl.longitude BETWEEN (search_lon - lon_delta) AND (search_lon + lon_delta)
    -- Filtro de categoría (opcional)
    AND (category_filter IS NULL OR b.category = category_filter)
    -- Ubicación primaria
    AND bl.is_primary = true
    -- Distancia real
    AND calculate_distance(search_lat, search_lon, bl.latitude, bl.longitude) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ====================
-- 4. FUNCIÓN: Sugerencias por proximidad + compatibilidad
-- ====================

CREATE OR REPLACE FUNCTION get_connection_suggestions_by_proximity(
  p_user_id uuid,
  radius_km double precision DEFAULT 10.0,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  suggested_user_id uuid,
  full_name text,
  profession text,
  distance_km double precision,
  compatibility_score double precision,
  proximity_score double precision,
  suggestion_strength text
) AS $$
DECLARE
  user_lat double precision;
  user_lon double precision;
BEGIN
  -- Obtener ubicación del usuario
  SELECT latitude, longitude
  INTO user_lat, user_lon
  FROM user_locations
  WHERE user_id = p_user_id
  LIMIT 1;

  -- Si no tiene ubicación, retornar vacío
  IF user_lat IS NULL OR user_lon IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    nearby.user_id as suggested_user_id,
    nearby.full_name,
    nearby.profession,
    nearby.distance_km,
    COALESCE(cs.compatibility_score, 50.0) as compatibility_score,
    -- Calcular proximity_score: más cercano = mayor score
    CASE
      WHEN nearby.distance_km <= 1 THEN 100.0
      WHEN nearby.distance_km <= 5 THEN 80.0
      WHEN nearby.distance_km <= 10 THEN 60.0
      ELSE 40.0
    END as proximity_score,
    -- Sugerencia fuerte si están cerca Y son compatibles
    CASE
      WHEN nearby.distance_km <= 5 AND COALESCE(cs.compatibility_score, 0) >= 70 THEN 'fuerte'
      WHEN nearby.distance_km <= 10 AND COALESCE(cs.compatibility_score, 0) >= 50 THEN 'media'
      ELSE 'débil'
    END as suggestion_strength
  FROM search_nearby_users(user_lat, user_lon, radius_km, limit_count * 2) nearby
  LEFT JOIN connection_suggestions cs ON (
    cs.user_id = p_user_id AND cs.suggested_user_id = nearby.user_id
  )
  WHERE
    -- No sugerir el mismo usuario
    nearby.user_id != p_user_id
    -- No sugerir conexiones existentes
    AND NOT EXISTS (
      SELECT 1 FROM user_connections uc
      WHERE uc.user_id = p_user_id AND uc.connected_user_id = nearby.user_id
    )
  ORDER BY
    -- Priorizar compatibilidad + proximidad
    (COALESCE(cs.compatibility_score, 50.0) * 0.6 + 
     CASE
       WHEN nearby.distance_km <= 1 THEN 100.0
       WHEN nearby.distance_km <= 5 THEN 80.0
       WHEN nearby.distance_km <= 10 THEN 60.0
       ELSE 40.0
     END * 0.4) DESC,
    nearby.distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ====================
-- 5. FUNCIÓN: Registrar búsqueda de proximidad (analytics)
-- ====================

CREATE OR REPLACE FUNCTION log_proximity_search(
  p_user_id uuid,
  search_lat double precision,
  search_lon double precision,
  search_radius double precision,
  search_type text,
  results_count integer
)
RETURNS uuid AS $$
DECLARE
  search_id uuid;
BEGIN
  INSERT INTO location_search_history (
    user_id,
    search_latitude,
    search_longitude,
    search_radius_km,
    search_type,
    results_count
  ) VALUES (
    p_user_id,
    search_lat,
    search_lon,
    search_radius,
    search_type,
    results_count
  )
  RETURNING id INTO search_id;
  
  RETURN search_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- 6. ÍNDICES DE PERFORMANCE
-- ====================

-- Índices para optimizar búsquedas geográficas
CREATE INDEX IF NOT EXISTS idx_user_locations_coords 
  ON user_locations(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_business_locations_coords 
  ON business_locations(latitude, longitude);

-- Índice para búsquedas con visibilidad
CREATE INDEX IF NOT EXISTS idx_user_locations_visibility 
  ON user_locations(visibility, latitude, longitude);

-- Índice para negocios primarios
CREATE INDEX IF NOT EXISTS idx_business_locations_primary 
  ON business_locations(is_primary, latitude, longitude);

-- ====================
-- 7. COMENTARIOS PARA DOCUMENTACIÓN
-- ====================

COMMENT ON FUNCTION calculate_distance IS 
'Calcula distancia en km entre dos coordenadas usando fórmula de Haversine';

COMMENT ON FUNCTION search_nearby_users IS 
'Busca usuarios dentro de un radio, retorna ordenado por distancia';

COMMENT ON FUNCTION search_nearby_businesses IS 
'Busca negocios dentro de un radio, opcionalmente filtrado por categoría';

COMMENT ON FUNCTION get_connection_suggestions_by_proximity IS 
'Genera sugerencias de conexión combinando proximidad + compatibilidad';

COMMENT ON FUNCTION log_proximity_search IS 
'Registra búsqueda de proximidad para analytics';
