# 🧪 GUÍA DE TESTING MANUAL - HUMANBIBLIO MVP
## Diciembre 1, 2025

---

## 📋 PREPARACIÓN (5 minutos)

### **Herramientas necesarias:**
1. ✅ Navegador Chrome (modo incógnito recomendado para test limpio)
2. ✅ App corriendo en: http://localhost:5173
3. ✅ Supabase Dashboard abierto: https://supabase.com/dashboard
4. ✅ Este documento abierto para ir marcando checkboxes
5. ✅ Notepad o documento para anotar issues

### **Setup inicial:**
```bash
# Si la app no está corriendo, ejecutar:
npm run dev

# La app debería abrir en: http://localhost:5173
```

### **Crear cuenta de Supabase (si no lo has hecho):**
1. Ve a: https://supabase.com/dashboard
2. Login con tus credenciales
3. Selecciona tu proyecto HUMANBIBLIO
4. Ve a "Table Editor" en el menú lateral

---

## 🎯 TEST SESSION 1: COMING SOON FEATURES (PRIORIDAD MÁXIMA)

**Duración estimada:** 15-20 minutos
**Por qué empezamos aquí:** Es el core de tu estrategia de validación

### **PASO 1: Preparación**
- [ ] 1.1. Abre Chrome en modo incógnito (Ctrl+Shift+N)
- [ ] 1.2. Ve a: http://localhost:5173
- [ ] 1.3. ¿Carga la página correctamente?
  - ✅ SI → Continúa
  - ❌ NO → Anota error y avísame

### **PASO 2: Registro de Usuario**
- [ ] 2.1. Click en botón "Registrarse" (esquina superior derecha)
- [ ] 2.2. ¿Se abre el modal de Auth?
  - ✅ SI → Continúa
  - ❌ NO → Anota: "Modal Auth no abre"

- [ ] 2.3. Click en tab "Crear Cuenta"
- [ ] 2.4. Llena el formulario:
  ```
  Email: test1@humanbiblio.com
  Password: Test123456!
  Full Name: María Test González
  Profesión: Diseñadora UX
  Bio: Diseñadora especializada en apps móviles
  Intereses: diseño, tecnología, startups
  ```
- [ ] 2.5. Click "Crear Cuenta"
- [ ] 2.6. ¿Aparece modal de Términos y Condiciones?
  - ✅ SI → Continúa
  - ❌ NO → Anota: "Modal términos no aparece"

- [ ] 2.7. Scroll en el modal de términos
- [ ] 2.8. Click checkbox "Acepto los términos"
- [ ] 2.9. Click "Aceptar y Continuar"
- [ ] 2.10. ¿Se cierra el modal y ves tu nombre en header?
  - ✅ SI → Perfecto, continúa
  - ❌ NO → Anota: "No redirige después de aceptar términos"

**✅ CHECKPOINT 1:** Deberías estar logueado y ver tu nombre arriba a la derecha

### **PASO 3: Navegar a Dashboard**
- [ ] 3.1. Click en botón "Dashboard" (esquina superior derecha)
- [ ] 3.2. ¿Carga la página del Dashboard?
  - ✅ SI → Continúa
  - ❌ NO → Anota: "Dashboard no carga"

- [ ] 3.3. ¿Ves 3 tabs: "📊 Resumen", "🌍 Cerca de Mí", "🎯 Matching IA"?
  - ✅ SI → Continúa
  - ❌ NO → Anota: "Tabs no visibles"

- [ ] 3.4. ¿El tab "📊 Resumen" está activo (con fondo azul)?
  - ✅ SI → Perfecto
  - ❌ NO → Anota: "Tab resumen no activo por defecto"

### **PASO 4: Stats Cards (verificación rápida)**
- [ ] 4.1. ¿Ves 3 cards con stats?
  - Card 1: "👥 Conexiones - 12"
  - Card 2: "💬 Mensajes - 8"
  - Card 3: "⭐ Valoración - 4.8"
