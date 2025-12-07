# Deploy Rápido en Netlify - HumanBiblio

## Estado: ✅ PROYECTO LISTO PARA DEPLOY

El proyecto compila correctamente. Sigue estos pasos para deploy en Netlify.

---

## PASO 1: Crear Repositorio en GitHub (5 minutos)

### 1.1 Ve a GitHub
- Abre: https://github.com/new
- Nombre del repositorio: `humanbiblio-app`
- Mantén como **privado** (recomendado para piloto)
- NO inicialices con README, .gitignore ni licencia
- Click en **Create repository**

### 1.2 Copia la URL del repositorio
Verás algo como: `https://github.com/TU-USUARIO/humanbiblio-app.git`

---

## PASO 2: Subir Código a GitHub (3 minutos)

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar Git (si no está inicializado)
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - HumanBiblio Pilot Ready"

# Conectar con GitHub (reemplaza con TU URL)
git remote add origin https://github.com/TU-USUARIO/humanbiblio-app.git

# Subir el código
git push -u origin main
```

**Si te pide credenciales:**
- Username: tu usuario de GitHub
- Password: usa un **Personal Access Token** (no tu contraseña)
  - Genera uno aquí: https://github.com/settings/tokens
  - Permisos necesarios: `repo` (marcar todo)

---

## PASO 3: Deploy en Netlify (5 minutos)

### 3.1 Crear cuenta en Netlify
1. Ve a: https://app.netlify.com/signup
2. Click en **"Sign up with GitHub"** (recomendado)
3. Autoriza a Netlify

### 3.2 Importar proyecto
1. Click en **"Add new site"** → **"Import an existing project"**
2. Selecciona **GitHub**
3. Busca y selecciona tu repositorio `humanbiblio-app`
4. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Branch:** `main`
5. Click en **"Deploy site"**

⏱️ Netlify tomará 2-3 minutos en hacer el primer deploy.

---

## PASO 4: Configurar Variables de Entorno (2 minutos)

### 4.1 Obtener credenciales de Supabase
Ve a tu proyecto en Supabase:
- URL: https://supabase.com/dashboard/project/TU-PROJECT-ID/settings/api

Copia estos dos valores:
1. **Project URL** (ejemplo: `https://abcdefg.supabase.co`)
2. **Anon/Public key** (empieza con `eyJ...`)

### 4.2 Configurar en Netlify
1. En Netlify, ve a: **Site configuration** → **Environment variables**
2. Click en **"Add a variable"**
3. Añade estas DOS variables:

**Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: tu Project URL de Supabase

**Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: tu Anon key de Supabase

4. Click en **"Save"**

### 4.3 Redesplegar con variables
1. Ve a **Deploys**
2. Click en **"Trigger deploy"** → **"Deploy site"**
3. Espera 2-3 minutos

---

## PASO 5: Verificar Deploy ✅

### Tu sitio estará en:
```
https://TU-SITIO.netlify.app
```

### Pruebas rápidas:
1. ✅ El sitio carga correctamente
2. ✅ Puedes crear una cuenta (Sign Up)
3. ✅ Puedes iniciar sesión (Login)
4. ✅ Ves el dashboard después de login

---

## PASO 6: Configurar Dominio Personalizado (Opcional)

### Si tienes un dominio:
1. En Netlify: **Domain management** → **Add domain**
2. Sigue las instrucciones para configurar DNS
3. Netlify te dará certificado SSL automático (HTTPS)

### Si no tienes dominio:
Usa la URL de Netlify: `https://TU-SITIO.netlify.app`

---

## Actualizaciones Futuras

Cuando hagas cambios al código:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

**Netlify detectará automáticamente los cambios y desplegará la nueva versión en 2-3 minutos.**

---

## Troubleshooting

### ❌ "Build failed"
- Revisa que las variables de entorno estén configuradas
- Verifica que el build funcione localmente: `npm run build`

### ❌ "Cannot connect to Supabase"
- Verifica que las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén correctas
- Asegúrate de redesplegar después de añadir las variables

### ❌ "Login no funciona"
- Revisa en Supabase: **Authentication** → **URL Configuration**
- Añade tu dominio de Netlify a **Site URL** y **Redirect URLs**

---

## URLs Importantes

- **Netlify Dashboard:** https://app.netlify.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repo:** https://github.com/TU-USUARIO/humanbiblio-app

---

## Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Sitio creado en Netlify
- [ ] Variables de entorno configuradas
- [ ] Sitio desplegado y funcionando
- [ ] Login y registro funcionan
- [ ] URL compartida con usuarios del piloto

---

**Tiempo total estimado: 15-20 minutos**

¡Tu aplicación está lista para el piloto! 🚀
