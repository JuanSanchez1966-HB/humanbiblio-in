# CRONOGRAMA DE DESARROLLO ALINEADO CON PLAN PILOTO
**Período:** 25 Nov 2024 - 15 Ene 2025 (7 semanas)
**Estrategia:** Desarrollo paralelo que minimiza fricción con actividades del piloto

---

## 🎯 PRINCIPIO RECTOR

**"No construir mientras estamos vendiendo, pero sí mientras recopilamos feedback"**

El piloto tiene 3 momentos críticos:
1. **Semana 1 (1-7 Dic):** Primera impresión - NO TOCAR nada crítico
2. **Semana 2-3 (8-21 Dic):** Crecimiento - Fixes rápidos OK, features nuevos NO
3. **Semana 4-6 (22 Dic - 5 Ene):** Navidad/consolidación - Desarrollo intensivo OK

---

## 📊 ANÁLISIS: INVENTARIO vs NECESIDADES DEL PILOTO

### ✅ LO QUE EL PILOTO NECESITA (Checklist Fase 1)

| Feature Requerido | Estado Actual | ¿Bloqueante? |
|-------------------|---------------|--------------|
| Landing page de registro | ✅ COMPLETO | No |
| Base de datos Supabase | ✅ COMPLETO | No |
| **Búsqueda funcional Ágora** | 🟡 40% | **SÍ - CRÍTICO** |
| **Búsqueda funcional WB** | 🟡 40% | **SÍ - CRÍTICO** |
| **Sistema subida imágenes** | 🟡 30% | **SÍ - MODERADO** |
| **Reviews/ratings básico** | ❌ 0% | **SÍ - MODERADO** |
| Testing de features core | 🟡 Parcial | **SÍ - CRÍTICO** |
| Deploy en Netlify | ✅ Listo | No |
| Analytics (GA/Mixpanel) | ❌ 0% | **SÍ - ALTO** |
| Email templates | ✅ COMPLETO | No |
| Soporte configurado | ❌ 0% | **SÍ - MODERADO** |
| Términos y condiciones | ❌ 0% | **SÍ - LEGAL** |

---

### 🔴 FUNCIONALIDADES BLOQUEANTES PARA PILOTO (25-30 Nov)

**Estas DEBEN estar antes del 1 Diciembre:**

1. **Búsqueda por proximidad básica**
   - Estado: 40% completo
   - Gap: Cálculo real de distancias entre usuarios
   - Esfuerzo: 2 días
   - **CRÍTICO**

2. **Subida de imágenes funcional**
   - Estado: 30% completo
   - Gap: Integración con Supabase Storage
   - Esfuerzo: 1.5 días
   - **MODERADO pero esperado por usuarios**

3. **Analytics básico**
   - Estado: 0%
   - Gap: Google Analytics o Mixpanel
   - Esfuerzo: 0.5 días
   - **ALTO - necesario para medir hipótesis**

4. **Reviews/ratings básico**
   - Estado: 0%
   - Gap: Sistema completo
   - Esfuerzo: 2 días
   - **MODERADO - se puede agregar en Semana 2**

5. **Términos y condiciones**
   - Estado: 0%
   - Gap: Documento legal + display
   - Esfuerzo: 1 día (usar templates)
   - **LEGAL - debe estar**

**Total esfuerzo PRE-PILOTO: 5-6 días de desarrollo**

---

### 🟡 FUNCIONALIDADES DESEABLES (pero no bloqueantes)

Estas pueden agregarse DURANTE el piloto sin romper flujo:

6. **Trust Score básico visible**
   - Estado: 30% (badge existe, algoritmo incompleto)
   - Timing: Semana 2-3 del piloto
   - No crítico pero usuarios preguntarán

7. **Notificaciones batched**
   - Estado: 10%
   - Timing: Post-piloto
   - No esperado por usuarios inicialmente

8. **WebRTC funcional**
   - Estado: 40%
   - Timing: Post-piloto
   - Usuarios pueden usar alternativas (Zoom, etc.)

---

### ❌ FUNCIONALIDADES NO NECESARIAS PARA PILOTO

**POSPONER hasta después del piloto:**

9. **Sistema de suscripciones** - Piloto es gratis
10. **Stripe Connect** - No hay transacciones en piloto
11. **Programa de referidos formal** - Referidos manuales OK
12. **Team members** - No hay empresas grandes en piloto
13. **Integraciones** - Overhead innecesario

