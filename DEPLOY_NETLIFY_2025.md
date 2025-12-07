# Guía de Deployment en Netlify - HumanBiblio 2025

## Estado del Proyecto
✅ Build exitoso (compilado correctamente)
✅ Configuración de Netlify lista (netlify.toml)
✅ Optimizaciones de caché configuradas
✅ Redirects para SPA configurados

## Opción 1: Deploy Manual (Más Rápido)

### Paso 1: Preparar el archivo
El proyecto ya está compilado en la carpeta `dist/`

### Paso 2: Deploy en Netlify
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `dist/` a la ventana del navegador
3. Netlify subirá automáticamente tu sitio

### Paso 3: Configurar Variables de Entorno
1. Una vez desplegado, ve a **Site Settings** > **Environment Variables**
2. Agrega estas variables:
   ```
   VITE_SUPABASE_URL = tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY = tu_anon_key_de_supabase
   ```
3. Haz clic en **Deploys** > **Trigger Deploy** > **Deploy site**

---

## Opción 2: Deploy con GitHub (Recomendado para Producción)

### Paso 1: Subir a GitHub
```bash
# Si aún no lo has hecho:
git init
git add .
git commit -m "Proyecto HumanBiblio listo para producción"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
```

### Paso 2: Conectar con Netlify
1. Ve a https://app.netlify.com
2. Haz clic en **Add new site** > **Import an existing project**
3. Selecciona **GitHub** y autoriza la conexión
4. Selecciona tu repositorio

### Paso 3: Configurar el Build
Netlify detectará automáticamente la configuración desde `netlify.toml`, pero verifica:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### Paso 4: Agregar Variables de Entorno
Antes de hacer deploy, en la configuración:
1. Expande **Advanced settings**
2. Agrega las variables:
   ```
   VITE_SUPABASE_URL = tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY = tu_anon_key_de_supabase
   ```

### Paso 5: Deploy
Haz clic en **Deploy site**

---

## Variables de Entorno Necesarias

Obtén tus credenciales de Supabase:
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## Después del Deploy

### Verificar el Sitio
1. Tu sitio estará en: `https://nombre-aleatorio.netlify.app`
2. Puedes cambiar el nombre en **Site Settings** > **Domain Management**

### Dominio Personalizado (Opcional)
1. Ve a **Domain Management** > **Add domain**
2. Sigue las instrucciones para conectar tu dominio

### Configurar HTTPS
Netlify activa HTTPS automáticamente con certificado SSL gratuito.

---

## Actualizaciones Futuras

### Con GitHub (Automático):
Cada vez que hagas `git push`, Netlify desplegará automáticamente.

### Manual:
1. Ejecuta `npm run build`
2. Arrastra la carpeta `dist/` actualizada a Netlify

---

## Resolución de Problemas

### Build Falla
- Verifica que las variables de entorno estén configuradas
- Revisa los logs en la sección **Deploys**

### Página en Blanco
- Verifica que las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén correctas
- Abre la consola del navegador (F12) para ver errores

### 404 en Rutas
El archivo `netlify.toml` ya tiene la configuración de redirects, pero si ves 404:
- Verifica que el archivo esté en la raíz del proyecto
- Redeploy el sitio

---

## Recursos

- Panel de Netlify: https://app.netlify.com
- Documentación de Netlify: https://docs.netlify.com
- Soporte de Supabase: https://supabase.com/docs

---

## Estado Actual del Build

```
✓ built in 7.52s
dist/index.html                             1.25 kB │ gzip:  0.53 kB
dist/assets/css/index-wz7oDIwC.css         68.84 kB │ gzip: 10.54 kB
dist/assets/js/vendor-BO_Po5LP.js          15.45 kB │ gzip:  5.72 kB
dist/assets/js/dashboard-CuEanxJO.js       19.63 kB │ gzip:  5.73 kB
dist/assets/js/index-0l6yjxEg.js           20.96 kB │ gzip:  6.10 kB
dist/assets/js/communication-DJsTrmjv.js   21.39 kB │ gzip:  6.30 kB
dist/assets/js/auth-CVzfcMOa.js           131.24 kB │ gzip: 32.43 kB
dist/assets/js/react-vendor-CSWzuVp8.js   152.04 kB │ gzip: 47.50 kB
dist/assets/js/supabase-DIMEooPQ.js       161.72 kB │ gzip: 40.97 kB
dist/assets/js/components-DN7XFpaZ.js     250.59 kB │ gzip: 54.94 kB
```

Todo optimizado y listo para producción!
