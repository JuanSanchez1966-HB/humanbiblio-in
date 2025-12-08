# 🚀 GUÍA: ACTUALIZAR GITHUB Y DEPLOY EN NETLIFY

## 📋 TU SITUACIÓN ACTUAL

- ✅ **GitHub:** JuanSanchez1966-HB
- ✅ **Repositorio:** `humanbiblio` (fresco, listo para deploy)
- ✅ **Repositorio viejo:** `humanbiblio-mvp` (no usaremos este)

---

## 🎯 PLAN COMPLETO (3 FASES)

### **FASE 1:** Actualizar repositorio GitHub `humanbiblio`
### **FASE 2:** Conectar Netlify con GitHub
### **FASE 3:** Deploy automático

---

# FASE 1: ACTUALIZAR GITHUB 📤

## ¿QUÉ ARCHIVOS NECESITAS ACTUALIZAR?

Tu repositorio `humanbiblio` necesita estos archivos ESENCIALES:

### **Archivos de configuración:**
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `netlify.toml`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.js`
- ✅ `postcss.config.js`
- ✅ `.gitignore`
- ✅ `.env.example`
- ✅ `index.html`

### **Carpetas de código:**
- ✅ `src/` (todo el código fuente)
- ✅ `supabase/migrations/` (base de datos)

### **NO subas:**
- ❌ `node_modules/` (se instala automático)
- ❌ `dist/` (se genera automático)
- ❌ `.env` (secretos locales)
- ❌ Archivos `.md` de documentación (opcional)

---

## OPCIÓN A: ACTUALIZAR DESDE TU COMPUTADORA 💻

### **Paso 1: Clonar el repositorio**

Abre terminal o Git Bash y ejecuta:

```bash
cd C:\Users\TuUsuario\Documents
git clone https://github.com/JuanSanchez1966-HB/humanbiblio.git
cd humanbiblio
```

### **Paso 2: Copiar archivos nuevos**

1. Copia TODOS los archivos de `HUMANBIBLIO\humanbiblio-deploy`
2. Pégalos en la carpeta `humanbiblio` que acabas de clonar
3. **REEMPLAZA** los archivos existentes

### **Paso 3: Verificar archivos críticos**

Asegúrate que estos archivos estén presentes:
```bash
dir package.json
dir netlify.toml
dir src\App.tsx
```

### **Paso 4: Subir a GitHub**

```bash
git add .
git commit -m "Update complete project for Netlify deploy"
git push origin main
```

Si te pide credenciales:
- **Usuario:** JuanSanchez1966-HB
- **Password:** Usa un Personal Access Token (no tu contraseña)

#### ¿Cómo crear Personal Access Token?
1. GitHub.com → Tu perfil (esquina superior derecha)
2. Settings → Developer settings (abajo a la izquierda)
3. Personal access tokens → Tokens (classic)
4. "Generate new token" → Nombre: "Netlify Deploy"
5. Marca: `repo` (todos los checkboxes)
6. Generate token
7. **COPIA EL TOKEN** (solo lo verás una vez)
8. Úsalo como password cuando Git te lo pida

---

## OPCIÓN B: ACTUALIZAR DESDE GITHUB.COM (WEB) 🌐

Si prefieres no usar terminal:

### **Para archivos individuales:**

1. Ve a: https://github.com/JuanSanchez1966-HB/humanbiblio
2. Click en el archivo que quieres actualizar (ej: `package.json`)
3. Click en el ícono de lápiz (Edit)
4. Copia el contenido nuevo desde tus archivos
5. Pega en el editor
6. Scroll abajo → "Commit changes"
7. Mensaje: "Update [nombre archivo]"
8. Click "Commit changes"

**Repite para cada archivo que cambió**

### **Para carpetas completas:**

1. En tu repositorio GitHub, click "Add file" → "Upload files"
2. Arrastra carpeta `src/` completa
3. GitHub la subirá con toda su estructura
4. Commit con mensaje: "Update source code"

---

## ⚠️ ARCHIVOS MÁS IMPORTANTES

Si tienes poco tiempo, asegúrate que AL MENOS estos estén actualizados:

1. **`package.json`** - Define dependencias
2. **`netlify.toml`** - Configuración de deploy
3. **`vite.config.ts`** - Configuración de build
4. **`src/App.tsx`** - Aplicación principal
5. **`.env.example`** - Ejemplo variables de entorno
6. **Carpeta `src/`** completa - Todo el código

---

# FASE 2: CONECTAR NETLIFY CON GITHUB 🔗

Una vez que tu repositorio esté actualizado:

## **Paso 1: Ir a Netlify**

1. Ve a: **https://app.netlify.com**
2. Login con tu cuenta
3. Click **"Add new site"** (botón en la esquina superior derecha)

## **Paso 2: Importar desde GitHub**

1. Click **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Si es primera vez: **"Authorize Netlify"** (permite acceso)
4. Busca tu repositorio: **`humanbiblio`**
5. Click en **`JuanSanchez1966-HB/humanbiblio`**

## **Paso 3: Configurar Build**

Netlify detectará automáticamente:
- ✅ **Build command:** `npm run build`
- ✅ **Publish directory:** `dist`
- ✅ **Branch:** `main`

**NO CAMBIES NADA** - La configuración es correcta.

## **Paso 4: Agregar Variables de Entorno** 🔑

**CRÍTICO:** Antes de hacer deploy, necesitas configurar Supabase.

1. Antes de hacer deploy, busca: **"Add environment variables"**
2. Click para expandir
3. Agrega estas 2 variables:

### **Variable 1: VITE_SUPABASE_URL**
- **Key:** `VITE_SUPABASE_URL`
- **Value:** Tu URL de Supabase (ejemplo: `https://xxxxx.supabase.co`)