---

## 📅 CRONOGRAMA SEMANAL DETALLADO

---

## **SEMANA 0: PRE-PILOTO (25 Nov - 30 Nov)**

**Objetivo:** Tener MVP funcional para primeros 20 usuarios

### **🔴 Lunes 25 - Martes 26 Nov: SPRINT CRÍTICO**

**Desarrollo (16 horas):**

✅ **Búsqueda por proximidad (8 horas):**
- [ ] Implementar cálculo de distancia Haversine
- [ ] Filtrar resultados por radio (default 10km)
- [ ] Ordenar resultados por distancia
- [ ] Display de "A 5.2 km de ti" en cards

✅ **Subida de imágenes (6 horas):**
- [ ] Configurar Supabase Storage bucket
- [ ] Implementar upload en `MediaUploader.tsx`
- [ ] Optimización de imágenes (resize, compress)
- [ ] Display en perfiles

✅ **Analytics setup (2 horas):**
- [ ] Google Analytics 4 tag
- [ ] Event tracking básico (registros, búsquedas, mensajes)
- [ ] Dashboard inicial en GA

**⚠️ NO HACER:** Features nuevas, refactoring, cambios visuales grandes

---

### **🟡 Miércoles 27 - Jueves 28 Nov: FEATURES MODERADAS**

**Desarrollo (14 horas):**

✅ **Reviews/Ratings básico (8 horas):**
- [ ] Schema en Supabase (tabla `reviews`)
- [ ] UI para dejar review (1-5 estrellas + comentario)
- [ ] Display de reviews en perfiles expandidos
- [ ] Promedio de rating en cards

✅ **Términos y condiciones (2 horas):**
- [ ] Usar template legal (Termly o iubenda)
- [ ] Modal de aceptación en registro
- [ ] Link en footer

✅ **Email de soporte (1 hora):**
- [ ] Configurar soporte@humanbiblio.com
- [ ] Responder automático
- [ ] Forward a tu email personal

✅ **Testing completo (3 horas):**
- [ ] Flujo completo: registro → perfil → búsqueda → mensaje
- [ ] Testing en móvil (iOS + Android)
- [ ] Fix de bugs críticos

---

### **🟢 Viernes 29 - Sábado 30 Nov: POLISH & DEPLOY**

**Actividades (8 horas):**

✅ **Polish final (4 horas):**
- [ ] Mensajes de error amigables
- [ ] Loading states en todas las acciones
- [ ] Empty states ("No hay resultados")
- [ ] Onboarding tooltips básicos

✅ **Deploy y monitoreo (2 horas):**
- [ ] Deploy a producción (Netlify)
- [ ] Verificar que todo funciona
- [ ] Configurar alertas de errores (Sentry o similar)

✅ **Preparación operacional (2 horas):**
- [ ] Crear grupo de WhatsApp para early adopters
- [ ] Documento de troubleshooting (FAQ interno)
- [ ] Checklist de monitoreo diario

**🎯 Resultado:** App lista para recibir primeros 20 usuarios el 1 Diciembre

---

## **SEMANA 1 DEL PILOTO (1-7 Dic): MODO DEFENSA**

**Objetivo:** Cero interrupciones, solo monitoring y hotfixes

### **Actividades de desarrollo:**

**🚨 PROHIBIDO:**
- ❌ Agregar features nuevas
- ❌ Refactoring de código
- ❌ Cambios en UI
- ❌ Deploys grandes

**✅ PERMITIDO:**
- ✅ Hotfixes de bugs críticos (< 30 min cada uno)
- ✅ Monitoring 24/7
- ✅ Responder a soporte usuarios
- ✅ Documentar feedback y bugs

**Tiempo de desarrollo:** 5-10 horas (hotfixes + monitoring)

**Tiempo libre:** 30-35 horas disponibles para:
- Reclutamiento (emails, WhatsApp, eventos)
- Análisis de feedback
- Documentación de pain points

---

### **🔍 Análisis de métricas (diario, 30 min):**

Monitorear en Google Analytics:
- [ ] Registros completados
- [ ] Tiempo promedio para completar perfil
- [ ] Búsquedas realizadas
- [ ] Mensajes enviados
- [ ] Errores técnicos (Sentry)

**Decisión:** ¿Hay bugs críticos que bloquean uso? → Hotfix inmediato

