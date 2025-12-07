# ✅ Checklist: Conectar GitHub → Netlify

## Verificación Rápida (2 minutos)

### 1️⃣ Verifica que GitHub tiene tu código
- [ ] Ve a: https://github.com/JuanSanchez1966-HB/humanbiblio-in
- [ ] Debes ver todos los archivos del proyecto
- [ ] Última actualización debe ser de hoy

### 2️⃣ Conecta Netlify
- [ ] Abre: https://app.netlify.com
- [ ] Clic en **"Add new site"** → **"Import an existing project"**
- [ ] Selecciona **"Deploy with GitHub"**
- [ ] Autoriza Netlify si te lo pide
- [ ] Busca y selecciona: `JuanSanchez1966-HB/humanbiblio-in`

### 3️⃣ Configura Build
- [ ] Branch: `main`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`

### 4️⃣ Variables de Entorno (CRÍTICO)
- [ ] Ve a **Site settings** → **Environment variables**
- [ ] Agrega: `VITE_SUPABASE_URL`
- [ ] Agrega: `VITE_SUPABASE_ANON_KEY`

### 5️⃣ Deploy
- [ ] Clic en **"Deploy site"**
- [ ] Espera 2-3 minutos
- [ ] Verifica que el deploy sea exitoso (✅ verde)

### 6️⃣ Prueba el Sitio
- [ ] Copia la URL que te da Netlify
- [ ] Abre en navegador
- [ ] Verifica que cargue correctamente

## ¿Cómo saber si está conectado?

✅ **Conectado correctamente si:**
- Ves "Connected to GitHub" en Netlify
- Cada push a GitHub dispara un nuevo deploy
- En la pestaña "Deploys" ves los commits

❌ **NO conectado si:**
- No ves el nombre del repositorio
- Los push a GitHub no causan deploy
- Tienes que hacer deploy manual

## ¿Problemas?

### No veo mi repositorio en Netlify
→ Configura permisos aquí: https://github.com/apps/netlify

### Build falla
→ Revisa que las variables de entorno estén configuradas

### Sitio carga pero da errores
→ Verifica variables de entorno de Supabase

---

**Tiempo estimado total:** 5-10 minutos
**Una vez configurado:** Deploy automático en cada push
