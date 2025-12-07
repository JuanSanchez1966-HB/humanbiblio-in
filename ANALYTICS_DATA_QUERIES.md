# Queries de Análisis de Datos para el Piloto HUMANBIBLIO

## Configuración Completa de Analítica

### ✅ Sistema Implementado

**Tablas creadas:**
- `analytics_sessions` - Sesiones de usuarios
- `analytics_page_views` - Vistas de páginas/secciones
- `analytics_user_actions` - Acciones específicas de usuarios
- `conversion_events` - Eventos de conversión (milestones)

**Funciones RPC:**
- `log_page_view()` - Registrar vista de página
- `log_user_action()` - Registrar acción de usuario
- `close_session()` - Cerrar sesión
- `get_pilot_dashboard_metrics()` - Obtener métricas agregadas

---

## 📊 QUERIES ÚTILES PARA ANÁLISIS

### 1. Dashboard General del Piloto

```sql
-- Obtener métricas completas de los últimos 30 días
SELECT * FROM get_pilot_dashboard_metrics(30);
```

Retorna un JSON con:
- Usuarios activos diarios
- Top 10 acciones más realizadas
- Estadísticas por tipo de página
- Conversiones por tipo de evento
- Métricas de sesión (promedio duración, usuarios únicos)

---

### 2. Usuarios Activos

```sql
-- Usuarios activos por día (últimos 30 días)
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users
FROM analytics_page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND user_id IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

```sql
-- Total de usuarios únicos en el piloto
SELECT COUNT(DISTINCT user_id) as total_unique_users
FROM analytics_page_views
WHERE user_id IS NOT NULL;
```

```sql
-- Usuarios más activos (por número de acciones)
SELECT
  u.id,
  u.email,
  p.full_name,
  COUNT(a.id) as total_actions
FROM analytics_user_actions a
JOIN auth.users u ON a.user_id = u.id
LEFT JOIN profiles p ON u.id = p.id
WHERE a.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.email, p.full_name
ORDER BY total_actions DESC
LIMIT 20;
```

---

### 3. Análisis de Features Más Usadas

```sql
-- Secciones más visitadas
SELECT
  page_type,
  COUNT(*) as total_views,
  COUNT(DISTINCT user_id) as unique_visitors,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_type
ORDER BY total_views DESC;
```

```sql
-- Acciones más realizadas
SELECT
  action_type,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users
FROM analytics_user_actions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY action_type
ORDER BY count DESC;
```

```sql
-- Uso de features por día de la semana
SELECT
  TO_CHAR(created_at, 'Day') as day_of_week,
  page_type,
  COUNT(*) as views
FROM analytics_page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY TO_CHAR(created_at, 'Day'), page_type
ORDER BY
  EXTRACT(DOW FROM created_at),
  views DESC;
```

---

### 4. Análisis de Sesiones

```sql
-- Estadísticas de sesión promedio
SELECT
  COUNT(*) as total_sessions,
  AVG(duration_seconds) as avg_duration_seconds,
  ROUND(AVG(duration_seconds) / 60, 2) as avg_duration_minutes,
  MIN(duration_seconds) as min_duration,
  MAX(duration_seconds) as max_duration,
  COUNT(DISTINCT user_id) as unique_users,
  device_type
FROM analytics_sessions
WHERE ended_at IS NOT NULL
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY device_type;
```

```sql
-- Sesiones más largas (usuarios más comprometidos)
SELECT
  s.session_id,
  u.email,
  p.full_name,
  s.duration_seconds,
  ROUND(s.duration_seconds / 60, 2) as duration_minutes,
  s.started_at,
  s.device_type
FROM analytics_sessions s
JOIN auth.users u ON s.user_id = u.id
LEFT JOIN profiles p ON u.id = p.id
WHERE s.ended_at IS NOT NULL
  AND s.created_at >= NOW() - INTERVAL '30 days'