---

## **SEMANA 2 DEL PILOTO (8-14 Dic): MEJORAS RÁPIDAS**

**Objetivo:** Implementar fixes de problemas reportados en Semana 1

### **Lunes 8 - Martes 9 Dic: ANÁLISIS + PRIORIZACIÓN**

**Actividades (8 horas):**

✅ **Review de feedback Semana 1 (4 horas):**
- [ ] Leer todos los reportes de usuarios
- [ ] Entrevistas 1-on-1 con 5 usuarios activos (30 min c/u)
- [ ] Identificar top 3 pain points

✅ **Priorización (2 horas):**
- [ ] Clasificar: Crítico / Alto / Medio / Bajo
- [ ] Estimar esfuerzo: Quick win (< 2h) / Normal (2-8h) / Grande (> 8h)
- [ ] Seleccionar qué implementar esta semana

✅ **Planificación (2 horas):**
- [ ] Crear tickets en Notion/Linear
- [ ] Asignar a días específicos
- [ ] Comunicar a usuarios: "Estamos trabajando en X"

---

### **Miércoles 10 - Viernes 12 Dic: DESARROLLO DE MEJORAS**

**Desarrollo (12-16 horas):**

**Escenarios posibles según feedback:**

**Escenario A: Problemas de búsqueda**
- [ ] Mejorar algoritmo de relevancia
- [ ] Agregar más filtros (profesión, idiomas)
- [ ] Búsqueda por keywords en bio

**Escenario B: Problemas de comunicación**
- [ ] Notificaciones de mensajes no llegan
- [ ] Fix en sistema de chat
- [ ] Indicador de "typing..."

**Escenario C: Problemas de perfiles**
- [ ] Falta info clave en perfiles
- [ ] Agregar campos faltantes
- [ ] Edición de perfil más fácil

**🎯 Regla:** Solo features que usuarios PIDEN, no las que tú crees que necesitan

---

### **Sábado 13 - Domingo 14 Dic: DEPLOY + COMUNICACIÓN**

**Actividades (6 horas):**

✅ **Testing de mejoras (3 horas):**
- [ ] Testing completo pre-deploy
- [ ] Invitar a 2-3 usuarios beta a probar
- [ ] Fix de bugs encontrados

✅ **Deploy (1 hora):**
- [ ] Deploy a producción
- [ ] Monitoreo post-deploy (2 horas)

✅ **Comunicación a usuarios (2 horas):**
- [ ] Email/WhatsApp: "Hemos implementado X basado en tu feedback"
- [ ] Solicitar que prueben las mejoras
- [ ] Agradecer participación

---

## **SEMANA 3 DEL PILOTO (15-21 Dic): OPTIMIZACIÓN**

**Objetivo:** Segunda ronda de mejoras + preparar para crecimiento

### **Lunes 15 - Miércoles 17 Dic: DESARROLLO**

**Desarrollo (12-16 horas):**

**Prioridades (según feedback acumulado):**

✅ **Trust Score más visible (6 horas):**
- [ ] Implementar cálculo básico (3 de 6 señales)
- [ ] Profile completeness (automático)
- [ ] Platform tenure (automático)
- [ ] Activity consistency (automático)
- [ ] Display badge mejorado con breakdown
- [ ] "Tu Trust Score: 75/100 - ¿Cómo mejorar?"

✅ **Onboarding mejorado (4 horas):**
- [ ] Tour interactivo para nuevos usuarios
- [ ] Tooltips explicativos
- [ ] Checklist de "Completa tu perfil"

✅ **Performance optimization (4 horas):**
- [ ] Lazy loading de imágenes
- [ ] Optimización de queries Supabase
- [ ] Reducir tiempo de carga inicial

---

### **Jueves 18 - Viernes 19 Dic: PREPARACIÓN PARA ESCALA**

**Desarrollo (10 horas):**

✅ **Infraestructura (6 horas):**
- [ ] Configurar CDN para imágenes
- [ ] Optimizar base de datos (índices)
- [ ] Agregar caching donde sea posible
- [ ] Load testing (simular 100 usuarios concurrentes)

✅ **Admin tools (4 horas):**
- [ ] Panel básico para ver usuarios
- [ ] Herramienta para ver métricas rápido
- [ ] Dashboard de soporte (tickets)

---

### **Sábado 20 - Domingo 21 Dic: BUFFER**

