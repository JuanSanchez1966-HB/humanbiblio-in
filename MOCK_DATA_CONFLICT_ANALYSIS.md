# Análisis de Conflictos: Datos Mock vs Usuarios Reales del Piloto

## ⚠️ RIESGO IDENTIFICADO: ALTO

**Estado actual:** Existe un **riesgo significativo de conflicto** entre datos mock y usuarios reales del piloto.

---

## 🔍 PROBLEMAS IDENTIFICADOS

### 1. **Mezcla de Datos Mock y Reales**

**Archivo:** `src/hooks/useSupabaseData.ts`

#### Código problemático:

```typescript
// Línea 242
const combinedUsers = [...data, ...MOCK_USERS];

// Línea 315
const combinedBusinesses = [...data, ...MOCK_BUSINESSES];
```

**Problema:**
- Los datos reales del piloto y los perfiles mock se **mezclan en la misma lista**
- No hay separación visual entre perfiles demo y usuarios reales
- Los usuarios del piloto verán perfiles ficticios como si fueran personas reales

---

### 2. **IDs Hardcodeados Potencialmente Conflictivos**

#### Mock Users IDs:
```typescript
MOCK_USERS = [
  { id: '1', email: 'ana@example.com', ... },
  { id: '2', email: 'carlos@example.com', ... },
  { id: '3', email: 'maria@example.com', ... },
  { id: '4', email: 'david@example.com', ... },
  { id: '5', email: 'lucia@example.com', ... }
]
```

**Problema:**
- IDs simples ('1', '2', '3', etc.) podrían colisionar con UUIDs reales (improbable pero posible)
- Emails como 'ana@example.com' podrían causar confusión
- Si alguien intenta registrarse con estos emails, podría haber conflicto

#### Mock Businesses IDs:
```typescript
MOCK_BUSINESSES = [
  { id: 'wb-ana-garcia', owner_id: '1', ... },
  { id: 'wb-carlos-rodriguez', owner_id: '2', ... },
  { id: 'wb-maria-santos', owner_id: '3', ... },
  { id: 'wb-david-martinez', owner_id: '4', ... }
]
```

**Problema:**
- Los `owner_id` de negocios mock apuntan a usuarios mock ('1', '2', '3', '4')
- Si un usuario real tiene ID '1', su perfil se mezclaría con el mock

---

### 3. **Contaminación de Analytics**

**Archivo:** `src/hooks/useAnalytics.ts`

```typescript
const { logPageView, logAction } = useAnalytics({
  userId: user?.id,
  enabled: !isDemoMode
});
```

**Problema parcialmente resuelto:**
- ✅ Analytics están deshabilitados en modo demo (`enabled: !isDemoMode`)
- ✅ Los usuarios mock NO generan datos de analytics

**Problema pendiente:**
- ⚠️ Si hay datos reales + mock mezclados, las interacciones entre ellos SÍ se registrarían
- ⚠️ Un usuario real que envía mensaje a perfil mock generaría analytics "reales"

---

### 4. **Modo Demo vs Modo Producción**

**Archivo:** `src/lib/supabase.ts`

```typescript
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;
```

**Estado actual:**
- ✅ Modo demo se activa cuando faltan credenciales de Supabase
- ✅ Modo producción se activa cuando hay credenciales
- ⚠️ **PERO** los datos mock se siguen agregando incluso en producción

**Comportamiento actual en producción:**

```typescript
if (data && data.length > 0) {
  console.log('✅ Usuarios reales cargados:', data.length);
  // PROBLEMA: Combina datos reales CON mock data
  const combinedUsers = [...data, ...MOCK_USERS];
  console.log('👤 Mostrando', data.length, 'perfiles reales PRIMERO +', MOCK_USERS.length, 'perfiles demo');
  setUsers(combinedUsers);
}
```

**Esto significa:**
- En producción real, usuarios del piloto verán 5 perfiles mock adicionales
- No podrán distinguir cuáles son reales y cuáles son ficticios

---

## 📊 IMPACTO EN EL PILOTO

### Confusión de Usuarios
❌ **Usuarios reales verán perfiles ficticios** y no sabrán que son fake
❌ **Podrían intentar contactar a personas que no existen**
❌ **Experiencia confusa y poco profesional**

### Datos de Analytics Contaminados
⚠️ **Interacciones con perfiles mock se registrarían como "reales"**
⚠️ **Métricas de engagement falsas**
⚠️ **Difícil distinguir usuarios reales de mock en reports**

### Problemas de Búsqueda
❌ **Búsquedas retornarán perfiles mock mezclados con reales**
❌ **Filtros por ubicación incluirán ubicaciones ficticias**
❌ **Estadísticas de distribución geográfica serían incorrectas**

