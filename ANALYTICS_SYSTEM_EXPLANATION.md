# SISTEMA DE ANALYTICS DE HUMANBIBLIO - EXPLICACIÓN COMPLETA

**Fecha:** 2025-12-05
**Estado:** 2 sistemas coexistiendo (antiguo y nuevo)

---

## 📊 RESUMEN EJECUTIVO

HUMANBIBLIO tiene implementados **DOS sistemas de analytics que pueden funcionar simultáneamente**:

### Sistema 1: Analytics Básico (Antiguo)
- **Estado:** ✅ Activo, con datos existentes
- **Migracion:** `20251130040504_create_basic_analytics_system.sql`
- **Datos actuales:** 25 page views, 1 user action, 7 session metrics

### Sistema 2: Analytics Avanzado (Nuevo)
- **Estado:** ✅ Implementado, sin datos aún
- **Migración:** `20251205035453_create_analytics_system_v2.sql`
- **Hook disponible:** `useAnalytics()`

**¿Se pueden usar simultáneamente?** ✅ **SÍ** - Son sistemas completamente independientes

---

## 🔍 SISTEMA 1: ANALYTICS BÁSICO (ANTIGUO)

### Tablas Implementadas

#### 1. `page_views`
**Propósito:** Track de vistas de páginas básicas

```sql
Columnas:
- id (uuid)
- user_id (uuid, nullable)
- session_id (text)
- page_type (agora, boulevard, universe, profile, business, project, home, dashboard)
- page_id (uuid, nullable)
- referrer (text, nullable)
- user_agent (text, nullable)
- created_at (timestamptz)
```

**Datos actuales:**
- 25 registros totales
- Distribuidos entre diferentes page_types

#### 2. `user_actions`
**Propósito:** Track de acciones específicas

```sql
Columnas:
- id (uuid)
- user_id (uuid, nullable)
- session_id (text)
- action_type (click_call, click_whatsapp, search_users, etc.)
- action_target (text, nullable)
- target_id (uuid, nullable)
- metadata (jsonb)
- created_at (timestamptz)
```

**Tipos de acciones rastreadas:**
- click_call
- click_whatsapp
- click_message
- click_email
- search_users, search_businesses, search_projects
- like_project
- share, save
- create_profile, create_business, create_project
- upload_image, update_profile

**Datos actuales:**
- 1 registro

#### 3. `session_metrics`
**Propósito:** Métricas agregadas por sesión

```sql
Columnas:
- id (uuid)
- user_id (uuid, nullable)
- session_id (text, unique)
- session_start (timestamptz)
- session_end (timestamptz, nullable)
- duration_seconds (integer)
- pages_viewed (integer)
- actions_count (integer)
- section_agora, section_boulevard, section_universe (boolean)
- created_at (timestamptz)
```

**Datos actuales:**
- 7 sesiones registradas

#### 4. `conversion_events`
**Propósito:** Eventos importantes de conversión

```sql
Columnas:
- id (uuid)
- user_id (uuid, required)
- event_type (signup, first_login, profile_completed, etc.)
- event_data (jsonb)
- created_at (timestamptz)
```

**Eventos rastreados:**
- signup
- first_login
- profile_completed
- first_connection
- first_message
- first_search
- business_created
- project_created
- first_image_upload
- location_shared

**Datos actuales:**
- 0 registros (compartida con sistema nuevo)

#### 5. `daily_analytics`
**Propósito:** Resumen diario agregado

```sql
Columnas:
- id (uuid)
- date (date, unique)
- total_page_views (integer)
- unique_visitors (integer)
- total_actions (integer)
- new_signups (integer)
- new_connections (integer)
- searches_performed (integer)
- avg_session_duration (integer)
- top_pages (jsonb)
- top_actions (jsonb)
- created_at (timestamptz)
```

**Datos actuales:**
- 0 registros (se genera con agregación)

### Políticas RLS Sistema Antiguo