ORDER BY s.duration_seconds DESC
LIMIT 20;
```

```sql
-- Distribución de dispositivos
SELECT
  device_type,
  COUNT(*) as sessions,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM analytics_sessions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY device_type
ORDER BY sessions DESC;
```

---

### 5. Análisis de Conversiones

```sql
-- Eventos de conversión por tipo
SELECT
  event_type,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users
FROM conversion_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_type
ORDER BY count DESC;
```

```sql
-- Embudo de conversión (Funnel)
WITH funnel AS (
  SELECT
    COUNT(DISTINCT CASE WHEN event_type = 'signup' THEN user_id END) as signups,
    COUNT(DISTINCT CASE WHEN event_type = 'profile_completed' THEN user_id END) as profiles_completed,
    COUNT(DISTINCT CASE WHEN event_type = 'first_search' THEN user_id END) as first_searches,
    COUNT(DISTINCT CASE WHEN event_type = 'first_connection' THEN user_id END) as first_connections,
    COUNT(DISTINCT CASE WHEN event_type = 'first_message' THEN user_id END) as first_messages
  FROM conversion_events
  WHERE created_at >= NOW() - INTERVAL '30 days'
)
SELECT
  'Signup' as stage, signups as users, 100.0 as percentage
FROM funnel
UNION ALL
SELECT
  'Profile Completed', profiles_completed,
  ROUND(profiles_completed * 100.0 / NULLIF(signups, 0), 2)
FROM funnel
UNION ALL
SELECT
  'First Search', first_searches,
  ROUND(first_searches * 100.0 / NULLIF(signups, 0), 2)
FROM funnel
UNION ALL
SELECT
  'First Connection', first_connections,
  ROUND(first_connections * 100.0 / NULLIF(signups, 0), 2)
FROM funnel
UNION ALL
SELECT
  'First Message', first_messages,
  ROUND(first_messages * 100.0 / NULLIF(signups, 0), 2)
FROM funnel;
```

```sql
-- Tiempo promedio entre conversiones
SELECT
  user_id,
  MIN(CASE WHEN event_type = 'signup' THEN created_at END) as signup_time,
  MIN(CASE WHEN event_type = 'first_search' THEN created_at END) as first_search_time,
  MIN(CASE WHEN event_type = 'first_connection' THEN created_at END) as first_connection_time,
  EXTRACT(EPOCH FROM (
    MIN(CASE WHEN event_type = 'first_search' THEN created_at END) -
    MIN(CASE WHEN event_type = 'signup' THEN created_at END)
  )) / 3600 as hours_to_first_search
