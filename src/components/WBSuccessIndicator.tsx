import React from 'react';
import type { User } from '../types';

interface WBSuccessIndicatorProps {
  user: User;
  onViewInBoulevard: () => void;
}

export default function WBSuccessIndicator({ user, onViewInBoulevard }: WBSuccessIndicatorProps) {
  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-green-600 text-xl">✅</span>
          <span className="font-semibold text-green-800">Vendiendo en World Boulevard</span>
          <span className="text-green-600 text-xl">🛍️</span>
        </div>
        <p className="text-sm text-green-700 mb-3">
          Tu perfil comercial está activo y recibiendo visitas
        </p>
        <button
          onClick={onViewInBoulevard}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🛍️ Ver en Boulevard
        </button>
      </div>
    </div>
  );
}