```sql
-- Muy permisivas, permiten crear datos anónimos
page_views:
  - INSERT: public (anyone)
  - SELECT: user_id IS NULL OR auth.uid() = user_id

user_actions:
  - INSERT: public (anyone)
  - SELECT: user_id IS NULL OR auth.uid() = user_id

session_metrics:
  - INSERT: public (anyone)
  - SELECT: user_id IS NULL OR auth.uid() = user_id
  - UPDATE: public (anyone)

conversion_events:
  - INSERT: auth.uid() = user_id
  - SELECT: auth.uid() = user_id
```

---

## 🚀 SISTEMA 2: ANALYTICS AVANZADO (NUEVO)

### Tablas Implementadas

#### 1. `analytics_sessions`
**Propósito:** Track completo de sesiones de usuario

```sql
Columnas:
- id (uuid)
- session_id (text, unique)
- user_id (uuid, nullable)
- started_at (timestamptz)
- ended_at (timestamptz, nullable)
- duration_seconds (integer, computed)
- user_agent (text)
- referrer (text)
- device_type (mobile, tablet, desktop, unknown)
- created_at (timestamptz)
```

**Mejoras vs sistema antiguo:**
- Detección automática de device_type
- Cálculo automático de duration_seconds
- Manejo explícito de session end

#### 2. `analytics_page_views`
**Propósito:** Track detallado de vistas (similar a page_views pero mejorado)

```sql
Columnas:
- id (uuid)
- session_id (text) - Links to analytics_sessions
- user_id (uuid, nullable)
- page_type (agora, boulevard, universe, dashboard, profile, business, project, home)
- page_id (text, nullable) - Changed from uuid to text for flexibility
- viewed_at (timestamptz)
- referrer (text)
- user_agent (text)
- created_at (timestamptz)
```

**Diferencias clave:**
- page_id es text (más flexible)
- viewed_at separado de created_at
- Mejor indexación

#### 3. `analytics_user_actions`
**Propósito:** Track de acciones (similar a user_actions)

```sql
Columnas:
- id (uuid)
- session_id (text)
- user_id (uuid, nullable)
- action_type (text) - No enum, más flexible
- action_target (text, nullable)
- target_id (text, nullable)
- metadata (jsonb)
- created_at (timestamptz)
```

**Mejoras:**
- action_type sin restricción de enum (más flexible)
- target_id como text (más flexible)
- Mejor indexación

#### 4. `conversion_events`
**Reutiliza la misma tabla del sistema antiguo**
- Tabla compartida entre ambos sistemas
- Sin conflictos porque usa los mismos campos

### Funciones RPC del Sistema Nuevo

#### 1. `log_page_view()`
**Función optimizada para logging de vistas**

```sql
Parameters:
- p_user_id uuid
- p_session_id text
- p_page_type text
- p_page_id text
- p_referrer text
- p_user_agent text

Behavior:
1. Crea sesión si no existe (ON CONFLICT DO NOTHING)
2. Detecta device_type automáticamente del user_agent
3. Inserta page view
```

**Ventaja:** Operación atómica que garantiza sesión existe

#### 2. `log_user_action()`
**Función optimizada para logging de acciones**

```sql
Parameters:
- p_user_id uuid
- p_session_id text
- p_action_type text
- p_action_target text
- p_target_id text
- p_metadata jsonb

Behavior:
- Insert directo en analytics_user_actions
```

#### 3. `close_session()`
**Cierra una sesión calculando duración**

```sql
Parameters:
- p_session_id text
- p_end_time timestamptz

Behavior:
- Actualiza ended_at
- Calcula duration_seconds automáticamente
- Solo actualiza si ended_at IS NULL (evita duplicados)
```

**Ventaja:** Cálculo automático de duración

#### 4. `get_pilot_dashboard_metrics()`
**Función PODEROSA de análisis agregado**

```sql
Parameters:
- p_days_back integer (default: 30)

Returns: jsonb con:
{
  "daily_active_users": [...],     // DAU por día
  "top_actions": [...],             // Top 10 acciones
  "page_statistics": [...],         // Stats por tipo de página
  "conversions": [...],             // Eventos de conversión
  "session_metrics": {...},         // Métricas de sesiones
  "generated_at": "timestamp"
}
```

**Ventaja ENORME:** Dashboard completo en una sola llamada

### Hook React: `useAnalytics()`

**Ubicación:** `src/hooks/useAnalytics.ts`