### Problemas de Feedback
❌ **No se podrá distinguir feedback de usuarios reales vs demo**
❌ **Encuestas podrían tener respuestas asociadas a IDs mock**
❌ **Reportes para investors incluirían datos falsos**

---

## ✅ SOLUCIONES PROPUESTAS

### SOLUCIÓN 1: Separación Completa de Modos ⭐ RECOMENDADA

**Cambios en `useSupabaseData.ts`:**

```typescript
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      setError(null);

      // MODO DEMO: Solo mock data
      if (isDemoMode) {
        console.log('🎭 MODO DEMO - Usando datos mock exclusivamente');
        setUsers(MOCK_USERS);
        setLoading(false);
        return;
      }

      // MODO PRODUCCIÓN: Solo datos reales, NUNCA mock
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando usuarios:', error);
        setError('Error cargando perfiles');
        setUsers([]); // Lista vacía, NO mock data
        return;
      }

      console.log('✅ Usuarios reales cargados:', data?.length || 0);
      setUsers(data || []); // SOLO datos reales

    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión');
      setUsers([]); // Lista vacía en error
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
}
```

**Ventajas:**
- ✅ Separación total: Demo usa mock, Producción usa solo datos reales
- ✅ Sin contaminación de datos
- ✅ Analytics limpios
- ✅ Experiencia profesional para usuarios del piloto

**Desventajas:**
- ⚠️ Si la base de datos está vacía en producción, no habrá perfiles visibles
- ⚠️ Requiere tener datos reales desde el inicio

---

### SOLUCIÓN 2: Identificador Visual de Perfiles Demo

**Agregar flag a mock data:**

```typescript
const MOCK_USERS: User[] = [
  {
    id: 'DEMO-1', // Prefijo "DEMO-" para evitar colisiones
    email: 'demo-ana@humanbiblio.com',
    full_name: 'Ana García',
    is_demo_profile: true, // ⭐ Nuevo flag
    demo_badge: '🎭 Perfil Demo',
    // ... resto de datos
  },
  // ...
];
```

**Mostrar badge en UI:**

```typescript
// En UserCard.tsx
{user.is_demo_profile && (
  <div className="absolute top-2 right-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
    🎭 Demo
  </div>
)}
```

**Filtrar mock data de analytics:**

```typescript
const logAction = useCallback(async (actionType, targetId, metadata) => {
  // No registrar acciones sobre perfiles demo
  if (targetId?.startsWith('DEMO-')) {
    console.log('🎭 Acción sobre perfil demo - no se registra en analytics');
    return;
  }

  // ... resto del código
}, []);
```

**Ventajas:**
- ✅ Usuarios saben qué perfiles son demo
- ✅ Analytics filtrados automáticamente
- ✅ Permite tener datos demo visibles para referencia

**Desventajas:**
- ⚠️ Sigue mezclando datos reales con mock
- ⚠️ Puede confundir a algunos usuarios
- ⚠️ Búsquedas retornan perfiles demo

---

### SOLUCIÓN 3: Variable de Entorno para Controlar Mock Data

**Agregar en `.env`:**

```bash
# Control de datos mock en producción
VITE_ENABLE_MOCK_DATA=false  # false en producción, true en desarrollo
```

**Implementación:**

```typescript
const ENABLE_MOCK_DATA = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

export function useUsers() {
  // ...
  const fetchUsers = async () => {
    if (isDemoMode) {
      setUsers(MOCK_USERS);
      return;
    }

    const { data, error } = await supabase.from('profiles').select('*');

    if (error || !data) {
      setUsers([]); // Sin mock data en producción
      return;
    }

    // Agregar mock data solo si está habilitado explícitamente
    if (ENABLE_MOCK_DATA && import.meta.env.DEV) {
      setUsers([...data, ...MOCK_USERS]);
    } else {
      setUsers(data); // Solo datos reales en producción
    }
  };
}
```

**Ventajas:**
- ✅ Control preciso desde variables de entorno
- ✅ Fácil de cambiar sin modificar código
- ✅ Desarrollo sigue usando mock data

---

## 🎯 RECOMENDACIÓN FINAL

### Para el Piloto Inmediato: SOLUCIÓN 1 ⭐

**Implementar separación completa de modos:**
- ✅ Modo Demo: Solo mock data (para pruebas internas)
- ✅ Modo Producción: Solo datos reales (para piloto con usuarios)

**Pasos:**
1. Modificar `useUsers()` y `useBusinesses()` para NO mezclar datos
2. Asegurar que `isDemoMode === false` en Netlify (verificar env vars)
3. Testear con usuarios reales desde el día 1
4. Si base de datos vacía, mostrar mensaje "Sé el primero en registrarte"

### Para Desarrollo Continuo: SOLUCIÓN 3

