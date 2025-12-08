# 🚀 CÓMO SUBIR HUMANBIBLIO A GITHUB - GUÍA DEFINITIVA

## 📊 DIAGNÓSTICO DEL PROBLEMA

**Situación:**
- Estás en Bolt.new (ambiente cloud WebContainer)
- Tienes todo el código completo (92 archivos TypeScript + 6 migraciones SQL)
- Los archivos `.tar.gz` son "dummy files" y no se pueden descargar
- Las URLs temporales expiran

**Solución: Usar la API de GitHub directamente**

---

## ✅ SOLUCIÓN RECOMENDADA: GitHub CLI desde tu computadora

### Opción 1: Inicializar repositorio local y subir todo

Si tienes acceso a una terminal en tu computadora:

```bash
# 1. Crear directorio nuevo
mkdir humanbiblio-mvp
cd humanbiblio-mvp

# 2. Inicializar Git
git init
git branch -M main

# 3. Conectar con tu repositorio
git remote add origin https://github.com/Kikisek/humanbiblio-mvp.git

# 4. COPIAR TODOS LOS ARCHIVOS desde Bolt a esta carpeta
# (Ver sección "Cómo copiar archivos" más abajo)

# 5. Una vez que tengas los archivos:
git add .
git commit -m "feat: proyecto completo HumanBiblio MVP con Supabase"
git push -u origin main
```

---

## 📋 CÓMO COPIAR LOS ARCHIVOS DESDE BOLT

### Método A: Copiar manualmente (recomendado para archivos críticos)

**Archivos que DEBES copiar primero:**

1. **Configuración base:**
   - `package.json`
   - `tsconfig.json`
   - `tsconfig.app.json`
   - `tsconfig.node.json`
   - `vite.config.ts`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `.gitignore`
   - `.env.example`
   - `index.html`
   - `README.md`

2. **Código fuente (src/):**
   - `src/main.tsx`
   - `src/App.tsx`
   - `src/index.css`
   - `src/vite-env.d.ts`
   - `src/types.ts`

3. **Carpetas completas:**
   - `src/components/` (70+ archivos)
   - `src/contexts/` (2 archivos)
   - `src/hooks/` (10+ archivos)
   - `src/lib/` (1 archivo: supabase.ts)
   - `src/utils/` (2 archivos)
   - `supabase/migrations/` (6 archivos SQL)

### Método B: Usar script generador

Ejecuta `GENERAR_PROYECTO_COMPLETO.sh` que crea la estructura base, luego:
1. Copia manualmente los archivos de `src/components/`
2. Copia las migraciones SQL
3. Copia `src/lib/supabase.ts`

---

## 🔧 PASOS DETALLADOS

### Paso 1: Preparar tu computadora

```bash
# Verificar que tienes Git
git --version

# Verificar que tienes Node.js
node --version
npm --version
```

### Paso 2: Crear proyecto local

```bash
cd ~/Escritorio  # o la carpeta que prefieras
mkdir humanbiblio-mvp
cd humanbiblio-mvp
```

### Paso 3: Ejecutar script generador (opcional)

Si quieres usar el script generador:

```bash
# Descarga GENERAR_PROYECTO_COMPLETO.sh desde Bolt
# Luego ejecuta:
bash GENERAR_PROYECTO_COMPLETO.sh
```

Esto creará:
- Estructura de carpetas
- package.json y configuración base
- Archivos esenciales

### Paso 4: Copiar código desde Bolt

**Para cada archivo en Bolt:**
1. Abre el archivo en Bolt
2. Copia todo el contenido (Ctrl+A, Ctrl+C)
3. Créalo en tu carpeta local
4. Pega el contenido

**Ejemplo para src/App.tsx:**
```bash
# En tu terminal local:
nano src/App.tsx  # o usa tu editor favorito
# Pega el contenido
# Guarda (Ctrl+O, Enter, Ctrl+X en nano)
```

### Paso 5: Instalar dependencias

```bash
npm install
```

### Paso 6: Verificar que funciona

```bash
npm run build
```

Si compila sin errores, ¡estás listo!

### Paso 7: Subir a GitHub

```bash
git init
git add .
git commit -m "feat: proyecto completo HumanBiblio MVP"
git branch -M main
git remote add origin https://github.com/Kikisek/humanbiblio-mvp.git
git push -u origin main
```

---

## 🆘 ALTERNATIVA RÁPIDA: Solo archivos críticos

Si solo quieres subir lo esencial primero:

**Lista mínima (15 archivos):**
1. `package.json`
2. `vite.config.ts`
3. `tsconfig.json`
4. `index.html`
5. `src/main.tsx`
6. `src/App.tsx`
7. `src/index.css`
8. `src/lib/supabase.ts`
9. `src/contexts/AuthContext.tsx`
10. `src/contexts/LanguageContext.tsx`
11. `.gitignore`
12. `.env.example`
13. `README.md`
14. `tailwind.config.js`
15. `postcss.config.js`

**Luego puedes ir agregando componentes poco a poco.**

---

## 📞 NECESITAS AYUDA ADICIONAL

Si nada de esto funciona, dime:

1. ¿Qué sistema operativo usas? (Windows/Mac/Linux)
2. ¿Tienes Git instalado?
3. ¿Puedes ejecutar comandos en terminal?
4. ¿Prefieres usar GitHub Desktop (interfaz gráfica)?

---

## ✅ CHECKLIST FINAL

- [ ] Git instalado y funcionando
- [ ] Repositorio creado en GitHub
- [ ] Carpeta local creada
- [ ] Archivos copiados desde Bolt
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run build` funciona correctamente
- [ ] Git inicializado y remoto configurado
- [ ] Código subido a GitHub (`git push`)

---

**¿Listo para empezar? Dime qué método prefieres y te guío paso a paso.**