- [ ] 4.2. ¿Las cards se ven bien formateadas?
  - ✅ SI → Continúa
  - ❌ NO → Toma screenshot y anota

### **PASO 5: Scroll a "Próximas Funcionalidades"**
- [ ] 5.1. Scroll down en la página
- [ ] 5.2. ¿Ves sección "Actividad Reciente"?
  - ✅ SI → Continúa scrolling
  - ❌ NO → Anota

- [ ] 5.3. Continúa scrolling
- [ ] 5.4. ¿Ves título "🚀 Próximas Funcionalidades"?
  - ✅ SI → Perfecto!
  - ❌ NO → CRÍTICO - Anota y avísame

- [ ] 5.5. ¿Ves subtítulo "Ayúdanos a priorizar las funcionalidades..."?
  - ✅ SI → Continúa
  - ❌ NO → Anota

**✅ CHECKPOINT 2:** Deberías estar viendo el título de "Próximas Funcionalidades"

### **PASO 6: Verificar Feature Cards**
- [ ] 6.1. ¿Ves 4 cards en un grid (2x2 en desktop)?
  - ✅ SI → Continúa
  - ❌ NO → ¿Cuántas ves? Anota

**CARD 1: 📞 LLAMADAS Y VIDEOLLAMADAS**
- [ ] 6.2. ¿Ves el icono 📞?
- [ ] 6.3. ¿Tiene badge amarillo "Próximamente" arriba a la derecha?
- [ ] 6.4. ¿Tiene gradiente azul (from-blue-500 to-indigo-600)?
- [ ] 6.5. ¿Título visible: "Llamadas y Videollamadas"?
- [ ] 6.6. ¿Descripción visible y legible?
- [ ] 6.7. ¿Ves lista de 4 features con checkmarks verdes ✓?
- [ ] 6.8. ¿Fecha: "Febrero 2025"?
- [ ] 6.9. ¿Ves pregunta "¿Qué tan importante es esto para ti?"?
- [ ] 6.10. ¿Ves 5 botones numerados (1, 2, 3, 4, 5)?

**CARD 2: 🌐 TRADUCCIÓN EN TIEMPO REAL**
- [ ] 6.11. ¿Tiene gradiente verde (from-emerald-500 to-teal-600)?
- [ ] 6.12. ¿Fecha: "Marzo 2025"?
- [ ] 6.13. ¿Todo el contenido visible?

**CARD 3: 📊 CRM INTELIGENTE**
- [ ] 6.14. ¿Tiene gradiente morado (from-purple-500 to-violet-600)?
- [ ] 6.15. ¿Fecha: "Abril 2025"?

**CARD 4: 🌌 YANA - CROWDFUNDING**
- [ ] 6.16. ¿Tiene gradiente rosa (from-pink-500 to-rose-600)?
- [ ] 6.17. ¿Fecha: "Junio 2025"?

**Anota cualquier problema visual:**
- [ ] 6.18. ¿Alguna card se ve rota o mal formateada? ___________
- [ ] 6.19. ¿Los colores se ven bien? ___________
- [ ] 6.20. ¿El texto es legible en todos los gradientes? ___________

**✅ CHECKPOINT 3:** Las 4 cards deberían verse perfectas visualmente

### **PASO 7: Test de Interacción - Card "Llamadas"**
- [ ] 7.1. Haz hover sobre la card de "📞 Llamadas"
- [ ] 7.2. ¿La card hace un pequeño zoom (scale up)?
  - ✅ SI → Buen efecto hover
  - ❌ NO → Anota: "Hover effect no funciona"

- [ ] 7.3. Click en botón "1" (prioridad baja)
- [ ] 7.4. ¿El botón 1 se resalta con fondo blanco?
  - ✅ SI → Continúa
  - ❌ NO → Anota: "Votación no visual"

- [ ] 7.5. Click en botón "5" (prioridad máxima)
- [ ] 7.6. ¿El botón 5 se resalta ahora?
  - ✅ SI → Perfecto
  - ❌ NO → Anota: "No cambia selección"

