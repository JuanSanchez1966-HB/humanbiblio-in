# 📱 MOBILE TESTING GUIDE - HUMANBIBLIO

**Fecha:** 30 de Noviembre de 2024
**Objetivo:** Verificar responsive design y funcionalidad en dispositivos móviles

---

## 🎯 DISPOSITIVOS OBJETIVO

### **iOS**
- iPhone 14 Pro (390x844)
- iPhone SE (375x667)
- iPad Air (820x1180)

### **Android**
- Samsung Galaxy S23 (360x800)
- Google Pixel 7 (412x915)
- Tablet genérica (768x1024)

---

## ✅ CHECKLIST DE TESTING MÓVIL

### **1. LAYOUT Y DISEÑO**

#### **Landing Page**
- [ ] Hero section se muestra correctamente
- [ ] Logo escalado apropiadamente
- [ ] Botones CTA son táctiles (min 44x44px)
- [ ] Imágenes optimizadas y cargan rápido
- [ ] Texto legible sin zoom

#### **Header/Navegación**
- [ ] Logo visible y funcional
- [ ] Menú de navegación accesible
- [ ] Botones de sección (Ágora, Boulevard, Dashboard) tappables
- [ ] Language toggle funcional
- [ ] Botón de ayuda (💡) visible

#### **Search Bar**
- [ ] Input de búsqueda responsive
- [ ] Teclado móvil se abre correctamente
- [ ] Filtros desplegables funcionan
- [ ] Sugerencias de búsqueda legibles
- [ ] Loading spinner visible

---

### **2. ÁGORA (Sección de Personas)**

#### **User Cards**
- [ ] Grid se adapta a 1 columna en móvil
- [ ] Avatares cargan correctamente
- [ ] Texto no se corta
- [ ] Botones de acción (mensaje, llamada) accesibles
- [ ] Trust Score badge visible
- [ ] Distancia ("A X km") legible

#### **Expanded Profile**
- [ ] Modal se ajusta a pantalla
- [ ] Scroll funciona suavemente
- [ ] Botón cerrar (X) accesible
- [ ] Reviews legibles
- [ ] Imágenes de galería responsive

---

### **3. WORLD BOULEVARD (Negocios)**

#### **Business Cards**
- [ ] Imágenes de negocio optimizadas
- [ ] Grid adapta a 1 columna
- [ ] Ratings stars visibles
- [ ] Botones de contacto tappables
- [ ] Categorías legibles

#### **Business Profile**
- [ ] Galería de fotos funcional (swipe)
- [ ] Mapa de ubicación responsive
- [ ] Horarios legibles
- [ ] Reviews scrolleables
- [ ] Botón de contacto fijo visible

---

### **4. DASHBOARD**

#### **Profile Section**
- [ ] Avatar uploader funcional
- [ ] Form inputs accesibles
- [ ] Botones de guardar visibles
- [ ] Validación de campos funciona

#### **Stats Section**
- [ ] Métricas legibles
- [ ] Gráficas responsive
- [ ] Cards de estadísticas apiladas

---

### **5. ONBOARDING**

- [ ] Tooltips se posicionan correctamente
- [ ] Overlay oscuro visible
- [ ] Texto del tooltip legible
- [ ] Botones "Siguiente" y "Anterior" tappables
- [ ] Indicadores de progreso visibles
- [ ] Botón "Saltar" accesible
- [ ] Highlight de elementos funciona

---

### **6. MODALS Y OVERLAYS**

#### **Auth Modal**
- [ ] Modal centrado en pantalla
- [ ] Inputs de email/password accesibles
- [ ] Teclado no oculta botones
- [ ] Loading button funciona
- [ ] Error messages legibles
- [ ] Botón cerrar (X) accesible

#### **Communication Hub**
- [ ] Chat interface responsive
- [ ] Input de mensaje accesible
- [ ] Scroll de conversación suave
- [ ] Botones de voz/video tappables
- [ ] Timestamps legibles

---

### **7. INTERACCIONES TÁCTILES**

#### **Gestos**
- [ ] Tap funciona en todos los botones
- [ ] Swipe en carruseles funciona
- [ ] Pull-to-refresh (si aplica)
- [ ] Pinch-to-zoom en imágenes
- [ ] Long-press (si aplica)

#### **Feedback Táctil**
- [ ] Hover states adaptados a tap
- [ ] Ripple effect en botones
- [ ] Loading states visibles
- [ ] Animaciones suaves (no laggy)

---

### **8. RENDIMIENTO**

- [ ] Página carga en < 3 segundos
- [ ] Imágenes lazy-load correctamente
- [ ] No hay jank en scroll
- [ ] Animaciones a 60fps
- [ ] Bundle size < 200KB gzipped

---

### **9. ACCESIBILIDAD**

