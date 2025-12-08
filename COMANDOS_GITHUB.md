# 🚀 HUMANBIBLIO - Comandos para Actualizar GitHub

## **📋 ANTES DE EMPEZAR:**

**Necesitas tener:**
- Git instalado en tu computadora
- Cuenta de GitHub
- Repositorio `humanbiblio-mvp` creado en GitHub

---

## **OPCIÓN 1: Script Automático** ⭐ (RECOMENDADO)

El método más fácil y rápido:

### **Paso 1: Descargar el Proyecto**

Descarga el archivo `humanbiblio-github-update.tar.gz` de este proyecto.

### **Paso 2: Descomprimir**

```bash
# En tu terminal, ve a donde descargaste el archivo
cd ~/Downloads  # o donde esté el archivo

# Descomprimir
tar -xzf humanbiblio-github-update.tar.gz

# Entrar al directorio
cd humanbiblio-mvp  # o el nombre que tenga la carpeta
```

### **Paso 3: Ejecutar el Script**

```bash
# Hacer el script ejecutable
chmod +x ACTUALIZAR_GITHUB.sh

# Ejecutar
./ACTUALIZAR_GITHUB.sh
```

El script hará TODO automáticamente:
- ✅ Verificar Git
- ✅ Proteger .env
- ✅ Agregar archivos
- ✅ Crear commit
- ✅ Subir a GitHub

---

## **OPCIÓN 2: Comandos Manuales Paso a Paso**

Si prefieres control total:

### **Paso 1: Ir al directorio del proyecto**

```bash
cd /ruta/a/humanbiblio-mvp
```

### **Paso 2: Verificar que .env NO se subirá**

```bash
# Verificar que .env está en .gitignore
grep "^\.env$" .gitignore

# Debe mostrar: .env
# Si no lo muestra, agrégalo:
echo ".env" >> .gitignore
```

### **Paso 3: Inicializar Git (si no existe)**

```bash
# Ver si ya tienes Git inicializado
git status

# Si dice "not a git repository", inicializa:
git init
```

### **Paso 4: Configurar remoto de GitHub**

```bash
# Verificar si ya tienes remoto
git remote -v

# Si NO muestra nada, agregar tu repo:
git remote add origin https://github.com/TU-USUARIO/humanbiblio-mvp.git

# Reemplaza TU-USUARIO con tu usuario real de GitHub
```

### **Paso 5: Agregar todos los archivos**

```bash
# Ver qué archivos se agregarán
git status

# Agregar todos
git add .

# Verificar que .env NO está agregado
git status | grep ".env"
# No debe aparecer ".env" en la lista (solo .env.example)
```

### **Paso 6: Crear commit**

```bash
git commit -m "feat: actualización completa con nueva base de datos Supabase

- Nueva base de datos Supabase configurada
- Sistema de Coming Soon features
- Sistema de reviews y ratings
- Términos y condiciones legales
- 32 tablas con RLS habilitado
- Documentación completa"
```

### **Paso 7: Subir a GitHub**

```bash
# Asegurar que estás en la rama main
git branch -M main

# Push a GitHub
git push -u origin main
```

**Si pide autenticación:**
- Usuario: tu usuario de GitHub
- Contraseña: usar un **Personal Access Token** (no tu contraseña)
  - Crear token en: https://github.com/settings/tokens

---

## **OPCIÓN 3: Si Ya Tienes el Repo Clonado**

Si ya tienes `humanbiblio-mvp` clonado en tu computadora:

```bash
# 1. Ir a tu repo existente
cd ~/ruta/a/humanbiblio-mvp

# 2. Hacer backup de tu .env actual
cp .env .env.backup

# 3. Copiar todos los archivos nuevos al repo
#    (desde donde descargaste el proyecto actualizado)
#    Excepto: .git, node_modules, dist, .env

# 4. Verificar cambios
git status

# 5. Agregar y commitear
git add .
git commit -m "feat: actualización con nueva base de datos Supabase"

# 6. Push
git push origin main

# 7. Restaurar tu .env si era diferente
cp .env.backup .env
```