- [ ] 7.7. ¿El botón 1 ya NO está seleccionado?
  - ✅ SI → Correcto (solo uno a la vez)
  - ❌ NO → Anota: "Múltiple selección posible"

### **PASO 8: Registrar Interés**
- [ ] 8.1. Click en botón "✋ Quiero acceso anticipado"
- [ ] 8.2. ¿El botón cambia a "Registrando..."?
  - ✅ SI → Continúa
  - ❌ NO → Anota: "Loading state no funciona"

- [ ] 8.3. Espera 1-2 segundos
- [ ] 8.4. ¿Aparece mensaje de éxito con ✅?
  - ✅ SI → ¡Excelente!
  - ❌ NO → CRÍTICO - Anota error y screenshot

- [ ] 8.5. ¿El mensaje dice "¡Registrado!"?
- [ ] 8.6. ¿Dice "Te avisaremos cuando esté disponible"?
- [ ] 8.7. ¿El botón desapareció y hay un nuevo layout?

### **PASO 9: Feedback Opcional**
- [ ] 9.1. ¿Aparece un form con textarea?
- [ ] 9.2. ¿Pregunta: "¿Tienes alguna sugerencia o comentario?"?
- [ ] 9.3. Click en el textarea
- [ ] 9.4. Escribe: "Necesito esto urgente para llamadas internacionales con clientes"
- [ ] 9.5. ¿El texto se escribe correctamente?
- [ ] 9.6. ¿Ves botones "Enviar" y "Omitir"?

- [ ] 9.7. Click en "Enviar"
- [ ] 9.8. ¿El form desaparece?
  - ✅ SI → Perfecto
  - ❌ NO → Anota: "Form no cierra después de enviar"

**✅ CHECKPOINT 4:** Has registrado interés en "Llamadas" con prioridad 5 y feedback

### **PASO 10: Verificar en Base de Datos**

**AHORA ES CRÍTICO VERIFICAR QUE LA DATA SE GUARDÓ**

- [ ] 10.1. Abre nueva pestaña: https://supabase.com/dashboard
- [ ] 10.2. Selecciona proyecto HUMANBIBLIO
- [ ] 10.3. Click en "Table Editor" (menú lateral izquierdo)
- [ ] 10.4. Busca y click en tabla "feature_interest"
- [ ] 10.5. ¿Ves un registro nuevo?
  - ✅ SI → ¡EXCELENTE! Continúa verificando
  - ❌ NO → CRÍTICO - Avisar inmediatamente

**Si ves el registro, verifica los datos:**
- [ ] 10.6. ¿user_id tiene un UUID válido?
- [ ] 10.7. ¿feature_name = "calls"?
- [ ] 10.8. ¿priority_vote = 5?
- [ ] 10.9. ¿clicked_at tiene timestamp reciente?

- [ ] 10.10. Ahora busca tabla "feature_feedback"
- [ ] 10.11. Click en "feature_feedback"
- [ ] 10.12. ¿Ves tu feedback?
- [ ] 10.13. ¿feature_name = "calls"?
- [ ] 10.14. ¿feedback_text contiene tu mensaje?

**✅ CHECKPOINT 5:** DATA GUARDADA EN BASE DE DATOS - ¡ÉXITO TOTAL!

### **PASO 11: Test de Traducción Card**
Volvamos a la app para probar otra feature:

- [ ] 11.1. Vuelve a pestaña de la app (http://localhost:5173)
- [ ] 11.2. Scroll a card "🌐 Traducción en Tiempo Real"
- [ ] 11.3. Vota prioridad: 4
- [ ] 11.4. Click "Quiero acceso anticipado"
- [ ] 11.5. ¿Se registra exitosamente?
- [ ] 11.6. Cuando aparece feedback form, click "Omitir"
- [ ] 11.7. ¿El form desaparece sin enviar feedback?
  - ✅ SI → Correcto
  - ❌ NO → Anota

### **PASO 12: Verificar Prevención de Duplicados**
- [ ] 12.1. Scroll de nuevo a "📞 Llamadas"
- [ ] 12.2. ¿Sigue mostrando mensaje "¡Registrado!"?
  - ✅ SI → Perfecto, recuerda el estado
  - ❌ NO → Anota: "Pierde estado después de scroll"

- [ ] 12.3. Recarga la página (F5)
- [ ] 12.4. Navega de nuevo a Dashboard → Resumen → Scroll
- [ ] 12.5. ¿La card de "Llamadas" recuerda que ya registraste interés?
  - ✅ SI → ¡Excelente!
  - ❌ NO → Anota: "No persiste después de reload" (este es comportamiento esperado sin query al cargar)

### **PASO 13: Test de Idioma (Bilingüe)**
- [ ] 13.1. Busca el toggle de idioma (arriba a la derecha)
- [ ] 13.2. ¿Está en "ES" actualmente?
- [ ] 13.3. Click para cambiar a "EN"
- [ ] 13.4. ¿Todo el Dashboard se traduce al inglés?
- [ ] 13.5. Scroll a "Coming Soon Features"
- [ ] 13.6. ¿Título ahora es "🚀 Coming Soon"?
- [ ] 13.7. ¿Subtítulo en inglés?
- [ ] 13.8. Verifica card "Llamadas":
  - [ ] ¿Título: "Calls & Video Calls"?
  - [ ] ¿Badge: "Coming Soon"?
  - [ ] ¿Descripción en inglés?
  - [ ] ¿Features en inglés?
  - [ ] ¿Fecha: "February 2025"?
  - [ ] ¿Botones en inglés?

- [ ] 13.9. Cambia de vuelta a español (ES)
- [ ] 13.10. ¿Todo vuelve a español correctamente?

**✅ CHECKPOINT 6:** Sistema bilingüe funciona perfectamente

### **PASO 14: Test CRM y YANA Cards**
- [ ] 14.1. Registra interés en "📊 CRM Inteligente" (prioridad 3)
- [ ] 14.2. Deja feedback: "Me interesa para gestionar contactos"
- [ ] 14.3. ¿Se registra exitosamente?

- [ ] 14.4. Registra interés en "🌌 YANA" (prioridad 5)
- [ ] 14.5. Omite el feedback
- [ ] 14.6. ¿Se registra exitosamente?

### **PASO 15: Verificación Final en Base de Datos**
- [ ] 15.1. Vuelve a Supabase Dashboard
- [ ] 15.2. Tabla "feature_interest"
- [ ] 15.3. ¿Ahora ves 4 registros?
  - calls (priority 5)
  - translation (priority 4)
  - crm (priority 3)
  - yana (priority 5)
- [ ] 15.4. Todos con tu user_id

- [ ] 15.5. Tabla "feature_feedback"
- [ ] 15.6. ¿Ves 2 feedbacks?
  - calls: "Necesito esto urgente para llamadas internacionales con clientes"
  - crm: "Me interesa para gestionar contactos"

**✅ CHECKPOINT FINAL:** ¡4 features registradas, 2 con feedback!

---

## 📊 ANALYTICS QUERY TEST

Ahora vamos a probar las queries de analytics:

### **PASO 16: SQL Editor en Supabase**
- [ ] 16.1. En Supabase Dashboard, click "SQL Editor" (menú lateral)
- [ ] 16.2. Click "New query"
- [ ] 16.3. Copia y pega este query:

```sql
SELECT * FROM get_feature_interest_stats();
```

- [ ] 16.4. Click "Run" (o Ctrl+Enter)
- [ ] 16.5. ¿Ves resultados con 4 filas?
- [ ] 16.6. ¿Columnas: feature_name, total_clicks, avg_priority, unique_users?
- [ ] 16.7. ¿Los números son correctos?

Ejemplo esperado:
```
feature_name | total_clicks | avg_priority | unique_users
-------------+--------------+--------------+-------------
calls        | 1            | 5.00         | 1
yana         | 1            | 5.00         | 1
translation  | 1            | 4.00         | 1
crm          | 1            | 3.00         | 1
```

- [ ] 16.8. Copia y pega este segundo query:

```sql
SELECT
  feature_name,
  COUNT(*) as feedback_count
FROM feature_feedback
GROUP BY feature_name
ORDER BY feedback_count DESC;
```

- [ ] 16.9. ¿Ves 2 resultados (calls y crm)?

**✅ ANALYTICS FUNCIONAN PERFECTAMENTE**

---

## 📱 TEST SESSION 2: MOBILE RESPONSIVE (10 minutos)

### **PASO 17: Chrome DevTools Mobile View**
- [ ] 17.1. En Chrome, presiona F12 (abrir DevTools)
- [ ] 17.2. Click en icono de móvil (Toggle device toolbar) o Ctrl+Shift+M
- [ ] 17.3. Selecciona "iPhone 12 Pro" en dropdown
- [ ] 17.4. Navega a Dashboard → Resumen
- [ ] 17.5. Scroll a "Próximas Funcionalidades"

**Verificar en móvil:**
- [ ] 17.6. ¿Las 4 cards ahora están en columna vertical (1 por fila)?
- [ ] 17.7. ¿Todo el texto es legible?
- [ ] 17.8. ¿Los botones son lo suficientemente grandes para tocar?
- [ ] 17.9. ¿No hay scroll horizontal?
- [ ] 17.10. ¿Los gradientes se ven bien?

- [ ] 17.11. Intenta registrar interés desde vista móvil
- [ ] 17.12. ¿Todo funciona igual que en desktop?

**✅ MOBILE RESPONSIVE OK**

---

## 🎯 RESUMEN DE RESULTADOS

### **FEATURES TESTEADAS:**

| Feature | Funciona | Issues |
|---------|----------|--------|
| ✅ Registro de usuario | ☐ SI ☐ NO | __________ |
| ✅ Dashboard carga | ☐ SI ☐ NO | __________ |
| ✅ Coming Soon cards visibles | ☐ SI ☐ NO | __________ |
| ✅ Votación de prioridad | ☐ SI ☐ NO | __________ |
| ✅ Registro de interés | ☐ SI ☐ NO | __________ |
| ✅ Feedback opcional | ☐ SI ☐ NO | __________ |
| ✅ Data en BD correcta | ☐ SI ☐ NO | __________ |
| ✅ Prevención duplicados | ☐ SI ☐ NO | __________ |
| ✅ Bilingüe (ES/EN) | ☐ SI ☐ NO | __________ |
| ✅ Analytics queries | ☐ SI ☐ NO | __________ |
| ✅ Mobile responsive | ☐ SI ☐ NO | __________ |

### **SEVERITY DE ISSUES:**

**🔴 CRITICAL (P0) - Bloquea piloto:**
1. _____________________________________
2. _____________________________________

**🟠 HIGH (P1) - Debe fixearse antes de piloto:**
1. _____________________________________
2. _____________________________________

**🟡 MEDIUM (P2) - Deseable pero no bloquea:**
1. _____________________________________
2. _____________________________________

**🟢 LOW (P3) - Nice to have:**
1. _____________________________________
2. _____________________________________

---

## ✅ DECISIÓN FINAL

¿Está listo para piloto?

- [ ] ✅ **SÍ** - No hay issues críticos, podemos deployar
- [ ] ⚠️ **CON CONDICIONES** - Hay issues P1 pero tenemos workarounds
- [ ] ❌ **NO** - Hay issues P0 que deben fixearse primero

**Firma y fecha:** ________________________

---

## 🚀 PRÓXIMO PASO

Si todo está OK:
1. ✅ Documentar cualquier issue encontrado
2. ✅ Yo fixeo issues críticos (si hay)
3. ✅ Deploy a Netlify
4. ✅ Test rápido en producción
5. ✅ ¡LANZAR PILOTO! 🎉

---

**Tiempo total estimado de testing:** 30-40 minutos
**Preparado por:** Claude Code Agent
**Fecha:** Diciembre 1, 2025