```typescript
const {
  sessionId,
  logPageView,
  logAction,
  logConversion,
  closeSession
} = useAnalytics({ userId, enabled: true });
```

#### Características

1. **Session Management Automático**
   - Genera UUID único por sesión
   - Persiste en sessionStorage
   - Cierra sesión automáticamente en beforeunload

2. **Filtrado de Datos Mock**
   - Detecta IDs mock automáticamente
   - No contamina analytics con datos de demo
   - Lista configurable de IDs a filtrar

3. **API Simple**

```typescript
// Log page view
await logPageView('agora', userId);

// Log user action
await logAction('click_whatsapp', businessId, { from: 'business_card' });

// Log conversion
await logConversion('business_created', { category: 'restaurant' });
```

4. **Error Handling**
   - Manejo silencioso de errores
   - Console.error para debugging
   - No interrumpe flujo de usuario

### Índices Optimizados

```sql
-- Analytics Sessions
idx_sessions_user_id
idx_sessions_session_id
idx_sessions_created_at (DESC)

-- Analytics Page Views
idx_page_views_session_id
idx_page_views_user_id
idx_page_views_page_type
idx_page_views_created_at (DESC)

-- Analytics User Actions
idx_actions_session_id
idx_actions_user_id
idx_actions_action_type
idx_actions_created_at (DESC)

-- Conversion Events
idx_conversions_user_id
idx_conversions_event_type
idx_conversions_created_at (DESC)
```

**Ventaja:** Queries súper rápidas incluso con millones de registros

---

## 🔄 ¿CÓMO FUNCIONAN JUNTOS?

### Compatibilidad

| Aspecto | Sistema Antiguo | Sistema Nuevo | Compatibilidad |
|---------|-----------------|---------------|----------------|
| **Tablas** | page_views, user_actions, session_metrics | analytics_* tables | ✅ No hay conflicto |
| **Nombres** | Diferentes | Diferentes con prefijo analytics_ | ✅ No hay colisión |
| **conversion_events** | Usa misma tabla | Usa misma tabla | ✅ Compartida sin conflicto |
| **Políticas RLS** | Permisivas | Permisivas | ✅ Compatible |
| **Funciones RPC** | Ninguna | 4 funciones optimizadas | ✅ Nuevas funciones |

### Escenarios de Uso

#### Escenario 1: Usar solo Sistema Nuevo (RECOMENDADO)
```typescript
// En todos los componentes
import { useAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const { logPageView, logAction } = useAnalytics({ userId });

  useEffect(() => {
    logPageView('agora');
  }, []);

  const handleClick = () => {
    logAction('click_whatsapp', businessId);
  };
}
```

**Ventajas:**
- API moderna y limpia
- Filtrado automático de mocks
- Session management automático
- Dashboard metrics poderoso

#### Escenario 2: Migrar datos del Sistema Antiguo al Nuevo
```sql
-- Migrar page_views a analytics_page_views
INSERT INTO analytics_page_views (
  session_id, user_id, page_type, page_id,
  viewed_at, referrer, user_agent, created_at
)
SELECT
  session_id, user_id, page_type, page_id::text,
  created_at, referrer, user_agent, created_at
FROM page_views;

-- Migrar user_actions a analytics_user_actions
INSERT INTO analytics_user_actions (
  session_id, user_id, action_type, action_target,
  target_id, metadata, created_at
)
SELECT
  session_id, user_id, action_type, action_target,
  target_id::text, metadata, created_at
FROM user_actions;
```

#### Escenario 3: Usar ambos simultáneamente
```typescript
// Sistema antiguo: inserts directos
await supabase.from('page_views').insert({ ... });

// Sistema nuevo: usar hook
const { logPageView } = useAnalytics();
await logPageView('agora');
```

**Resultado:** Datos en ambas tablas, sin conflicto

---

## 📈 DATOS QUE SE RASTREAN

### Eventos de Página (Page Views)

| Tipo | Descripción | Cuándo se registra |
|------|-------------|-------------------|
| **home** | Landing page | Al cargar página principal |
| **agora** | Sección Agora | Al entrar a Agora |
| **boulevard** | World Boulevard | Al entrar a WB |
| **universe** | Universe | Al entrar a Universe |
| **profile** | Perfil de usuario | Al ver perfil (con user_id) |
| **business** | Perfil de negocio | Al ver negocio (con business_id) |
| **project** | Página de proyecto | Al ver proyecto |
| **dashboard** | Dashboard usuario | Al acceder a dashboard |

