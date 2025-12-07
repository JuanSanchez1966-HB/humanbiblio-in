import React, { useState, useEffect } from 'react';

export default function MobileWhatsAppDetector() {
  const [isWhatsAppMobile, setIsWhatsAppMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  useEffect(() => {
    // Detectar si estamos en WhatsApp móvil
    const userAgent = navigator.userAgent.toLowerCase();
    const isWhatsApp = userAgent.includes('whatsapp') || userAgent.includes('wv') || userAgent.includes('instagram') || userAgent.includes('fban');
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isInAppBrowser = userAgent.includes('wv') || userAgent.includes('whatsapp') || userAgent.includes('instagram') || userAgent.includes('fban') || userAgent.includes('fbav');
    
    if ((isWhatsApp || isInAppBrowser) && isMobile && !hasShownOnce) {
      setIsWhatsAppMobile(true);
      setShowInstructions(true);
      setHasShownOnce(true);
    }
  }, []);

  if (!isWhatsAppMobile || !showInstructions) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-6">📱</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📱 ¡Mejor experiencia en navegador!
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Para acceder a todas las funcionalidades de HUMANBIBLIO 
          (IA contextual, geolocalización, PWA), ábrelo en tu navegador móvil.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Instrucciones por dispositivo:</h3>
          <div className="space-y-2 text-sm text-blue-800 text-left">
            <div className="mb-3">
              <p className="font-semibold text-blue-900">📱 Android:</p>
              <p>1. Toca <strong>⋮</strong> (3 puntos) arriba a la derecha</p>
              <p>2. Selecciona <strong>"Abrir en navegador"</strong></p>
              <p>3. O <strong>"Abrir en Chrome"</strong></p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-blue-900">🍎 iPhone:</p>
              <p>1. Toca <strong>"Compartir"</strong> (□↗)</p>
              <p>2. Selecciona <strong>"Abrir en Safari"</strong></p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">📋 Alternativa:</p>
              <p>Copia la URL y pégala en tu navegador favorito</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-emerald-900 mb-2">🚀 Funcionalidades completas:</h3>
          <div className="space-y-1 text-sm text-emerald-800">
            <p>• 🧠 Chat IA completamente funcional</p>
            <p>• 🌍 Geolocalización "Cerca de mí"</p>
            <p>• 🎤 Grabación de mensajes de voz</p>
            <p>• 📱 Instalación como app nativa</p>
            <p>• 📞 Interfaces de llamadas completas</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Copiar URL al portapapeles
              const url = window.location.href;
              if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url);
                alert('¡URL copiada! 📋\n\nPégala en Chrome, Safari o tu navegador favorito.\n\n✨ Tendrás acceso completo a todas las funcionalidades de HUMANBIBLIO.');
              } else {
                // Fallback para navegadores que no soportan clipboard
                prompt('📋 Copia esta URL y ábrela en tu navegador móvil:', url);
              }
            }}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            📋 Copiar para Navegador
          </button>
          <button
            onClick={() => setShowInstructions(false)}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            Continuar (limitado)
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 En navegador: Chat IA completo + Geolocalización + Grabación de voz + PWA instalable
          </p>
        </div>
      </div>
    </div>
  );
}