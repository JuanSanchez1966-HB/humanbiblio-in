# Setup Profesional: GitHub + Netlify - HumanBiblio

## Estado Actual
✅ Repositorio Git local inicializado
✅ Primer commit realizado (315 archivos, 110,184 líneas)
✅ Rama principal configurada como 'main'
✅ .gitignore configurado correctamente
✅ Build de producción exitoso

---

## PASO 1: Crear Repositorio en GitHub

### 1.1 Accede a GitHub
Ve a: https://github.com/new

### 1.2 Configura el Repositorio
**Información importante:**
- **Repository name**: `humanbiblio-mvp` (o el nombre que prefieras)
- **Description**: "HumanBiblio MVP - Professional ecosystem connecting people, businesses and projects"
- **Visibility**:
  - ✅ **Private** (recomendado para MVP en desarrollo)
  - ⚠️ Public (solo si quieres código abierto)
- **NO selecciones**:
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license

  (Ya tenemos estos archivos localmente)

### 1.3 Crea el Repositorio
Haz clic en **"Create repository"**

---

## PASO 2: Conectar Local con GitHub

Después de crear el repositorio, GitHub te mostrará una página con instrucciones.

**IMPORTANTE:** Usa estas instrucciones exactas que ya están listas para ti:

```bash
# En tu terminal, ejecuta estos comandos en orden:

# 1. Agregar el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# 2. Verificar que el remoto se agregó correctamente
git remote -v

# 3. Hacer push del código a GitHub
git push -u origin main
```

**Reemplaza**:
- `TU-USUARIO` con tu nombre de usuario de GitHub
- `TU-REPOSITORIO` con el nombre que elegiste (ej: humanbiblio-mvp)

**Ejemplo real:**
```bash
git remote add origin https://github.com/juanperez/humanbiblio-mvp.git
git push -u origin main
```

### Autenticación
Cuando hagas `git push`, GitHub te pedirá autenticación:

**Opción A: Personal Access Token (Recomendado)**
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Dale un nombre: "HumanBiblio Deploy"
4. Selecciona el scope: `repo` (todos los permisos de repositorio)
5. Genera el token y cópialo
6. Cuando git pida tu password, usa el token (no tu contraseña de GitHub)

**Opción B: GitHub CLI**
```bash
gh auth login
```

---

## PASO 3: Verificar en GitHub

Ve a tu repositorio en GitHub:
`https://github.com/TU-USUARIO/TU-REPOSITORIO`

Deberías ver:
- ✅ 315 archivos
- ✅ Rama 'main'
- ✅ Commit "Initial commit: HumanBiblio MVP ready for production"
- ✅ README.md visible

---

## PASO 4: Conectar GitHub con Netlify

### 4.1 Accede a Netlify
Ve a: https://app.netlify.com

Inicia sesión o crea una cuenta (puedes usar tu cuenta de GitHub para facilitar)

### 4.2 Nuevo Sitio
1. Haz clic en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Autoriza a Netlify a acceder a tu GitHub (si es la primera vez)

### 4.3 Selecciona tu Repositorio
1. Busca y selecciona `humanbiblio-mvp` (o el nombre que elegiste)
2. Si no aparece, haz clic en **"Configure the Netlify app on GitHub"** para dar permisos

### 4.4 Configuración del Deploy
Netlify detectará automáticamente desde `netlify.toml`:
- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### 4.5 Variables de Entorno (CRÍTICO)
**ANTES de hacer deploy**, expande **"Advanced build settings"** y agrega:

```
Key: VITE_SUPABASE_URL
Value: [Tu URL de Supabase]

Key: VITE_SUPABASE_ANON_KEY
Value: [Tu Anon Key de Supabase]
```

**¿Dónde obtener estos valores?**
1. Ve a: https://app.supabase.com
2. Selecciona tu proyecto
3. Settings → API
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 4.6 Deploy
Haz clic en **"Deploy humanbiblio-mvp"**

Netlify comenzará a:
1. Clonar tu repositorio
2. Instalar dependencias (npm install)
3. Ejecutar el build (npm run build)
4. Publicar el sitio

**Tiempo estimado**: 2-3 minutos

---

## PASO 5: Verificar el Deploy

### 5.1 Estado del Deploy
En Netlify, ve a la sección **"Deploys"**