**Usar variable de entorno para control fino:**
- En desarrollo local: mock data habilitado
- En staging: mock data opcional
- En producción: mock data deshabilitado siempre

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Inmediato (Antes del Piloto)
- [ ] Modificar `useUsers()` para separar modos completamente
- [ ] Modificar `useBusinesses()` para separar modos completamente
- [ ] Verificar que `VITE_SUPABASE_URL` está configurado en Netlify
- [ ] Verificar que `VITE_SUPABASE_ANON_KEY` está configurado en Netlify
- [ ] Confirmar que `isDemoMode === false` en producción
- [ ] Probar con base de datos vacía
- [ ] Probar con 1-2 usuarios reales

### Post-Lanzamiento
- [ ] Monitorear analytics para verificar solo datos reales
- [ ] Verificar que búsquedas no retornan perfiles mock
- [ ] Confirmar que feedback es de usuarios reales
- [ ] Revisar logs de producción para detectar modo demo accidental

### Opcional (Si se necesitan perfiles demo visibles)
- [ ] Implementar SOLUCIÓN 2 con badges visuales
- [ ] Filtrar perfiles demo de analytics
- [ ] Agregar página "Acerca de perfiles demo"
- [ ] Documentar en guía de usuario

---

## 🚨 RIESGOS SI NO SE CORRIGE

### Críticos
❌ **Métricas del piloto contaminadas con datos falsos**
❌ **Usuarios confundidos intentando contactar perfiles ficticios**
❌ **Reportes para investors incluirían datos inválidos**
❌ **Imposible medir engagement real**

### Altos
⚠️ **Feedback mezclado (real vs ficticio)**
⚠️ **Búsquedas retornan resultados engañosos**
⚠️ **Estadísticas geográficas incorrectas**

### Medios
⚠️ **Experiencia de usuario poco profesional**
⚠️ **Pérdida de credibilidad con early adopters**

---

## ✅ VERIFICACIÓN POST-IMPLEMENTACIÓN

### Cómo verificar que está resuelto:

1. **Verificar modo de operación:**
```javascript
console.log('isDemoMode:', isDemoMode);
// Debe ser false en producción
```

2. **Verificar perfiles cargados:**
```javascript
console.log('Usuarios cargados:', users.length);
console.log('Incluye mock?', users.some(u => u.email?.includes('@example.com')));
// Debe ser false en producción
```

3. **Verificar analytics:**
```sql
-- En Supabase SQL Editor
SELECT DISTINCT user_id FROM analytics_user_actions
WHERE user_id IN ('1', '2', '3', '4', '5');
-- Debe retornar 0 filas en producción
```

4. **Verificar búsquedas:**
```javascript
// Buscar "Ana García"
// En producción, solo debería aparecer si existe un usuario real con ese nombre
```

---

## 📞 CONTACTO PARA SOPORTE

Si al implementar estas correcciones surgen dudas o problemas:

1. **Revisar logs de consola** en navegador
2. **Verificar Supabase Dashboard** para confirmar datos reales
3. **Testear en modo incógnito** para sesión limpia
4. **Comparar desarrollo vs producción** para detectar diferencias

---

## 📈 IMPACTO EN MÉTRICAS DEL PITCH

### Sin corrección:
- ❌ DAU inflados artificialmente (+5 usuarios mock)
- ❌ Engagement rate incorrecto
- ❌ Conversión funnel con datos falsos
- ❌ NPS score potencialmente contaminado

### Con corrección:
- ✅ Métricas 100% reales
- ✅ Datos confiables para investors
- ✅ Insights válidos para producto
- ✅ Feedback genuino de usuarios

---

## 🎊 RESUMEN EJECUTIVO

### Estado Actual: ⚠️ RIESGO ALTO

**Problema:**
Los datos mock (5 usuarios ficticios + 4 negocios ficticios) se mezclan con usuarios reales del piloto en modo producción, causando:
- Confusión de usuarios
- Contaminación de analytics
- Métricas falsas
- Experiencia poco profesional

### Solución Recomendada: ✅ SOLUCIÓN 1

**Separación completa de modos:**
- Demo mode: Solo mock data
- Production mode: Solo datos reales, NUNCA mock

### Prioridad: 🔴 CRÍTICA

**Debe implementarse ANTES del lanzamiento del piloto** para garantizar:
- Datos limpios desde el día 1
- Métricas confiables para análisis
- Experiencia profesional para usuarios
- Reportes válidos para investors

### Tiempo de implementación: 30-60 minutos

**Archivos a modificar:**
1. `src/hooks/useSupabaseData.ts` (principal)
2. `src/App.tsx` (verificación)
3. `.env` en Netlify (configuración)

---

*Análisis completado: 5 de Diciembre, 2024*
*Nivel de riesgo: ALTO*
*Acción requerida: INMEDIATA*
