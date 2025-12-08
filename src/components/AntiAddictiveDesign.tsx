import React, { useState, useEffect } from 'react';

interface AntiAddictiveDesignProps {
  children: React.ReactNode;
}

export default function AntiAddictiveDesign({ children }: AntiAddictiveDesignProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [showMindfulBreak, setShowMindfulBreak] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Sugerir descanso después de 30 minutos de uso
    if (sessionTime > 0 && sessionTime % 30 === 0) {
      setShowMindfulBreak(true);
    }
  }, [sessionTime]);

  return (
    <div className="relative">
      {children}
      
      {/* Indicador de tiempo de sesión */}
      <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200/50 z-30">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-green-600">🌱</span>
          <span className="text-gray-700">Uso consciente: {sessionTime} min</span>
          <span className="text-blue-600">✨</span>
        </div>
      </div>

      {/* Recordatorio de descanso mindful */}
      {showMindfulBreak && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Momento Mindful
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Has estado conectado por {sessionTime} minutos. HUMANBIBLIO te invita a tomar un respiro consciente.
              Las mejores conexiones surgen cuando estamos presentes y centrados.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Sugerencia:</h4>
              <p className="text-sm text-blue-800">
                Toma 3 respiraciones profundas, estira tu cuerpo, o simplemente observa tu entorno por un momento.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowMindfulBreak(false)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
              >
                🌱 Continuar Conscientemente
              </button>
              <button
                onClick={() => {
                  setShowMindfulBreak(false);
                  // Opcional: cerrar la app o ir a una página de descanso
                }}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Tomar Descanso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}