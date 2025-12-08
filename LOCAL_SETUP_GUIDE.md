# HUMANBIBLIO - Guía de Configuración Local

Esta guía te ayudará a configurar y ejecutar HUMANBIBLIO en tu computadora local para desarrollo y testing.

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn instalado
- Git instalado
- Cuenta de Supabase (ya configurada)

---

## Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/humanbiblio-mvp.git
cd humanbiblio-mvp
```

---

## Paso 2: Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias del proyecto (~150MB).

---

## Paso 3: Configurar Variables de Entorno

### 3.1 Copiar el archivo de ejemplo

```bash
cp .env.example .env
```

### 3.2 Editar el archivo .env

Abre el archivo `.env` con tu editor preferido y actualiza las credenciales:

```bash
nano .env
# o
code .env
# o
vim .env
```

### 3.3 Pegar tus credenciales de Supabase

```env
VITE_SUPABASE_URL=https://dcuwakwpkmlrfvaxiiak.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdXdha3dwa21scmZ2YXhpaWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjM1MzksImV4cCI6MjA4MDEzOTUzOX0.fcQv0963mbCA6IT6Hwkpn1PgGYYSB3zZEjGCfC3dXXg
```

**IMPORTANTE:** El archivo `.env` NO se subirá a GitHub (protegido por `.gitignore`)

---

## Paso 4: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Verás algo como:

```
  VITE v5.4.21  ready in 423 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## Paso 5: Abrir en el Navegador

Abre tu navegador y ve a:

```
http://localhost:5173
```

---

## Testing Manual - Checklist

### ✅ Pruebas Básicas

1. **Landing Page**
   - [ ] La página carga correctamente
   - [ ] El logo de HUMANBIBLIO aparece
   - [ ] Los 3 ecosistemas se muestran (Agora, Boulevard, Universe)

2. **Registro de Usuario**
   - [ ] Click en "Comenzar" o "Sign Up"
   - [ ] Registrar con email y contraseña
   - [ ] Verificar que aparece en Supabase > Authentication > Users

3. **Coming Soon Features**
   - [ ] Click en "Próximamente" en Calls, Translation, CRM, YANA
   - [ ] Verificar modal de Coming Soon
   - [ ] Registrar interés
   - [ ] Verificar que se guarda en Supabase > Table Editor > feature_interest

4. **Términos y Condiciones**
   - [ ] Modal de términos aparece para usuarios nuevos
   - [ ] Aceptar términos
   - [ ] Verificar en Supabase > user_legal_acceptances

### ✅ Pruebas de Base de Datos

**Supabase Dashboard:** https://supabase.com/dashboard/project/dcuwakwpkmlrfvaxiiak

1. **Authentication**
   - Ve a: Authentication > Users
   - Verifica tu usuario recién creado

2. **Feature Interest**
   - Ve a: Table Editor > feature_interest
   - Verifica los clicks en "Coming Soon"

3. **Legal Acceptances**
   - Ve a: Table Editor > user_legal_acceptances
   - Verifica la aceptación de términos

---

## Comandos Útiles

### Desarrollo
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Preview del build
npm run lint         # Verificar código
```

### Limpiar Cache
```bash
npm run clean        # Limpiar dist y cache
rm -rf node_modules  # Limpiar node_modules
npm install          # Reinstalar dependencias
```

---

## Solución de Problemas Comunes

### Problema: "Error connecting to Supabase"

**Solución:**
1. Verifica que el archivo `.env` existe
2. Verifica que las credenciales son correctas
3. Reinicia el servidor: Ctrl+C y luego `npm run dev`

### Problema: "Port 5173 already in use"

**Solución:**
```bash
# En Mac/Linux:
lsof -ti:5173 | xargs kill -9

# En Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Problema: Cambios no se reflejan

**Solución:**
1. Presiona `r + enter` en la terminal para reiniciar Vite
2. O refresca el navegador con Ctrl+Shift+R (hard refresh)
3. O limpia cache: `npm run clean` y `npm run dev`

---

## Estructura del Proyecto

```
humanbiblio-mvp/
├── src/
│   ├── components/        # Componentes React
│   ├── contexts/          # Context providers (Auth, Language)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Supabase client
│   ├── utils/             # Utilidades
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Entry point
├── supabase/
│   └── migrations/        # Migraciones de base de datos
├── public/                # Assets estáticos
├── .env                   # Variables de entorno (NO SUBIR A GIT)
├── .env.example           # Plantilla de variables
├── package.json           # Dependencias
└── README.md              # Documentación
```

---

## Próximos Pasos

Una vez que el testing local funcione:

1. **Deploy a Netlify** (opcional):
   - Ve a: https://app.netlify.com
   - New site from Git
   - Conecta tu repo de GitHub
   - Configura las variables de entorno
   - Deploy automático

2. **Desarrollo Continuo**:
   - Implementar nuevas features
   - Mejorar UI/UX
   - Agregar tests automatizados

---

## Soporte

Si encuentras problemas:

1. Verifica que Node.js sea v18+: `node --version`
2. Limpia y reinstala: `rm -rf node_modules && npm install`
3. Verifica Supabase Dashboard para errores
4. Revisa la consola del navegador (F12)

---

## Seguridad

**NUNCA** subas a GitHub:
- Archivo `.env` (contiene credenciales)
- `node_modules/` (muy pesado)
- `dist/` (archivos compilados)

Todo esto ya está protegido en `.gitignore`

---

**¡Listo para desarrollo local!** 🚀

Fecha: Diciembre 2024
Versión: 1.0.0 (Piloto)