FROM conversion_events
GROUP BY user_id
HAVING COUNT(*) > 1;
```

---

### 6. Análisis de Feedback y Encuestas

```sql
-- Tasa de completación de onboarding
SELECT
  COUNT(*) as total_users,
  SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_count,
  SUM(CASE WHEN skipped THEN 1 ELSE 0 END) as skipped_count,
  ROUND(SUM(CASE WHEN completed THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as completion_rate,
  ROUND(SUM(CASE WHEN skipped THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as skip_rate
FROM user_onboarding_progress;
```

```sql
-- Interés por rol/ecosistema en onboarding
SELECT
  selected_role,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM user_onboarding_progress
WHERE selected_role IS NOT NULL
GROUP BY selected_role
ORDER BY count DESC;
```

```sql
-- Tasa de respuesta a encuestas
SELECT
  s.survey_type,
  s.trigger_context,
  COUNT(DISTINCT sr.user_id) as responses,
  COUNT(DISTINCT sr.user_id) FILTER (WHERE sr.completed) as completed_responses,
  ROUND(
    COUNT(DISTINCT sr.user_id) FILTER (WHERE sr.completed) * 100.0 /
    NULLIF(COUNT(DISTINCT sr.user_id), 0),
    2
  ) as completion_rate
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
WHERE s.active = true
GROUP BY s.survey_type, s.trigger_context
ORDER BY responses DESC;
```

```sql
-- Promedio de ratings en encuestas
SELECT
  s.title as survey_title,
  jsonb_object_keys(sr.responses) as question_id,
  AVG((sr.responses->>jsonb_object_keys(sr.responses))::numeric) as avg_rating
FROM survey_responses sr
JOIN surveys s ON sr.survey_id = s.id
WHERE sr.completed = true
  AND sr.responses->>jsonb_object_keys(sr.responses) ~ '^[0-9\.]+$'
GROUP BY s.title, jsonb_object_keys(sr.responses)
ORDER BY s.title, question_id;
```

```sql
-- Feedback recibido por tipo
SELECT
  feedback_type,
  status,
  priority,
  COUNT(*) as count
FROM user_feedback
GROUP BY feedback_type, status, priority
ORDER BY
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  count DESC;
```

```sql
-- Feedback más reciente no resuelto
SELECT
  f.id,
  u.email,
  f.feedback_type,
  f.title,
  f.description,
  f.priority,
  f.created_at
FROM user_feedback f
LEFT JOIN auth.users u ON f.user_id = u.id
WHERE f.status = 'new'
ORDER BY
  CASE f.priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  f.created_at DESC
LIMIT 20;
```

---

### 7. Análisis de Retención

```sql
-- Usuarios que regresan (2+ sesiones)
WITH user_sessions AS (
  SELECT
    user_id,
    COUNT(DISTINCT DATE(created_at)) as active_days
  FROM analytics_sessions
  WHERE user_id IS NOT NULL
    AND created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT
  CASE
    WHEN active_days = 1 THEN '1 día'
    WHEN active_days BETWEEN 2 AND 3 THEN '2-3 días'
    WHEN active_days BETWEEN 4 AND 7 THEN '4-7 días'
    WHEN active_days BETWEEN 8 AND 14 THEN '8-14 días'
    ELSE '15+ días'
  END as engagement_level,
  COUNT(*) as users,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM user_sessions
GROUP BY engagement_level
ORDER BY
  CASE engagement_level
    WHEN '1 día' THEN 1
    WHEN '2-3 días' THEN 2
    WHEN '4-7 días' THEN 3
    WHEN '8-14 días' THEN 4
    ELSE 5
  END;
```

```sql
-- Cohorte de usuarios por semana de registro
SELECT
  DATE_TRUNC('week', p.created_at) as cohort_week,
  COUNT(DISTINCT p.id) as users_registered,
  COUNT(DISTINCT CASE
    WHEN s.created_at > p.created_at + INTERVAL '7 days'
    THEN s.user_id
  END) as returned_week_1,
  ROUND(
    COUNT(DISTINCT CASE
      WHEN s.created_at > p.created_at + INTERVAL '7 days'
      THEN s.user_id
    END) * 100.0 / COUNT(DISTINCT p.id),
    2
  ) as retention_week_1
FROM profiles p
LEFT JOIN analytics_sessions s ON p.id = s.user_id
WHERE p.created_at >= NOW() - INTERVAL '60 days'
GROUP BY DATE_TRUNC('week', p.created_at)
ORDER BY cohort_week DESC;
```

---

### 8. NPS y Satisfacción

```sql
-- Cálculo de NPS (Net Promoter Score)
WITH nps_scores AS (
  SELECT
    user_id,
    (responses->>'q1')::integer as score
  FROM survey_responses
  WHERE survey_id IN (
    SELECT id FROM surveys WHERE survey_type = 'nps'
  )
  AND completed = true
  AND responses->>'q1' IS NOT NULL
)
SELECT
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE score >= 9) as promoters,
  COUNT(*) FILTER (WHERE score BETWEEN 7 AND 8) as passives,
  COUNT(*) FILTER (WHERE score <= 6) as detractors,
  ROUND(
    (COUNT(*) FILTER (WHERE score >= 9) * 100.0 / COUNT(*)) -
    (COUNT(*) FILTER (WHERE score <= 6) * 100.0 / COUNT(*)),
    2
  ) as nps_score
FROM nps_scores;
```

---

## 📤 EXPORTAR DATOS

### Exportar datos completos de feedback
```sql
COPY (
  SELECT
    f.id,
    u.email as user_email,
    p.full_name as user_name,
    f.feedback_type,
    f.title,
    f.description,
    f.status,
    f.priority,
    f.created_at,
    f.context
  FROM user_feedback f
  LEFT JOIN auth.users u ON f.user_id = u.id
  LEFT JOIN profiles p ON u.id = p.id
  ORDER BY f.created_at DESC
) TO '/tmp/pilot_feedback.csv' WITH CSV HEADER;
```

### Exportar datos de encuestas
```sql
COPY (
  SELECT
    s.title as survey_title,
    s.survey_type,
    s.trigger_context,
    u.email as user_email,
    sr.responses,
    sr.completed,
    sr.created_at
  FROM survey_responses sr
  JOIN surveys s ON sr.survey_id = s.id
  LEFT JOIN auth.users u ON sr.user_id = u.id
  ORDER BY sr.created_at DESC
) TO '/tmp/pilot_surveys.csv' WITH CSV HEADER;
```

### Exportar métricas de usuario
```sql
COPY (
  SELECT
    u.email,
    p.full_name,
    p.profession,
    p.location,
    p.created_at as signup_date,
    COUNT(DISTINCT s.id) as total_sessions,
    AVG(s.duration_seconds) as avg_session_duration,
    COUNT(DISTINCT pv.id) as total_page_views,
    COUNT(DISTINCT a.id) as total_actions
  FROM auth.users u
  JOIN profiles p ON u.id = p.id
  LEFT JOIN analytics_sessions s ON u.id = s.user_id
  LEFT JOIN analytics_page_views pv ON u.id = pv.user_id
  LEFT JOIN analytics_user_actions a ON u.id = a.user_id
  GROUP BY u.email, p.full_name, p.profession, p.location, p.created_at
  ORDER BY total_actions DESC
) TO '/tmp/pilot_user_metrics.csv' WITH CSV HEADER;
```

---

## 🎯 MÉTRICAS CLAVE PARA EL PITCH

### 1. Engagement Total
```sql
SELECT
  COUNT(DISTINCT user_id) as total_active_users,
  COUNT(*) as total_sessions,
  ROUND(AVG(duration_seconds) / 60, 2) as avg_session_minutes,
  SUM(duration_seconds) / 3600 as total_hours_on_platform
FROM analytics_sessions
WHERE ended_at IS NOT NULL
  AND created_at >= NOW() - INTERVAL '30 days';
```

### 2. Feature Adoption
```sql
SELECT
  'Ágora' as feature,
  COUNT(DISTINCT user_id) as users,
  COUNT(*) as total_views
FROM analytics_page_views
WHERE page_type = 'agora'
  AND created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT
  'World Boulevard',
  COUNT(DISTINCT user_id),
  COUNT(*)
FROM analytics_page_views
WHERE page_type = 'boulevard'
  AND created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT
  'Universe',
  COUNT(DISTINCT user_id),
  COUNT(*)
FROM analytics_page_views
WHERE page_type = 'universe'
  AND created_at >= NOW() - INTERVAL '30 days';
```

### 3. Velocidad de Adopción
```sql
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as new_users,
  SUM(COUNT(DISTINCT user_id)) OVER (ORDER BY DATE(created_at)) as cumulative_users
FROM profiles
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;
```

---

## 📱 Acceso desde Frontend

Para obtener las métricas desde el frontend:

```typescript
// Obtener dashboard de métricas
const { data: metrics } = await supabase.rpc('get_pilot_dashboard_metrics', {
  p_days_back: 30
});

console.log(metrics);
// {
//   daily_active_users: [...],
//   top_actions: [...],
//   page_statistics: [...],
//   conversions: [...],
//   session_metrics: {...},
//   generated_at: "2024-12-05T..."
// }
```

---

**Sistema de analítica completo y listo para el piloto.**
*Última actualización: 5 de Diciembre, 2024*
