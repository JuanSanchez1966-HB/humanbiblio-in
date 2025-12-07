# 🧪 END-TO-END USER FLOW TESTS - COMPREHENSIVE

**Fecha:** 1 de Diciembre de 2025
**Objetivo:** Verificar flujos completos de usuario de inicio a fin + NEW: Coming Soon Features
**Status:** ⏳ IN PROGRESS

---

## 🎯 FLUJOS CRÍTICOS A TESTEAR

1. **New User Onboarding** (Usuario nuevo)
2. **Search & Connect** (Búsqueda y conexión)
3. **Profile Creation** (Creación de perfil)
4. **Business Discovery** (Descubrimiento de negocios)
5. **Communication** (Inicio de comunicación)
6. **Navigation Flow** (Navegación entre secciones)
7. **🆕 Coming Soon Features Interest Tracking** (Próximas funcionalidades)

---

## ✅ FLUJO 1: NEW USER ONBOARDING

**Objetivo:** Usuario nuevo descubre y se familiariza con la app

### **Steps:**

1. **Landing Page**
   - [ ] Usuario llega a landing page
   - [ ] Ve Hero section con logo y mensaje principal
   - [ ] Lee features showcase
   - [ ] Ve impact metrics
   - [ ] Decide entrar al Ágora

2. **First Visit to Ágora**
   - [ ] Click en "Unirse al Ágora"
   - [ ] Transición suave a sección Ágora
   - [ ] Onboarding tooltip aparece después de 2s
   - [ ] Usuario ve paso 1: "Bienvenido"

3. **Onboarding Tour**
   - [ ] Paso 1: Bienvenida → Click "Siguiente"
   - [ ] Paso 2: Search bar highlighted → Click "Siguiente"
   - [ ] Paso 3: World Boulevard button → Opción de ir o siguiente
   - [ ] Paso 4: Dashboard button → Click "Siguiente"
   - [ ] Paso 5: User cards → Click "Finalizar"
   - [ ] Onboarding completa, guardado en localStorage
   - [ ] Botón 💡 aparece en header para re-ver tutorial

4. **First Interaction**
   - [ ] Usuario ve lista de perfiles
   - [ ] Scroll suave
   - [ ] Ve loading states iniciales (skeleton cards)
   - [ ] Cards cargan con animación

**Expected Result:** ✅ Usuario entiende funcionalidades básicas y sabe navegar

**Potential Issues:**
- ⚠️ Tooltip se posiciona mal en mobile
- ⚠️ Onboarding demasiado largo (más de 5 pasos)
- ⚠️ Botón "Saltar" no evidente

---

## ✅ FLUJO 2: SEARCH & CONNECT

**Objetivo:** Usuario busca y conecta con alguien

### **Steps:**

1. **Basic Search**
   - [ ] Click en search bar
   - [ ] Escribe "psicólog" (búsqueda parcial)
   - [ ] Ve loading spinner en search bar
   - [ ] Ve sugerencias de búsqueda
   - [ ] Resultados filtrados aparecen

2. **Advanced Search**
   - [ ] Click en icono de filtros (🔧)
   - [ ] Panel de filtros se despliega
   - [ ] Selecciona profesión: "Psicología"
   - [ ] Selecciona ubicación: "St. Catharines"
   - [ ] Click "Aplicar filtros"
   - [ ] Resultados actualizados
   - [ ] Ve indicadores de filtros activos

3. **View Profile**
   - [ ] Click en user card
   - [ ] Expanded profile modal abre
   - [ ] Ve toda la información del perfil
   - [ ] Reviews cargadas
   - [ ] Trust score visible

4. **Initiate Contact**
   - [ ] Click en botón "Mensaje"
   - [ ] Communication hub abre
   - [ ] Input de mensaje visible
   - [ ] Escribe mensaje
   - [ ] Click enviar
   - [ ] Confirmación de envío

5. **Clear Search**
   - [ ] Click en X para limpiar búsqueda
   - [ ] Todos los resultados vuelven
   - [ ] Filtros se resetean

