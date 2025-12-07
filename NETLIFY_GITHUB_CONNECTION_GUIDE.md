# Guía: Conectar GitHub con Netlify

## Paso 1: Acceder a Netlify

1. Ve a https://app.netlify.com
2. Inicia sesión con tu cuenta

## Paso 2: Crear Nuevo Sitio desde GitHub

### Opción A: Si NO tienes ningún sitio creado

1. Haz clic en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Si es la primera vez, te pedirá autorizar Netlify en GitHub:
   - Haz clic en **"Authorize Netlify"**
   - GitHub te pedirá permisos - acepta
4. Busca y selecciona el repositorio: **`JuanSanchez1966-HB/humanbiblio-in`**

### Opción B: Si YA tienes un sitio existente

1. Ve a tu sitio existente en Netlify
2. Ve a **Site settings** → **Build & deploy** → **Link repository**
3. O elimina el sitio actual y crea uno nuevo siguiendo la Opción A

## Paso 3: Configurar Build Settings

Cuando selecciones el repositorio, configura:

```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

## Paso 4: Agregar Variables de Entorno

IMPORTANTE: Antes de hacer deploy, agrega las variables:

1. En Netlify, ve a: **Site settings** → **Environment variables**
2. Agrega estas variables (cópialas de tu archivo .env):

```
VITE_SUPABASE_URL=tu_url_aqui
VITE_SUPABASE_ANON_KEY=tu_key_aqui
```

## Paso 5: Deploy

1. Haz clic en **"Deploy site"**
2. Netlify automáticamente:
   - Clonará tu repositorio
   - Instalará dependencias
   - Ejecutará el build
   - Publicará el sitio

## Verificar Conexión

### ✅ Señales de que está conectado correctamente:

1. En Netlify ves: **"Connected to GitHub"** con el nombre del repo
2. Cada vez que hagas push a GitHub, Netlify hace deploy automático
3. En la pestaña **"Deploys"** ves los commits de GitHub

### Verificar en GitHub:

1. Ve a: https://github.com/JuanSanchez1966-HB/humanbiblio-in/settings/installations
2. Deberías ver **"Netlify"** en la lista de aplicaciones instaladas

## Troubleshooting

### Si no ves tu repositorio:

1. En la pantalla de selección de repo, haz clic en **"Configure the Netlify app on GitHub"**
2. Esto te llevará a GitHub
3. En **"Repository access"**, selecciona:
   - "All repositories" O
   - "Only select repositories" y agrega `humanbiblio-in`
4. Guarda y regresa a Netlify

### Si el build falla:

1. Verifica que las variables de entorno estén configuradas
2. Revisa los logs en la pestaña **"Deploys"** → Click en el deploy fallido
3. Los errores más comunes:
   - Variables de entorno faltantes
   - Build command incorrecto
   - Publish directory incorrecto

## URLs Importantes

- **Tu Repositorio:** https://github.com/JuanSanchez1966-HB/humanbiblio-in
- **Netlify Dashboard:** https://app.netlify.com
- **Netlify GitHub App:** https://github.com/apps/netlify
- **Gestionar permisos:** https://github.com/JuanSanchez1966-HB/humanbiblio-in/settings/installations

## Próximos Pasos Después de Conectar

1. Netlify te dará una URL temporal como: `https://random-name-12345.netlify.app`
2. Puedes cambiar el nombre del sitio en: **Site settings** → **Site details** → **Change site name**
3. Sugerencia: `humanbiblio-mvp` o `humanbiblio-demo`
4. Tu URL final será: `https://humanbiblio-mvp.netlify.app`

## Deploy Automático

Una vez conectado, cada vez que hagas:

```bash
git add .
git commit -m "mensaje"
git push origin main
```

Netlify automáticamente:
1. Detecta el cambio
2. Ejecuta el build
3. Publica la nueva versión
4. Te notifica por email

---

**¿Necesitas hacer cambios ahora?**

Si quieres hacer cambios al código antes de conectar con Netlify, avísame y los hacemos antes de configurar el deploy automático.