### Acciones de Usuario (User Actions)

| Acción | Descripción | Metadata típico |
|--------|-------------|-----------------|
| **click_call** | Click en botón llamar | { businessId, from: 'business_card' } |
| **click_whatsapp** | Click en WhatsApp | { businessId, from: 'business_card' } |
| **click_message** | Click en mensajería | { targetUserId } |
| **click_email** | Click en email | { businessId } |
| **search_users** | Búsqueda de usuarios | { query, resultsCount } |
| **search_businesses** | Búsqueda de negocios | { query, category, resultsCount } |
| **search_projects** | Búsqueda de proyectos | { query, resultsCount } |
| **like_project** | Like en post | { postId } |
| **share** | Compartir contenido | { contentType, contentId } |
| **create_profile** | Crear perfil | { profileType: 'personal' } |
| **create_business** | Crear negocio | { category, location } |
| **create_project** | Crear proyecto | { type } |
| **upload_image** | Subir imagen | { imageType: 'profile/business' } |
| **update_profile** | Actualizar perfil | { fields: ['bio', 'interests'] } |

### Eventos de Conversión (Conversion Events)

| Evento | Descripción | Cuándo se registra |
|--------|-------------|-------------------|
| **signup** | Usuario se registra | Al completar registro |
| **first_login** | Primer login | Primera vez que inicia sesión |
| **profile_completed** | Perfil completado | Al llenar campos básicos |
| **first_connection** | Primera conexión | Al conectar con otro usuario |
| **first_message** | Primer mensaje | Al enviar primer mensaje |
| **first_search** | Primera búsqueda | Al usar búsqueda por primera vez |
| **business_created** | Negocio creado | Al crear perfil de negocio |
| **project_created** | Proyecto creado | Al crear primer proyecto |
| **first_image_upload** | Primera imagen | Al subir primera foto |
| **location_shared** | Ubicación compartida | Al activar geolocalización |

---

## 🎯 RECOMENDACIONES

### Para el Piloto

**✅ USAR SISTEMA NUEVO (Analytics V2)**

**Razones:**
1. Hook `useAnalytics()` ya está implementado
2. Funciones RPC optimizadas
3. Dashboard metrics en una llamada
4. Filtrado automático de mocks
5. Session management automático
6. Mejor arquitectura para escalar

### Implementación Paso a Paso

#### Paso 1: Implementar en componentes principales

```typescript
// En App.tsx
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const { user } = useAuth();
  const { logPageView } = useAnalytics({
    userId: user?.id,
    enabled: true
  });

  // Log page views según sección activa
  useEffect(() => {
    if (activeSection === 'agora') {
      logPageView('agora');
    }
  }, [activeSection]);
}
```

#### Paso 2: Implementar en componentes de acción

```typescript
// En BusinessCard.tsx
const { logAction } = useAnalytics({ userId: user?.id });

const handleWhatsAppClick = () => {
  logAction('click_whatsapp', business.id, {
    from: 'business_card',
    businessName: business.name
  });
  // ... resto del código
};
```

#### Paso 3: Implementar conversiones

```typescript
// En RegistrationForm.tsx
const { logConversion } = useAnalytics({ userId: newUser.id });

await signUp(email, password, userData);
await logConversion('signup', {
  role: userData.role,
  source: 'registration_form'
});
```

#### Paso 4: Crear dashboard de analytics

```typescript
// En admin dashboard
const fetchMetrics = async () => {
  const { data } = await supabase
    .rpc('get_pilot_dashboard_metrics', { p_days_back: 30 });

  console.log('Daily Active Users:', data.daily_active_users);
  console.log('Top Actions:', data.top_actions);
  console.log('Page Stats:', data.page_statistics);
  console.log('Conversions:', data.conversions);
};
```

### Migración de Datos Existentes

**¿Migrar 25 page_views del sistema antiguo?**

**Opción A: NO MIGRAR (Recomendado)**
- Son pocos datos (25 registros)
- Probablemente datos de testing
- Mejor empezar limpio con piloto