---

## **🔒 VERIFICACIÓN DE SEGURIDAD**

### **Antes de hacer push, SIEMPRE verifica:**

```bash
# 1. Verificar que .env NO se subirá
git status | grep "\.env$"
# NO debe aparecer ".env" (solo .env.example está OK)

# 2. Verificar archivos que se subirán
git diff --cached --name-only

# 3. Buscar credenciales hardcodeadas
grep -r "dcuwakwpkmlrfvaxiiak" src/
# NO debe encontrar nada (credenciales solo en .env)
```

---

## **📊 DESPUÉS DEL PUSH**

### **1. Verificar en GitHub:**

```bash
# Abrir tu repo en el navegador
https://github.com/TU-USUARIO/humanbiblio-mvp
```

**Verificar:**
- ✅ `.env.example` aparece
- ❌ `.env` NO aparece
- ✅ `README.md` se ve bien
- ✅ `LOCAL_SETUP_GUIDE.md` está ahí
- ✅ Carpeta `src/` completa
- ✅ Carpeta `supabase/migrations/` completa

### **2. Clonar en otra computadora (para testing):**

```bash
# En otra ubicación o computadora
git clone https://github.com/TU-USUARIO/humanbiblio-mvp.git
cd humanbiblio-mvp

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
nano .env  # o code .env

# Pegar credenciales:
VITE_SUPABASE_URL=https://dcuwakwpkmlrfvaxiiak.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdXdha3dwa21scmZ2YXhpaWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjM1MzksImV4cCI6MjA4MDEzOTUzOX0.fcQv0963mbCA6IT6Hwkpn1PgGYYSB3zZEjGCfC3dXXg

# Iniciar servidor
npm run dev

# Abrir navegador
http://localhost:5173
```

---

## **❌ PROBLEMAS COMUNES**

### **Error: "remote: Repository not found"**

**Solución:**
```bash
# Verificar URL del remoto
git remote -v

# Si está mal, eliminar y agregar correctamente
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/humanbiblio-mvp.git
```

### **Error: "failed to push some refs"**

**Solución:**
```bash
# Pull primero (si hay cambios remotos)
git pull origin main --rebase

# Luego push
git push origin main
```

### **Error: "Authentication failed"**

**Solución:**
1. Ir a: https://github.com/settings/tokens
2. Generate new token (classic)
3. Seleccionar scopes: `repo`
4. Copiar el token
5. Usar el token como contraseña cuando Git lo pida

### **Error: ".env appears in the repository"**

**Solución:**
```bash
# Remover .env del index de Git
git rm --cached .env

# Asegurar que está en .gitignore
echo ".env" >> .gitignore

# Commit
git add .gitignore
git commit -m "fix: remove .env from repository"

# Push
git push origin main
```

---

## **🎯 RESUMEN RÁPIDO**

Para actualizar GitHub rápidamente:

```bash
# 1. Descomprimir proyecto
tar -xzf humanbiblio-github-update.tar.gz
cd humanbiblio-mvp

# 2. Ejecutar script
chmod +x ACTUALIZAR_GITHUB.sh
./ACTUALIZAR_GITHUB.sh

# 3. ¡Listo!
```

O manualmente:

```bash
cd humanbiblio-mvp
git init
git remote add origin https://github.com/TU-USUARIO/humanbiblio-mvp.git
git add .
git commit -m "feat: actualización completa"
git branch -M main
git push -u origin main
```

---

## **📚 ARCHIVOS IMPORTANTES**

- `ACTUALIZAR_GITHUB.sh` - Script automático
- `LOCAL_SETUP_GUIDE.md` - Guía de instalación local
- `GITHUB_UPDATE_READY.md` - Checklist completo
- `.env.example` - Plantilla de variables
- `.gitignore` - Protección de archivos

---

**¡Listo para actualizar GitHub!** 🚀

Fecha: Diciembre 1, 2024
Proyecto: HUMANBIBLIO MVP
Base de Datos: dcuwakwpkmlrfvaxiiak.supabase.co