- [ ] Contraste de colores suficiente
- [ ] Tamaño de fuente legible (min 16px)
- [ ] Área táctil mínima 44x44px
- [ ] Labels en form inputs
- [ ] Error messages claros

---

### **10. COMPATIBILIDAD**

#### **iOS Safari**
- [ ] CSS Grid funciona
- [ ] Flexbox correcto
- [ ] Touch events funcionan
- [ ] Position sticky funciona
- [ ] Backdrop-filter funciona

#### **Android Chrome**
- [ ] Todo lo anterior
- [ ] Notificaciones push (si aplica)
- [ ] Service worker registrado

---

## 🔧 HERRAMIENTAS DE TESTING

### **Chrome DevTools**
```
1. F12 → Toggle Device Toolbar
2. Seleccionar dispositivo
3. Throttle network: Fast 3G
4. Test all breakpoints:
   - 360px (mobile small)
   - 375px (iPhone SE)
   - 390px (iPhone 14)
   - 412px (Pixel)
   - 768px (tablet)
   - 1024px (desktop)
```

### **Firefox Responsive Mode**
```
Ctrl+Shift+M
- Test iOS/Android user agents
- Touch simulation
- Device pixel ratio
```

### **Real Device Testing**
- BrowserStack (cloud testing)
- Dispositivo físico vía USB
- WiFi local network testing

---

## 🐛 ISSUES COMUNES A VERIFICAR

### **Layout**
- [ ] Text overflow (use ellipsis)
- [ ] Images aspect ratio
- [ ] Fixed position elements
- [ ] Safe area insets (iOS)

### **Performance**
- [ ] Large images (optimize)
- [ ] Too many animations
- [ ] Memory leaks
- [ ] Battery drain

### **UX**
- [ ] Buttons too small
- [ ] Text too small
- [ ] Modals behind keyboard
- [ ] Horizontal scroll unwanted

---

## 📊 BREAKPOINTS TAILWIND

Los breakpoints actuales en el proyecto:

```css
sm: 640px   /* tablet pequeño */
md: 768px   /* tablet */
lg: 1024px  /* desktop */
xl: 1280px  /* desktop grande */
2xl: 1536px /* ultra-wide */
```

**Nota:** Tailwind es mobile-first, así que el diseño base es para móvil.

---

## 🚨 PRIORIDAD DE FIXES

### **P0 - Crítico (bloquea uso)**
- Layout completamente roto
- Botones principales inaccesibles
- Crash de app
- Datos no cargan

### **P1 - Alto (dificulta uso)**
- Botones difíciles de presionar
- Texto ilegible
- Performance muy lento
- Modals mal posicionados

### **P2 - Medio (molesto pero usable)**
- Animaciones laggy
- Imágenes no optimizadas
- Pequeños overlaps de UI

### **P3 - Bajo (polish)**
- Espaciado inconsistente
- Hover states en móvil
- Micro-interactions

---

## ✅ RESULTADO ESPERADO

Al finalizar el testing, el app debe:

1. ✅ Funcionar perfectamente en dispositivos móviles
2. ✅ Cargar rápido en 3G
3. ✅ Ser completamente usable con una mano
4. ✅ Tener todos los elementos táctiles accesibles
5. ✅ Mostrar información clara sin zoom
6. ✅ Ofrecer feedback visual en todas las acciones
7. ✅ No tener scroll horizontal no deseado
8. ✅ Adaptarse automáticamente a orientación (portrait/landscape)

---

## 📝 TEMPLATE DE REPORTE

```markdown
## Issue: [Título descriptivo]

**Dispositivo:** iPhone 14 Pro / Android Galaxy S23
**Navegador:** Safari 17 / Chrome 119
**Severidad:** P0 / P1 / P2 / P3

**Descripción:**
[Qué está mal]

**Steps to Reproduce:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Expected:**
[Qué debería pasar]

**Actual:**
[Qué está pasando]

**Screenshot:**
[Si aplica]

**Fix Sugerido:**
[Idea de cómo arreglar]
```

---

## 🎯 CHECKLIST FINAL ANTES DE DEPLOY

- [ ] Todos los P0 resueltos
- [ ] Todos los P1 resueltos
- [ ] Testing en al menos 2 dispositivos iOS
- [ ] Testing en al menos 2 dispositivos Android
- [ ] Lighthouse mobile score > 80
- [ ] Core Web Vitals pass
- [ ] No errores en console
- [ ] Service worker funciona
- [ ] PWA installable

---

**Estado:** ⏳ **EN PROGRESO**

**Próximo paso:** Ejecutar testing manual en Chrome DevTools y documentar issues

---

*Documento generado: 30 de Noviembre de 2024*
*Testing lead: Claude Code Agent*
*Proyecto: HUMANBIBLIO Pre-Piloto*
