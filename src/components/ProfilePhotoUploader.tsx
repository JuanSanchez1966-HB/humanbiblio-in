import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  onPhotoUploadSuccess: (url: string) => void;
  onPhotoRemove?: () => void;
}

export default function ProfilePhotoUploader({
  currentPhotoUrl,
  onPhotoUploadSuccess,
  onPhotoRemove
}: ProfilePhotoUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [currentImages] = useState<string[]>(currentPhotoUrl ? [currentPhotoUrl] : []);

  const handleUploadComplete = (urls: string[]) => {
    if (urls.length > 0) {
      onPhotoUploadSuccess(urls[0]);
      setError(null);
    }
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Current Photo Display */}
      {currentPhotoUrl && (
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-xl">
            <img
              src={currentPhotoUrl}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold hidden">
              📷
            </div>
          </div>

          {/* Remove button */}
          {onPhotoRemove && (
            <button
              onClick={onPhotoRemove}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="w-full max-w-md p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Image Uploader */}
      <div className="w-full max-w-md">
        <ImageUploader
          uploadType="profile"
          maxFiles={1}
          maxSizeMB={10}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          currentImages={currentImages}
        />
      </div>

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Consejos para tu foto:
        </h4>
        <div className="space-y-1 text-sm text-blue-800">
          <p>• Usa una foto clara y profesional</p>
          <p>• Sonríe - genera más conexiones</p>
          <p>• Fondo neutro o profesional</p>
          <p>• Evita filtros excesivos</p>
        </div>
      </div>
    </div>
  );
}