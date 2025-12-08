import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  uploadType: 'profile' | 'business' | 'project';
  entityId?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  onUploadComplete: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  currentImages?: string[];
}

interface UploadProgress {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

export default function ImageUploader({
  uploadType,
  entityId,
  maxFiles = 10,
  maxSizeMB = 10,
  onUploadComplete,
  onUploadError,
  currentImages = []
}: ImageUploaderProps) {
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Validar archivo
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de archivo no soportado: ${file.type}. Usa JPG, PNG o WebP.`;
    }
    if (file.size > maxSizeBytes) {
      return `Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: ${maxSizeMB}MB.`;
    }
    if (currentImages.length + uploadQueue.length >= maxFiles) {
      return `Máximo ${maxFiles} imágenes permitidas.`;
    }
    return null;
  };

  // Subir archivo a Supabase Storage
  const uploadFile = async (file: File, index: number): Promise<string> => {
    try {
      // Crear sesión de upload
      const { data: sessionData } = await supabase
        .from('upload_sessions')
        .insert({
          upload_type: uploadType,
          status: 'pending',
          file_count: 1,
          total_size: file.size
        })
        .select()
        .single();

      const sessionId = sessionData?.id;

      // Generar nombre único
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = file.name.split('.').pop();
      const fileName = `${uploadType}/${timestamp}_${randomString}.${extension}`;

      // Subir a Storage
      const { data, error } = await supabase.storage
        .from('humanbiblio-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('humanbiblio-media')
        .getPublicUrl(fileName);

      // Guardar metadata en la tabla correspondiente
      const metadata = {
        storage_path: fileName,
        image_url: publicUrl,
        file_size: file.size,
        mime_type: file.type
      };

      if (uploadType === 'profile') {
        await supabase.from('profile_images').insert({
          ...metadata,
          is_current: currentImages.length === 0
        });
      } else if (uploadType === 'business' && entityId) {
        await supabase.from('business_images').insert({
          ...metadata,
          business_id: entityId,
          display_order: currentImages.length + index,
          is_cover: currentImages.length === 0
        });
      } else if (uploadType === 'project' && entityId) {
        await supabase.from('project_media').insert({
          ...metadata,
          project_id: entityId,
          media_type: 'image',
          display_order: currentImages.length + index
        });
      }

      // Actualizar sesión como exitosa
      if (sessionId) {
        await supabase
          .from('upload_sessions')
          .update({
            status: 'success',
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);
      }

      return publicUrl;

    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw new Error(error.message || 'Error desconocido al subir archivo');
    }
  };

  // Procesar archivos seleccionados
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploads: UploadProgress[] = [];

    // Validar cada archivo
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        if (onUploadError) {
          onUploadError(validationError);
        }
        continue;
      }

      newUploads.push({
        file,
        status: 'pending',
        progress: 0
      });
    }

    if (newUploads.length === 0) return;

    setUploadQueue(prev => [...prev, ...newUploads]);

    // Subir archivos uno por uno
    const uploadedUrls: string[] = [];

    for (let i = 0; i < newUploads.length; i++) {
      const upload = newUploads[i];

      // Actualizar estado a "uploading"
      setUploadQueue(prev => prev.map((u, idx) =>
        u.file === upload.file ? { ...u, status: 'uploading', progress: 0 } : u
      ));

      try {
        // Simular progreso
        const progressInterval = setInterval(() => {
          setUploadQueue(prev => prev.map((u) =>
            u.file === upload.file && u.progress < 90
              ? { ...u, progress: u.progress + 10 }
              : u
          ));
        }, 200);

        const url = await uploadFile(upload.file, i);

        clearInterval(progressInterval);

        // Actualizar estado a "success"
        setUploadQueue(prev => prev.map((u) =>
          u.file === upload.file
            ? { ...u, status: 'success', progress: 100, url }
            : u
        ));

        uploadedUrls.push(url);

      } catch (error: any) {
        // Actualizar estado a "error"
        setUploadQueue(prev => prev.map((u) =>
          u.file === upload.file
            ? { ...u, status: 'error', error: error.message }
            : u
        ));

        if (onUploadError) {
          onUploadError(error.message);
        }
      }
    }

    // Notificar completado
    if (uploadedUrls.length > 0) {
      onUploadComplete(uploadedUrls);
    }

    // Limpiar cola después de 3 segundos
    setTimeout(() => {
      setUploadQueue([]);
    }, 3000);

  }, [uploadType, entityId, currentImages, maxFiles, onUploadComplete, onUploadError]);

  // Handlers de drag & drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // Handler de input file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Remover de la cola
  const removeFromQueue = (file: File) => {
    setUploadQueue(prev => prev.filter(u => u.file !== file));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 transition-all
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              Arrastra imágenes aquí
            </p>
            <p className="text-sm text-gray-500 mt-1">
              o{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                selecciona desde tu dispositivo
              </button>
            </p>
          </div>

          <div className="text-xs text-gray-400 text-center">
            <p>JPG, PNG o WebP • Máximo {maxSizeMB}MB por archivo</p>
            <p>Hasta {maxFiles} imágenes • {currentImages.length} ya subidas</p>
          </div>
        </div>
      </div>

      {/* Upload queue */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Subiendo archivos ({uploadQueue.filter(u => u.status !== 'error').length}/{uploadQueue.length})
          </h4>

          {uploadQueue.map((upload, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {upload.status === 'pending' && (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
                {upload.status === 'uploading' && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                {upload.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {upload.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {upload.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {/* Progress bar */}
                {upload.status === 'uploading' && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}

                {/* Error message */}
                {upload.status === 'error' && upload.error && (
                  <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                )}
              </div>

              {/* Remove button */}
              {(upload.status === 'pending' || upload.status === 'error') && (
                <button
                  type="button"
                  onClick={() => removeFromQueue(upload.file)}
                  className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