**Reservado para:**
- [ ] Emergencias
- [ ] Bugs críticos
- [ ] Features urgentes solicitadas por usuarios
- [ ] O descanso (si todo está bien)

---

## **SEMANA 4 DEL PILOTO (22-28 Dic): MODO NAVIDAD**

**Objetivo:** Actividad mínima, desarrollo intensivo permitido

### **Contexto:**
- Usuarios en modo festivo (baja actividad)
- Ventana perfecta para desarrollo sin interrumpir

### **Lunes 22 - Miércoles 24 Dic: DESARROLLO INTENSIVO**

**Desarrollo (20 horas):**

🚀 **FASE 1 DE MONETIZACIÓN (preparar para post-piloto):**

✅ **Stripe Billing setup (12 horas):**
- [ ] Crear cuenta Stripe
- [ ] Configurar productos (FREE, $19, $99, $399)
- [ ] Integrar Stripe SDK
- [ ] UI para seleccionar tier
- [ ] Webhook para actualizar suscripciones
- [ ] Testing completo de flujo

✅ **Límites por tier - Fase 1 (8 horas):**
- [ ] Implementar límite de mensajes/mes
- [ ] Implementar límite de búsquedas (o no, TBD)
- [ ] Display de "X mensajes restantes"
- [ ] Prompt para upgrade

**🎁 Jueves 25 Dic: NAVIDAD - OFF**

---

### **Viernes 26 - Domingo 28 Dic: FEATURES POST-PILOTO**

**Desarrollo (16 horas):**

✅ **Trust Score completo (10 horas):**
- [ ] Implementar 6 señales completas
- [ ] Identity verification básica (subida de ID)
- [ ] Community feedback (endorsements)
- [ ] Interaction history tracking
- [ ] Algoritmo de cálculo final
- [ ] Bootstrap: Google Business import (si tiempo)

✅ **Programa de referidos básico (6 horas):**
- [ ] Generar link único por usuario
- [ ] Tracking de referidos
- [ ] Display de "Has referido a X personas"
- [ ] Recompensa: +1 mes premium gratis

---

## **SEMANA 5 POST-PILOTO (29 Dic - 4 Ene): CONSOLIDACIÓN**

**Objetivo:** Análisis profundo + desarrollo de gaps

### **Lunes 29 - Miércoles 31 Dic: ANÁLISIS FINAL**

**Actividades (12 horas):**

✅ **Análisis de datos completo (8 horas):**
- [ ] Procesar encuestas de feedback
- [ ] Entrevistas 1-on-1 con 10 usuarios clave (30 min c/u)
- [ ] Análisis de métricas (GA + Supabase)
- [ ] Identificar features más/menos usados
- [ ] Calcular hipótesis validadas/invalidadas

✅ **Reporte de piloto (4 horas):**
- [ ] Crear presentación (10-15 slides)
- [ ] Resultados vs objetivos
- [ ] Testimonios clave
- [ ] Prioridades post-piloto

---

### **Jueves 1 - Sábado 3 Ene: DESARROLLO CRÍTICO**

**Desarrollo (20 horas):**

**Prioridades (según reporte):**

✅ **Cerrar gaps críticos identificados:**
- [ ] Features rotas que usuarios esperaban
- [ ] Pain points mayores
- [ ] Quick wins de UX

✅ **Preparar monetización (si no está):**
- [ ] Completar Stripe integration
- [ ] Tier limits funcionales
- [ ] UI de upgrade pulida

✅ **Polish final pre-lanzamiento:**
- [ ] Correcciones visuales
- [ ] Mensajes de error mejorados
- [ ] Performance final

---

## **SEMANA 6 (6-12 Ene): PREPARACIÓN LANZAMIENTO**

**Objetivo:** Plataforma lista para lanzamiento comercial

### **Lunes 6 - Miércoles 8 Ene: FEATURES FINALES**

**Desarrollo (16 horas):**

✅ **Stripe Connect básico (10 horas):**
- [ ] Onboarding de sellers
- [ ] Link de pago básico
- [ ] Escrow simple (hold funds 24-48h)
- [ ] Fees según tier (5%, 3%, 1.5%)

✅ **Analytics avanzado (6 horas):**
- [ ] Dashboard para usuarios premium
- [ ] Vistas de perfil
- [ ] Clicks en "Contact"
- [ ] Tasa de respuesta