**Expected Result:** ✅ Usuario encuentra y contacta persona deseada en < 2 minutos

**Potential Issues:**
- ⚠️ Búsqueda muy lenta (> 1s)
- ⚠️ Filtros no intuitivos
- ⚠️ Modal de perfil no cierra fácilmente

---

## ✅ FLUJO 3: PROFILE CREATION

**Objetivo:** Nuevo usuario crea su perfil

### **Steps:**

1. **Registration Trigger**
   - [ ] Usuario no autenticado intenta acción
   - [ ] Auth modal se abre
   - [ ] Ve opciones de login/signup
   - [ ] Click en "Crear Cuenta"

2. **Signup Form**
   - [ ] Fill email (validación en tiempo real)
   - [ ] Fill password (min 6 chars)
   - [ ] Fill nombre completo
   - [ ] Fill profesión
   - [ ] Fill biografía (opcional)
   - [ ] Fill intereses (comma-separated)
   - [ ] Click "Crear Cuenta"

3. **Loading State**
   - [ ] LoadingButton muestra spinner
   - [ ] Texto cambia a "Creando cuenta..."
   - [ ] Botón deshabilitado

4. **Success**
   - [ ] Cuenta creada
   - [ ] Modal de términos aparece
   - [ ] Usuario acepta términos
   - [ ] Redirect a dashboard o perfil

5. **Error Handling**
   - [ ] Test con email duplicado
   - [ ] Error message amigable aparece
   - [ ] "Este email ya está registrado"
   - [ ] Opción de ir a login
   - [ ] Test con password corta
   - [ ] Error: "Mínimo 6 caracteres"

**Expected Result:** ✅ Usuario crea cuenta exitosamente o recibe guía clara de error

**Potential Issues:**
- ⚠️ Error messages técnicos
- ⚠️ Validación no clara
- ⚠️ Loading state no visible

---

## ✅ FLUJO 4: BUSINESS DISCOVERY

**Objetivo:** Usuario descubre y contacta un negocio

### **Steps:**

1. **Navigate to World Boulevard**
   - [ ] Click en "🛍️ Boulevard" en nav
   - [ ] Transición a World Boulevard
   - [ ] Ve carrusel de negocios destacados
   - [ ] Business cards cargan

2. **Browse Businesses**
   - [ ] Scroll por lista de negocios
   - [ ] Ve imágenes de negocios
   - [ ] Ve ratings y reviews
   - [ ] Ve categorías
   - [ ] Ve distancia ("A X km")

3. **Filter by Category**
   - [ ] Click en filtro de categoría
   - [ ] Selecciona "Gastronomía"
   - [ ] Resultados filtrados
   - [ ] Solo restaurantes/cafés visibles

4. **View Business Profile**
   - [ ] Click en business card
   - [ ] Expanded profile abre
   - [ ] Ve galería de fotos (carousel)
   - [ ] Ve horarios
   - [ ] Ve mapa de ubicación
   - [ ] Ve reviews de usuarios

5. **Contact Business**
   - [ ] Click en "Contactar"
   - [ ] Communication hub abre
   - [ ] Escribe consulta
   - [ ] Envía mensaje

6. **Leave Review**
   - [ ] Scroll a sección de reviews
   - [ ] Click "Dejar review"
   - [ ] Selecciona rating (5 estrellas)
   - [ ] Escribe comentario
   - [ ] Submit review
   - [ ] Review aparece en lista

**Expected Result:** ✅ Usuario descubre negocio, revisa info y contacta en < 3 minutos

**Potential Issues:**
- ⚠️ Imágenes cargan lento
- ⚠️ Mapa no responsive
- ⚠️ Reviews no ordenadas correctamente

---

## ✅ FLUJO 5: COMMUNICATION

**Objetivo:** Usuario inicia y mantiene conversación

### **Steps:**

