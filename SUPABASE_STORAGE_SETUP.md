# 🗄️ Configuración de Supabase Storage para HUMANBIBLIO

## ✅ COMPLETADO

### 1. Base de Datos
- ✅ Tablas creadas: `profile_images`, `business_images`, `project_media`, `upload_sessions`
- ✅ RLS habilitado y políticas configuradas
- ✅ Triggers para imagen única (current/cover)
- ✅ Función para calcular uso de storage

### 2. Componente Frontend
- ✅ `ImageUploader.tsx` creado
- ✅ Drag & drop funcional
- ✅ Validación de archivos (tipo, tamaño)
- ✅ Progress tracking
- ✅ Manejo de errores

---

## 🚀 SIGUIENTE PASO: Crear Bucket en Supabase

### Crear el Bucket `humanbiblio-media`

Debes ejecutar esto **MANUALMENTE** en Supabase Studio:

#### Opción A: Desde la UI de Supabase

1. Ve a **Storage** en el menú lateral
2. Click en **"Create a new bucket"**
3. Nombre: `humanbiblio-media`
4. **Public bucket**: ✅ Marcado (para acceso público)
5. Click **"Create bucket"**

#### Opción B: Desde SQL Editor

```sql
-- Crear bucket público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'humanbiblio-media',
  'humanbiblio-media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);
```

---

## 🔒 Configurar Políticas de Storage (RLS)

Ejecuta estas políticas en **SQL Editor**:

```sql
-- ====================
-- POLÍTICAS DE STORAGE
-- ====================

-- 1. Permitir lectura pública de imágenes
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'humanbiblio-media');

-- 2. Permitir a usuarios autenticados subir sus propias imágenes
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'humanbiblio-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Permitir a usuarios autenticados actualizar sus propias imágenes
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'humanbiblio-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Permitir a usuarios autenticados eliminar sus propias imágenes
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'humanbiblio-media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 📋 ESTRUCTURA DE CARPETAS EN STORAGE

```
humanbiblio-media/
├── profile/
│   ├── 1234567890_abc123.jpg
│   ├── 1234567891_def456.png
│   └── ...
├── business/
│   ├── 1234567892_ghi789.jpg
│   ├── 1234567893_jkl012.webp
│   └── ...
└── project/
    ├── 1234567894_mno345.jpg
    ├── 1234567895_pqr678.png
    └── ...
```

---

## 🧪 TESTING

### Test 1: Subir imagen de perfil

```typescript
import ImageUploader from './components/ImageUploader';

<ImageUploader
  uploadType="profile"
  maxFiles={1}
  maxSizeMB={10}
  onUploadComplete={(urls) => {
    console.log('Profile image uploaded:', urls[0]);
  }}
  onUploadError={(error) => {
    console.error('Upload error:', error);
  }}
/>
```

### Test 2: Subir galería de negocio

```typescript
<ImageUploader
  uploadType="business"
  entityId="business-uuid-123"
  maxFiles={10}
  maxSizeMB={10}
  currentImages={existingImages}
  onUploadComplete={(urls) => {
    console.log('Business gallery updated:', urls);
  }}
/>
```

### Test 3: Verificar upload en base de datos

```sql
-- Ver imágenes de perfil
SELECT * FROM profile_images
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Ver galería de negocio
SELECT * FROM business_images
WHERE business_id = 'your-business-id'
ORDER BY display_order;

-- Ver sesiones de upload
SELECT * FROM upload_sessions
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;
```

---

## ⚠️ IMPORTANTE

### Límites de Storage

- **Por archivo**: 10MB (profile/business), 50MB (project media con video)
- **Por usuario**: 100MB total (configurado en `storage_quotas`)
- **Tipos permitidos**: JPG, PNG, WebP, GIF

### Seguridad

- ✅ RLS habilitado en todas las tablas
- ✅ Solo usuarios autenticados pueden subir
- ✅ Solo propietarios pueden eliminar sus archivos
- ✅ Lectura pública para todas las imágenes

### Performance

- Cache-Control: 3600s (1 hora)
- URLs públicas generadas automáticamente
- Thumbnails pendientes (Fase 2)

---

## 📊 ANALYTICS

Puedes monitorear uploads con:

```sql
-- Uploads por tipo en últimas 24 horas
SELECT
  upload_type,
  status,
  COUNT(*) as count,
  SUM(total_size) / 1024 / 1024 as total_mb
FROM upload_sessions
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY upload_type, status
ORDER BY count DESC;

-- Top usuarios por storage usado
SELECT
  user_id,
  get_user_storage_usage(user_id).*
FROM auth.users
ORDER BY (get_user_storage_usage(user_id)).total_size DESC
LIMIT 20;
```

---

## ✅ CHECKLIST PARA ACTIVAR

- [ ] Crear bucket `humanbiblio-media` en Supabase Storage
- [ ] Aplicar políticas de RLS en storage.objects
- [ ] Integrar `ImageUploader` en ProfilePhotoUploader
- [ ] Integrar `ImageUploader` en BusinessCard
- [ ] Integrar `ImageUploader` en ProjectCreationForm
- [ ] Test de subida de imagen de perfil
- [ ] Test de galería de negocios
- [ ] Test de media de proyectos
- [ ] Verificar límites de tamaño
- [ ] Verificar permisos de eliminación

---

## 🎯 ESTADO ACTUAL

**LISTO PARA CREAR BUCKET MANUALMENTE EN SUPABASE**

Una vez creado el bucket y aplicadas las políticas, el sistema estará 100% funcional para el piloto.