### **Variable 2: VITE_SUPABASE_ANON_KEY**
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Tu Anon Key de Supabase (empieza con `eyJ...`)

#### ¿Dónde encuentro estas credenciales?

1. Ve a: **https://supabase.com/dashboard**
2. Selecciona tu proyecto
3. Click en **Settings** (engranaje) → **API**
4. Verás:
   - **Project URL** → cópialo como `VITE_SUPABASE_URL`
   - **anon public** key → cópialo como `VITE_SUPABASE_ANON_KEY`

## **Paso 5: Deploy** 🚀

1. Una vez agregadas las variables de entorno
2. Click **"Deploy [nombre-del-sitio]"**
3. Netlify empezará el proceso (2-3 minutos)

---

# FASE 3: MONITOREAR DEPLOY ⏱️

## **Qué verás durante el deploy:**

1. **Building** 🏗️
   - Clonando repositorio
   - Instalando dependencias (`npm install`)
   - Compilando código (`npm run build`)

2. **Publishing** 📤
   - Subiendo archivos a CDN de Netlify
   - Configurando dominio

3. **Success!** ✅
   - Site is live
   - URL: `https://algo-random-123.netlify.app`

## **Si hay ERRORES:**

Netlify mostrará logs en rojo. Los errores comunes:

### Error: "Build failed"
- **Causa:** Falta algún archivo en GitHub
- **Solución:** Verifica que `package.json` y `src/` estén completos

### Error: "Module not found"
- **Causa:** Dependencias no se instalaron
- **Solución:** Verifica que `package.json` tenga todas las dependencias

### Error: Variables de entorno
- **Causa:** No configuraste `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY`
- **Solución:** Site settings → Environment variables → Agrégalas

---

# 🎉 DESPUÉS DEL DEPLOY

## **Tu sitio estará en línea:**

URL ejemplo: `https://humanbiblio.netlify.app`

## **Personalizar URL:**

1. En Netlify: **Site settings**
2. **Change site name**
3. Escribe: `humanbiblio`
4. Tu URL será: **`https://humanbiblio.netlify.app`**

## **Probar que funciona:**

1. ✅ Abre la URL
2. ✅ Verifica que carga la interfaz
3. ✅ Prueba registrarte
4. ✅ Navega por Ágora, World Boulevard, Universe

---

# 🔄 ACTUALIZAR EN EL FUTURO

Cuando quieras hacer cambios:

## **Opción A: Desde Git**
```bash
cd humanbiblio
# Haz tus cambios
git add .
git commit -m "Descripción del cambio"
git push
```
**Netlify hará deploy automático en 2-3 minutos**

## **Opción B: Desde GitHub.com**
1. Edita archivos directamente en GitHub
2. Commit changes
3. Deploy automático

---

# 📞 CHECKLIST FINAL

Antes de empezar, verifica:

- [ ] Tienes acceso a GitHub como `JuanSanchez1966-HB`
- [ ] El repositorio `humanbiblio` existe
- [ ] Tienes las credenciales de Supabase (URL y Anon Key)
- [ ] Tienes cuenta en Netlify
- [ ] Los archivos del proyecto están en tu computadora

---

# 🆘 PROBLEMAS COMUNES

## "No puedo hacer push a GitHub"
- Usa Personal Access Token en lugar de password
- Verifica que tienes permisos en el repositorio

## "Netlify no encuentra mi repo"
- Refresca la página de Netlify
- Verifica que autorizaste a Netlify en GitHub

## "El sitio carga pero no funciona"
- Revisa variables de entorno en Netlify
- Verifica que Supabase esté funcionando
- Revisa la consola del navegador (F12)

---

# ✅ RESUMEN RÁPIDO

1. **Actualizar GitHub:** Sube archivos a `JuanSanchez1966-HB/humanbiblio`
2. **Conectar Netlify:** Import from GitHub → Selecciona `humanbiblio`
3. **Configurar variables:** Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
4. **Deploy:** Click "Deploy" y espera 3 minutos
5. **¡Listo!** Tu app estará en línea

---

**🏛️ HUMANBIBLIO lista para el mundo! 🌍**