1. **Start Conversation**
   - [ ] Desde user card, click "Mensaje"
   - [ ] Communication hub abre
   - [ ] Ve conversación vacía (first time)
   - [ ] Input de mensaje focus automático

2. **Send Text Message**
   - [ ] Escribe "Hola, ¿podemos hablar?"
   - [ ] Click send o press Enter
   - [ ] Loading spinner breve
   - [ ] Mensaje aparece en chat
   - [ ] Timestamp visible

3. **Voice Message (opcional)**
   - [ ] Click en botón de micrófono
   - [ ] Permiso de micrófono solicitado
   - [ ] Usuario acepta
   - [ ] Record voice message
   - [ ] Preview audio
   - [ ] Send voice message
   - [ ] Audio aparece en chat

4. **Emoji & Rich Text**
   - [ ] Usa emoji picker
   - [ ] Inserta emoji en mensaje
   - [ ] Envía mensaje
   - [ ] Emoji renderiza correctamente

5. **Intelligent Features**
   - [ ] Sistema detecta tono del mensaje
   - [ ] Sugiere respuestas rápidas
   - [ ] Auto-corrección funciona
   - [ ] Typing indicator (si aplicable)

6. **Close & Reopen**
   - [ ] Cierra communication hub
   - [ ] Conversación guardada
   - [ ] Reabre desde mismo user
   - [ ] Conversación persiste
   - [ ] Scroll a último mensaje

**Expected Result:** ✅ Comunicación fluida y natural

**Potential Issues:**
- ⚠️ Mensajes no persisten
- ⚠️ Voice recording falla
- ⚠️ Scroll no automático a nuevo mensaje

---

## ✅ FLUJO 6: NAVIGATION FLOW

**Objetivo:** Usuario navega entre todas las secciones

### **Steps:**

1. **Full Navigation Loop**
   - [ ] Start: Landing page
   - [ ] Click "Ágora" → Ve Ágora
   - [ ] Click "Boulevard" → Ve Boulevard
   - [ ] Click "Dashboard" → Ve Dashboard
   - [ ] Click "Home" → Vuelve a landing
   - [ ] Repeat cycle

2. **State Persistence**
   - [ ] Busca "psicólogo" en Ágora
   - [ ] Navega a Boulevard
   - [ ] Vuelve a Ágora
   - [ ] ⚠️ Búsqueda se mantiene o se limpia?
   - [ ] Decide comportamiento esperado

3. **Deep Linking (future)**
   - [ ] Open profile directly via URL
   - [ ] Open business directly via URL
   - [ ] Open conversation via URL

4. **Back Button Behavior**
   - [ ] Browser back button
   - [ ] Vuelve a sección anterior
   - [ ] Estado se restaura correctamente

5. **Responsive Navigation**
   - [ ] Test en mobile: ¿Hamburger menu?
   - [ ] Test en tablet: Nav visible
   - [ ] Test en desktop: Full nav

**Expected Result:** ✅ Navegación intuitiva sin pérdida de contexto

**Potential Issues:**
- ⚠️ Estado global se pierde
- ⚠️ Back button rompe app
- ⚠️ Nav bar overflow en mobile

---

## 🔍 ERROR SCENARIOS (Happy Path vs Sad Path)

### **Scenario 1: Network Error**
**Test:**
- [ ] Disable network
- [ ] Try to send message
- [ ] Error message aparece: "Error de conexión"
- [ ] Botón "Reintentar" disponible
- [ ] Re-enable network
- [ ] Click "Reintentar"
- [ ] Mensaje se envía

### **Scenario 2: Invalid Input**
**Test:**
- [ ] Try signup with email: "notanemail"
- [ ] Error: "Email inválido"
- [ ] Try password: "12345" (< 6)
- [ ] Error: "Mínimo 6 caracteres"
- [ ] Fix inputs
- [ ] Signup success

### **Scenario 3: Session Expiry**
**Test:**
- [ ] User logged in
- [ ] Manually clear auth token
- [ ] Try to perform action
- [ ] Redirect to login
- [ ] Re-login
- [ ] Return to previous action