---

### **Jueves 9 - Viernes 10 Ene: QA & TESTING**

**Actividades (16 horas):**

✅ **Testing exhaustivo (12 horas):**
- [ ] Flujos completos end-to-end
- [ ] Testing de pagos (Stripe test mode)
- [ ] Testing de todos los tiers
- [ ] Performance bajo carga
- [ ] Mobile (iOS + Android)
- [ ] Cross-browser (Chrome, Safari, Firefox)

✅ **Bug fixing final (4 horas):**
- [ ] Resolver todos los bugs encontrados
- [ ] Priorizar críticos

---

### **Sábado 11 - Domingo 12 Ene: DEPLOY FINAL**

**Actividades (8 horas):**

✅ **Preparación (4 horas):**
- [ ] Migración de datos si necesario
- [ ] Backup completo
- [ ] Rollback plan

✅ **Deploy (2 horas):**
- [ ] Deploy a producción
- [ ] Smoke testing
- [ ] Monitoring intensivo

✅ **Comunicación (2 horas):**
- [ ] Email a todos los usuarios del piloto
- [ ] Anuncio en redes sociales
- [ ] Update de landing page

---

## 📊 RESUMEN DE ESFUERZO POR SEMANA

| Semana | Fase Piloto | Desarrollo | Soporte/Ops | Marketing | Total |
|--------|-------------|------------|-------------|-----------|-------|
| **0 (25-30 Nov)** | Pre-piloto | 38h | 2h | 0h | 40h |
| **1 (1-7 Dic)** | Lanzamiento | 8h | 15h | 20h | 43h |
| **2 (8-14 Dic)** | Crecimiento | 20h | 10h | 15h | 45h |
| **3 (15-21 Dic)** | Crecimiento | 20h | 8h | 12h | 40h |
| **4 (22-28 Dic)** | Push final | 30h | 5h | 5h | 40h |
| **5 (29 Dic-4 Ene)** | Consolidación | 30h | 8h | 2h | 40h |
| **6 (6-12 Ene)** | Análisis | 40h | 2h | 3h | 45h |
| **TOTAL** | | **186h** | **50h** | **57h** | **293h** |

**Distribución de tiempo:**
- **Desarrollo:** 63% (186h)
- **Soporte/Operaciones:** 17% (50h)
- **Marketing/Reclutamiento:** 20% (57h)

---

## 🎯 HITOS CLAVE

### **30 Nov (Día -1):**
✅ App lista para primeros usuarios

### **7 Dic (Semana 1 completa):**
✅ 20 usuarios activos, cero bugs críticos

### **21 Dic (Semana 3 completa):**
✅ 70 usuarios, Trust Score básico funcional

### **4 Ene (Post-piloto):**
✅ Reporte completo, monetización lista

### **12 Ene (Pre-lanzamiento):**
✅ Plataforma comercial completa

---

## ⚠️ GESTIÓN DE RIESGOS

### **RIESGO 1: Bug crítico durante Semana 1**

**Probabilidad:** Media (30%)

**Impacto:** Alto (usuarios abandonan)

**Mitigación:**
- Testing exhaustivo en Semana 0
- Monitoring 24/7 en Semana 1
- Hotfix en < 2 horas
- Comunicación transparente con usuarios

**Plan B:**
- Tener branch de rollback listo
- Script de rollback automático

---

### **RIESGO 2: Usuarios piden feature que no existe**

**Probabilidad:** Alta (60%)

**Impacto:** Medio (expectativas vs realidad)

**Mitigación:**
- Comunicar claramente qué es MVP
- Roadmap público ("Próximamente")
- Convertir solicitudes en features de Semana 2-3

**Plan B:**
- Si es crítico, re-priorizar desarrollo

---

### **RIESGO 3: Bajo engagement en Semana 1**

**Probabilidad:** Media (40%)

**Impacto:** Alto (piloto fracasa)

**Mitigación:**
- Onboarding personalizado 1-on-1
- WhatsApp group para ayuda inmediata
- Daily check-ins con early adopters

**Plan B:**
- Iterar rápido en Semana 2
- Entrevistas profundas para entender bloqueos

---

### **RIESGO 4: No alcanzar 100 usuarios**

**Probabilidad:** Media (50%)

**Impacto:** Medio (validación incompleta)

