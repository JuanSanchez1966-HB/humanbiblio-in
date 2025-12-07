import React from 'react';

interface GeolocationPermissionRequestProps {
  onRequestPermission: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function GeolocationPermissionRequest({ 
  onRequestPermission, 
  onCancel, 
  loading = false 
}: GeolocationPermissionRequestProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center">
          <div className="text-6xl mb-6">🌍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Descubre lo que está cerca
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            HUMANBIBLIO puede mostrarte personas y negocios cercanos a tu ubicación. 
            Tu privacidad está protegida - solo usamos tu ubicación para búsquedas locales.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">🔒</span>
              Tu privacidad es importante
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                <span>Solo para mostrar resultados cercanos</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                <span>No almacenamos tu ubicación</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                <span>Puedes desactivarlo cuando quieras</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                <span>No compartimos datos con terceros</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              Qué puedes descubrir
            </h3>
            <div className="space-y-2 text-sm text-emerald-800">
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2">👥</span>
                <span>Profesionales y expertos en tu área</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2">🏢</span>
                <span>Negocios locales únicos y auténticos</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2">🎯</span>
                <span>Eventos y oportunidades cercanas</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2">🤝</span>
                <span>Conexiones significativas en tu ciudad</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onRequestPermission}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Obteniendo ubicación...
                </span>
              ) : (
                '🌍 Activar Geolocalización'
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-xl disabled:opacity-50"
            >
              Ahora no
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Puedes cambiar estos permisos en cualquier momento desde la configuración de tu navegador.
          </p>
        </div>
      </div>
    </div>
  );
}