### **Scenario 4: Empty States**
**Test:**
- [ ] Search for "xyz123abc" (no results)
- [ ] Empty state visible
- [ ] Suggestions displayed
- [ ] "Mostrar todos" button works

---

## 📊 PERFORMANCE BENCHMARKS

### **Page Load**
- ✅ Landing page: < 2s (3G)
- ✅ Ágora section: < 1s
- ✅ Boulevard section: < 1.5s
- ✅ Dashboard: < 1s

### **Interactions**
- ✅ Search results: < 500ms
- ✅ Modal open: < 100ms
- ✅ Message send: < 1s
- ✅ Profile load: < 800ms

### **Animations**
- ✅ All at 60fps
- ✅ No jank on scroll
- ✅ Smooth transitions

---

## ✅ ACCESSIBILITY CHECKS

### **Keyboard Navigation**
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Esc closes modals
- [ ] Focus visible
- [ ] Logical tab order

### **Screen Reader**
- [ ] All images have alt text
- [ ] Buttons have aria-labels
- [ ] Forms have labels
- [ ] Error messages announced

### **Color Contrast**
- [ ] Text readable on all backgrounds
- [ ] Minimum contrast ratio: 4.5:1
- [ ] Focus indicators visible

---

## 🎯 CRITICAL PATH CHECKLIST

**Must work perfectly:**
- [ ] Registration → Profile Creation
- [ ] Search → View Profile → Send Message
- [ ] Browse Businesses → View Profile → Contact
- [ ] Navigation between sections
- [ ] Error handling with friendly messages
- [ ] Loading states everywhere

**Should work well:**
- [ ] Onboarding tooltip tour
- [ ] Advanced search filters
- [ ] Reviews system
- [ ] Voice messages
- [ ] PWA install

**Nice to have:**
- [ ] Animations smooth
- [ ] Keyboard shortcuts
- [ ] Deep linking
- [ ] Offline mode

---

## 📝 TEST EXECUTION CHECKLIST

### **Pre-Test Setup**
- [ ] Clear browser cache
- [ ] Clear localStorage
- [ ] Clear cookies
- [ ] Use incognito mode
- [ ] Test with fresh state

### **During Test**
- [ ] Document each step
- [ ] Screenshot any issues
- [ ] Note loading times
- [ ] Check console for errors
- [ ] Monitor network tab

### **Post-Test**
- [ ] Document all issues found
- [ ] Classify by severity (P0-P3)
- [ ] Create fix tickets
- [ ] Retest after fixes

---

## ✅ FLUJO 7: 🆕 COMING SOON FEATURES INTEREST TRACKING

**Objetivo:** Usuario expresa interés en funcionalidades futuras y proporciona feedback

### **Steps:**

1. **Navigate to Dashboard**
   - [ ] Login como usuario autenticado
   - [ ] Click en botón "Dashboard" (esquina superior derecha)
   - [ ] Dashboard carga correctamente
   - [ ] Tab "Resumen" seleccionado por defecto

2. **Scroll to Coming Soon Section**
   - [ ] Scroll down past stats cards
   - [ ] Scroll past "Actividad Reciente"
   - [ ] Ve sección "🚀 Próximas Funcionalidades"
   - [ ] Título y descripción visibles
   - [ ] Grid de 4 cards visible

3. **View Feature Cards**
   - [ ] Card 1: 📞 "Llamadas y Videollamadas" - Gradiente azul
   - [ ] Card 2: 🌐 "Traducción en Tiempo Real" - Gradiente verde
   - [ ] Card 3: 📊 "CRM Inteligente" - Gradiente morado
   - [ ] Card 4: 🌌 "YANA - Crowdfunding" - Gradiente rosa
   - [ ] Todas cards tienen:
     - ✅ Badge "Próximamente" / "Coming Soon"
     - ✅ Icono grande
     - ✅ Título claro
     - ✅ Descripción
     - ✅ Lista de 4 features
     - ✅ Fecha de lanzamiento estimada
     - ✅ Votación de prioridad (1-5)
     - ✅ Botón de interés

