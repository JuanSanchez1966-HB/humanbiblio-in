# 🏛️ HUMANBIBLIO

**La Inteligencia Natural** - Red social de propósito que conecta personas por objetivos compartidos.

## 🚀 Deploy Rápido

### Prerequisitos
- Node.js 18+
- Cuenta en Netlify
- Cuenta en Supabase (base de datos ya configurada)

### Instalación Local

```bash
npm install
npm run dev
```

### Build para Producción

```bash
npm run build
```

### Deploy en Netlify

#### Opción 1: Desde GitHub (RECOMENDADO)

1. Sube este proyecto a GitHub
2. Ve a [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Conecta tu repositorio de GitHub
5. Configuración automática:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Agrega variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy

#### Opción 2: Deploy Manual

```bash
npm run build
# Arrastra la carpeta 'dist/' a Netlify
```

## 📋 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## 🏗️ Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (Base de datos + Auth)
- Lucide React (Iconos)

## 📱 Características

- ✅ Autenticación con Supabase
- ✅ Perfiles de usuario
- ✅ Búsqueda avanzada
- ✅ Geolocalización
- ✅ Chat en tiempo real
- ✅ World Boulevard (negocios)
- ✅ Proyectos colaborativos
- ✅ PWA compatible

## 📄 Licencia

Todos los derechos reservados © 2024 HUMANBIBLIO
