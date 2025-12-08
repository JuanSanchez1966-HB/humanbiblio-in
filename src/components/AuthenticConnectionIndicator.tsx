import React from 'react';

interface AuthenticConnectionIndicatorProps {
  isVisible: boolean;
}

export default function AuthenticConnectionIndicator({ isVisible }: AuthenticConnectionIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-30">
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl border border-green-400/30 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-2xl mb-2 animate-pulse">🌱</div>
          <div className="text-sm font-bold mb-1">Conexión Auténtica</div>
          <div className="text-xs opacity-90">Sin algoritmos manipulativos</div>
        </div>
      </div>
    </div>
  );
}