4. **Test Hover Effects**
   - [ ] Mouse over card
   - [ ] Card hace scale up (hover:scale-105)
   - [ ] Gradiente visible
   - [ ] Animación suave

5. **Vote Priority - Calls Feature**
   - [ ] Click en card "Llamadas y Videollamadas"
   - [ ] Ve pregunta: "¿Qué tan importante es esto para ti?"
   - [ ] Ve 5 botones numerados (1-5)
   - [ ] Ve texto explicativo "1 = Poco · 5 = Muy"
   - [ ] Click en "5" (máxima prioridad)
   - [ ] Botón 5 se resalta (bg-white, scale-110)

6. **Express Interest**
   - [ ] Click en botón "✋ Quiero acceso anticipado"
   - [ ] LoadingButton muestra "Registrando..."
   - [ ] Botón deshabilitado durante proceso

7. **Success Confirmation**
   - [ ] Mensaje de éxito aparece con ✅
   - [ ] Texto: "¡Registrado!"
   - [ ] Subtexto: "Te avisaremos cuando esté disponible"
   - [ ] Card muestra estado "registrado"

8. **Optional Feedback Form**
   - [ ] Form de feedback aparece
   - [ ] Pregunta: "¿Tienes alguna sugerencia o comentario?"
   - [ ] Textarea visible
   - [ ] Placeholder en idioma correcto
   - [ ] Escribe: "Necesito esto para llamadas internacionales con clientes"
   - [ ] Ve botones: "Enviar" y "Omitir"

9. **Submit Feedback**
   - [ ] Click en "Enviar"
   - [ ] Feedback se guarda
   - [ ] Form desaparece
   - [ ] Sigue visible mensaje de éxito

10. **Test Other Features**
    - [ ] Scroll a card "Traducción en Tiempo Real"
    - [ ] Vota prioridad: 4
    - [ ] Click "Quiero acceso anticipado"
    - [ ] Esta vez click "Omitir" en feedback
    - [ ] Verifica registro exitoso

11. **Test Duplicate Prevention**
    - [ ] Intenta registrar interés nuevamente en "Llamadas"
    - [ ] Verifica que no permite duplicado (unique constraint)
    - [ ] O muestra que ya está registrado

12. **Language Toggle Test**
    - [ ] Cambia idioma a inglés (EN)
    - [ ] Verifica todos los textos se traducen:
      - Títulos de features
      - Descripciones
      - Lista de características
      - Botones
      - Fechas
      - Feedback form
    - [ ] Cambia de vuelta a español

13. **Database Verification**
    - [ ] Open Supabase dashboard
    - [ ] Navigate to `feature_interest` table
    - [ ] Verifica registro existe:
      ```sql
      SELECT * FROM feature_interest
      WHERE user_id = [test_user_id]
      ORDER BY clicked_at DESC;
      ```
    - [ ] Confirma datos correctos:
      - ✅ user_id correcto
      - ✅ feature_name = 'calls' y 'translation'
      - ✅ priority_vote = 5 y 4 respectivamente
      - ✅ clicked_at timestamp correcto

14. **Feedback Verification**
    - [ ] Navigate to `feature_feedback` table
    - [ ] Verifica feedback guardado:
      ```sql
      SELECT * FROM feature_feedback
      WHERE user_id = [test_user_id]
      AND feature_name = 'calls';
      ```
    - [ ] Confirma texto: "Necesito esto para llamadas internacionales con clientes"

15. **Analytics Query Test**
    - [ ] Run aggregation function:
      ```sql
      SELECT * FROM get_feature_interest_stats();
      ```
    - [ ] Verifica output:
      - feature_name (calls, translation, crm, yana)
      - total_clicks (conteo)
      - avg_priority (promedio de votos)
      - unique_users (usuarios únicos)