Deberías ver:
- ✅ Status: Published
- ✅ Build log sin errores
- ✅ Deploy time: ~2-3 minutos

### 5.2 Acceder al Sitio
Tu sitio estará disponible en:
`https://random-name-123456.netlify.app`

Haz clic en el enlace para verificar que todo funciona.

### 5.3 Cambiar el Nombre del Sitio
1. Ve a **Site settings** → **Domain management** → **Site information**
2. Haz clic en **"Change site name"**
3. Elige un nombre disponible: `humanbiblio-mvp`
4. Tu sitio ahora será: `https://humanbiblio-mvp.netlify.app`

---

## PASO 6: Configuración Post-Deploy

### 6.1 HTTPS
Netlify activa HTTPS automáticamente con Let's Encrypt. Verifica:
- Ve a **Domain management** → **HTTPS**
- Debe decir: "Your site has HTTPS enabled"

### 6.2 Dominio Personalizado (Opcional)
Si tienes un dominio propio:
1. **Domain management** → **Add domain**
2. Sigue las instrucciones para configurar DNS
3. Netlify te dará los nameservers o registros DNS

### 6.3 Configurar Notificaciones
1. **Site settings** → **Build & deploy** → **Deploy notifications**
2. Puedes agregar notificaciones por email o Slack

---

## Workflow de Desarrollo Continuo

Ahora que todo está conectado, el workflow es:

```bash
# 1. Hacer cambios en tu código local

# 2. Hacer commit
git add .
git commit -m "Descripción de cambios"

# 3. Push a GitHub
git push

# 4. Netlify detecta el push y hace deploy automático
# (Sin hacer nada más, en 2-3 minutos estará actualizado)
```

---

## Comandos Útiles

### Ver estado de Git
```bash
git status
```

### Ver remotos configurados
```bash
git remote -v
```

### Ver historial de commits
```bash
git log --oneline
```

### Crear nueva rama para features
```bash
git checkout -b feature/nueva-funcionalidad
```

### Ver el build localmente antes de deploy
```bash
npm run build
npm run preview
```

---

## Monitoreo y Analíticas

### En Netlify
- **Analytics**: Ve a **Analytics** (requiere plan Pro)
- **Logs**: Ve a **Deploys** → Selecciona un deploy → **Deploy log**
- **Functions**: Si usas edge functions, ve a **Functions**

### En Supabase
- **Database**: Monitorea uso en **Database** → **Reports**
- **Auth**: Ve usuarios en **Authentication** → **Users**
- **Storage**: Revisa archivos en **Storage**

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
```

### Error de autenticación en git push
- Asegúrate de usar un Personal Access Token, no tu contraseña
- O usa GitHub CLI: `gh auth login`

### Build falla en Netlify
1. Ve a **Deploys** → Deploy fallido → **Deploy log**
2. Busca el error específico
3. Común: Variables de entorno faltantes

### Página en blanco después del deploy
1. Abre la consola del navegador (F12)
2. Busca errores
3. Común: Variables de entorno incorrectas en Netlify

### 404 en rutas
- Verifica que `netlify.toml` esté en la raíz
- Verifica la sección `[[redirects]]` en el archivo

---

## Recursos

- **GitHub**: https://github.com
- **Netlify**: https://app.netlify.com
- **Supabase**: https://app.supabase.com
- **Docs Netlify**: https://docs.netlify.com
- **Docs Supabase**: https://supabase.com/docs

---

## Checklist Final

Antes de compartir tu MVP, verifica:

- [ ] Sitio accesible públicamente
- [ ] HTTPS activado
- [ ] Todas las funcionalidades principales funcionan
- [ ] Login/registro funciona
- [ ] Base de datos conectada correctamente
- [ ] Imágenes y assets cargan correctamente
- [ ] Responsive en móvil
- [ ] No hay errores en la consola del navegador
- [ ] Variables de entorno configuradas
- [ ] Dominio personalizado configurado (opcional)

---

## Próximos Pasos

Una vez que tu sitio esté en producción:

1. **Testing con usuarios reales** - Invita a usuarios piloto
2. **Monitoreo** - Revisa logs y métricas regularmente
3. **Feedback** - Usa el sistema de feedback integrado
4. **Iteración** - Haz mejoras basadas en feedback
5. **Scaling** - Considera upgrade de planes según crecimiento

---

**Todo listo para llevar HumanBiblio al mundo!**