**Mitigación:**
- Estrategias múltiples de reclutamiento
- Incentivos más agresivos si necesario

**Plan B:**
- Extender piloto 2 semanas más
- Reducir meta a 50 usuarios (suficiente para validar)

---

## 🔄 PROCESO DE ITERACIÓN DIARIA

### **Durante Semana 1-3 del piloto:**

**Cada mañana (30 min):**
1. Review de métricas overnight
2. Check de errores en Sentry
3. Leer feedback nuevo
4. Priorizar día

**Cada tarde (30 min):**
1. Review de mensajes de soporte
2. Documentar bugs/requests
3. Plan para mañana

**Cada viernes (2 horas):**
1. Reunión de retrospectiva
2. Decidir prioridades próxima semana
3. Comunicar a usuarios

---

## 💡 ESTRATEGIA DE COMUNICACIÓN CON USUARIOS

### **Transparencia total:**

**Email semanal (todos los viernes):**
```
Asunto: HumanBiblio Piloto - Update Semana X

Hola [NOMBRE],

Esta semana en HumanBiblio:

✅ Lo que implementamos:
- Feature A (gracias a tu feedback)
- Feature B
- Fix de bug C

📊 Números:
- X nuevos usuarios
- Y mensajes enviados
- Z conexiones hechas

🚀 Próxima semana:
- Feature D (basado en vuestros pedidos)
- Mejora E

💬 Tu feedback:
[Link a encuesta rápida de 3 preguntas]

Gracias por ser parte de esto,
Juan
```

---

## 🎯 CRITERIOS DE ÉXITO POST-PILOTO

**Al 12 Enero, debemos tener:**

✅ **Producto:**
- Sistema de pagos funcional (Stripe)
- Trust Score básico operativo (3-4 señales mínimo)
- Búsqueda por proximidad real
- 0 bugs críticos

✅ **Datos:**
- 50-100 usuarios registrados
- 40%+ usuarios activos semanales
- NPS >30
- 5+ testimonios entusiastas
- Hipótesis clave validadas

✅ **Negocio:**
- Roadmap claro post-piloto
- Pitch deck actualizado con data real
- Fundraising deck ready (si aplica)

---

## 📈 PRÓXIMOS PASOS POST-12 ENERO

### **Semana 7+ (13 Ene en adelante):**

**Opción A: Lanzamiento público inmediato**
- Abrir registros al público
- Campaña de marketing agresiva
- Escalar a 500 usuarios en 8 semanas

**Opción B: Segundo piloto enfocado**
- Iterar 4 semanas más
- Pulir features según feedback
- Lanzamiento en Febrero

**Opción C: Fundraising**
- Usar data del piloto para pitch
- Buscar $100K-500K seed
- Escalar con capital

**Decisión:** Se tomará el 5 Enero basado en resultados

---

## ✅ CHECKLIST FINAL

### **Antes de cada deploy:**
- [ ] Testing manual completo
- [ ] Tests automatizados pasan (si existen)
- [ ] Revisar errores en Sentry
- [ ] Backup de base de datos
- [ ] Avisar en WhatsApp group (si es grande)

### **Antes de agregar feature nueva:**
- [ ] ¿La pidió un usuario o es especulación?
- [ ] ¿Vale la pena el esfuerzo vs impacto?
- [ ] ¿Puede esperar o es urgente?
- [ ] ¿Romperá algo existente?

### **Antes de enviar email masivo:**
- [ ] Revisar ortografía
- [ ] Testing de links
- [ ] Personalización funciona
- [ ] Opción de unsubscribe

---

## 🚀 MOTIVACIÓN

**Recuerda:**

Este cronograma está diseñado para:
1. **No romper el piloto** (modo defensa en Semana 1)
2. **Aprender rápido** (iteración en Semanas 2-3)
3. **Construir inteligente** (desarrollo intensivo en Navidad)
4. **Lanzar fuerte** (plataforma comercial en 6 semanas)

**El piloto NO es para tener todo perfecto.**
**El piloto ES para aprender qué construir después.**

Si un usuario pide algo y no está:
- ✅ Anótalo
- ✅ Agradece el feedback
- ✅ "Lo agregaremos pronto"
- ❌ NO te sientas mal
- ❌ NO lo construyas inmediatamente

**Tu trabajo en Semana 1-3: ESCUCHAR, no CODEAR.**

---

**¿Listo para empezar?** 🚀
