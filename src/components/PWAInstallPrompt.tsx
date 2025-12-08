import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PWAInstallPrompt() {
  const { showPrompt, installApp, dismissPrompt, isInstalled, canInstall } = usePWAInstall();

  // No mostrar si ya está instalado
  if (isInstalled || !showPrompt) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('✅ PWA instalada exitosamente');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-sm z-50 animate-slide-up">
      <div className="flex items-start space-x-4">
        <div className="text-3xl animate-bounce">📱</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2">
            ¡Instala HUMANBIBLIO!
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Obtén la experiencia completa instalando nuestra PWA. Funciona como una aplicación nativa:
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-gray-700">
              <span className="w-4 h-4 mr-2 text-green-500">✅</span>
              <span>Acceso más rápido desde tu pantalla de inicio</span>
            </div>
            <div className="flex items-center text-xs text-gray-700">
              <span className="w-4 h-4 mr-2 text-green-500">✅</span>
              <span>Funciona sin conexión a internet</span>
            </div>
            <div className="flex items-center text-xs text-gray-700">
              <span className="w-4 h-4 mr-2 text-green-500">✅</span>
              <span>Notificaciones push (próximamente)</span>
            </div>
            <div className="flex items-center text-xs text-gray-700">
              <span className="w-4 h-4 mr-2 text-green-500">✅</span>
              <span>Experiencia como app nativa</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-xs text-blue-800">
              <span className="mr-2">💡</span>
              <span><strong>Tecnología PWA:</strong> Se instala directamente desde el navegador, sin app stores.</span>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-xs text-emerald-800">
              <span className="mr-2">🎯</span>
              <span><strong>Tip:</strong> Si cierras esta ventana, puedes volver a abrirla con el botón "📱 Instalar App" en el header.</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📱 Instalar App
            </button>
            <button
              onClick={dismissPrompt}
              className="px-3 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors hover:bg-gray-100 rounded-lg"
            >
              Ahora no
            </button>
          </div>
        </div>
        <button
          onClick={dismissPrompt}
          className="text-gray-400 hover:text-gray-600 text-lg p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}