**Expected Result:**
- ✅ Usuario puede expresar interés en múltiples features
- ✅ Sistema registra prioridad votada
- ✅ Feedback opcional funciona
- ✅ No permite duplicados
- ✅ Todo bilingüe (ES/EN)
- ✅ Data se guarda correctamente en DB
- ✅ UX es clara y atractiva

**Potential Issues:**
- ⚠️ Cards no responsive en mobile
- ⚠️ Gradient no visible en algunos navegadores
- ⚠️ Feedback form muy largo
- ⚠️ No hay confirmación visual de que feedback se envió
- ⚠️ Falta botón para "ver todas mis preferencias"

**Priority:** 🔴 **P0 - CRITICAL** (core del piloto de validación)

---

## ✅ SIGN-OFF CRITERIA

La app está lista para piloto cuando:

1. ✅ **All P0 issues resolved**
   - No blocking bugs
   - Core flows work 100%

2. ✅ **All P1 issues resolved or mitigated**
   - Major issues fixed
   - Workarounds documented

3. ✅ **Testing complete on:**
   - [ ] Chrome desktop
   - [ ] Safari desktop
   - [ ] Chrome mobile (Android)
   - [ ] Safari mobile (iOS)

4. ✅ **Performance acceptable:**
   - [ ] Load times < 3s on 3G
   - [ ] No console errors
   - [ ] Lighthouse score > 80

5. ✅ **Documentation complete:**
   - [ ] User guide ready
   - [ ] Support docs ready
   - [ ] Known issues list

---

## 🎉 RESULTADO ESPERADO

Al completar estos tests:

- ✅ **100% de flujos críticos funcionando**
- ✅ **Errores manejados graciosamente**
- ✅ **UX consistente y predecible**
- ✅ **Performance aceptable**
- ✅ **Ready for 20 pilot users**

---

**Estado:** ⏳ **TESTS DOCUMENTADOS - LISTO PARA EJECUCIÓN**

**Próximo paso:** Ejecutar tests manuales y documentar resultados

---

## 📊 POST-TEST ANALYTICS QUERIES

Después de ejecutar los tests, correr estos queries para validar data:

```sql
-- 1. Feature Interest Summary
SELECT
  feature_name,
  COUNT(*) as total_interest,
  AVG(priority_vote) as avg_priority,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(clicked_at) as first_click,
  MAX(clicked_at) as last_click
FROM feature_interest
GROUP BY feature_name
ORDER BY total_interest DESC;

-- 2. Feature Feedback Summary
SELECT
  feature_name,
  COUNT(*) as feedback_count,
  COUNT(*) * 100.0 / NULLIF((
    SELECT COUNT(*) FROM feature_interest fi2
    WHERE fi2.feature_name = feature_feedback.feature_name
  ), 0) as feedback_rate_percent
FROM feature_feedback
GROUP BY feature_name;

-- 3. User Engagement with Coming Soon Features
SELECT
  COUNT(DISTINCT user_id) as users_who_showed_interest,
  AVG(feature_count) as avg_features_per_user
FROM (
  SELECT user_id, COUNT(*) as feature_count
  FROM feature_interest
  GROUP BY user_id
) as user_stats;

-- 4. Top 10 Most Recent Feedback Comments
SELECT
  ff.feature_name,
  ff.feedback_text,
  ff.created_at,
  au.email as user_email
FROM feature_feedback ff
JOIN auth.users au ON ff.user_id = au.id
ORDER BY ff.created_at DESC
LIMIT 10;

-- 5. Priority Distribution per Feature
SELECT
  feature_name,
  priority_vote,
  COUNT(*) as count
FROM feature_interest
GROUP BY feature_name, priority_vote
ORDER BY feature_name, priority_vote DESC;
```

---

*Documento actualizado: 1 de Diciembre de 2025*
*Test Design: Claude Code Agent*
*Proyecto: HUMANBIBLIO Pre-Piloto*
*NEW: Coming Soon Features Testing Added ✅*