**Opción B: MIGRAR**
```sql
-- Solo si los datos son valiosos
INSERT INTO analytics_page_views (
  session_id, user_id, page_type, page_id,
  viewed_at, referrer, user_agent, created_at
)
SELECT
  session_id, user_id, page_type,
  page_id::text, created_at, referrer,
  user_agent, created_at
FROM page_views;
```

---

## 💡 VENTAJAS DEL SISTEMA NUEVO

### 1. Dashboard Completo en Una Llamada
```javascript
const metrics = await supabase.rpc('get_pilot_dashboard_metrics');
// Obtener TODO en un solo query
```

### 2. Filtrado Automático de Datos Mock
```typescript
// No contamina analytics con usuarios/negocios de demo
logPageView('profile', 'DEMO-USER-123'); // Filtrado automáticamente
```

### 3. Session Management Automático
```typescript
// Crea session ID, lo persiste, lo cierra automáticamente
const { sessionId } = useAnalytics();
```

### 4. Detección de Device Type
```sql
-- Automático basado en user_agent
device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown'
```

### 5. Cálculo Automático de Duración
```sql
-- No necesitas calcular manualmente
close_session() → duration_seconds calculado automáticamente
```

### 6. Índices Optimizados
```sql
-- Queries súper rápidas incluso con millones de registros
WHERE created_at >= NOW() - INTERVAL '30 days' -- Usa índice DESC
```

---

## 🚀 PRÓXIMOS PASOS

### Para Lanzar Piloto

1. ✅ Sistema nuevo ya está implementado
2. ✅ Hook useAnalytics() disponible
3. ⚠️ Agregar llamadas a logPageView() en componentes principales
4. ⚠️ Agregar llamadas a logAction() en botones de acción
5. ⚠️ Agregar llamadas a logConversion() en eventos clave
6. ⚠️ Crear página de dashboard con get_pilot_dashboard_metrics()

### Opcional: Limpieza

**Si decides usar SOLO el sistema nuevo:**

```sql
-- Opcional: Eliminar sistema antiguo después del piloto
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS user_actions CASCADE;
DROP TABLE IF EXISTS session_metrics CASCADE;
DROP TABLE IF EXISTS daily_analytics CASCADE;

-- Mantener conversion_events (compartida)
```

---

## 📊 MÉTRICAS CLAVE A RASTREAR EN PILOTO

### Métricas de Adopción
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Retention rate (D1, D7, D30)

### Métricas de Engagement
- Avg session duration
- Pages per session
- Actions per session
- Return rate

### Métricas de Conversión
- Signup → Profile completed
- Profile completed → First search
- First search → First connection
- First connection → First message

### Métricas de Funcionalidades
- % usuarios que usan Agora
- % usuarios que usan World Boulevard
- % usuarios que usan messaging
- % usuarios que activan geolocalización

### Métricas de Negocios WB
- Negocios creados por día
- Clicks en WhatsApp
- Clicks en llamadas
- Reviews dejadas

---

## ✅ CONCLUSIÓN

**RESPUESTA A TU PREGUNTA:**

1. **¿En qué consisten las analytics tracking específicas?**
   - Sistema completo de 4 tablas (sessions, page_views, actions, conversions)
   - Funciones RPC optimizadas para logging
   - Hook React useAnalytics() listo para usar
   - Dashboard metrics agregado en una llamada

2. **¿Se pueden usar simultáneamente con el sistema existente?**
   - ✅ **SÍ, 100% compatible**
   - Tablas diferentes (no hay conflicto)
   - Políticas RLS compatibles
   - conversion_events compartida sin problemas

**RECOMENDACIÓN FINAL:**
- Usar **sistema nuevo** (Analytics V2) para el piloto
- Implementar hook useAnalytics() en componentes
- Crear dashboard con get_pilot_dashboard_metrics()
- Opcionalmente mantener sistema antiguo o eliminarlo después

**El sistema nuevo está LISTO PARA USAR inmediatamente.**

---

**Documentación creada por:** Claude Agent
**Fecha:** 2025-12-05
**Estado:** Sistemas independientes, compatibles, listos para producción
