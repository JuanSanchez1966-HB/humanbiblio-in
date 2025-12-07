import React, { useState } from 'react';
import type { User } from '../types';

interface SubtleWBPromotionProps {
  user: User;
  onActivate: (user: User) => void;
}

export default function SubtleWBPromotion({ user, onActivate }: SubtleWBPromotionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Solo mostrar si el usuario NO vende en WB
  if (user.is_wb_seller) {
    return null;
  }

  const handleActivateWB = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPaymentModal(true);
  };

  const handlePayment = (tier: 'basic' | 'premium' | 'enterprise') => {
    setTimeout(() => {
      alert(`✅ ¡Activación exitosa! ${user.full_name} ahora vende en World Boulevard con plan ${tier}. 🛍️`);
      setShowPaymentModal(false);
      onActivate(user);
    }, 100);
  };

  return (
    <>
      {/* Promoción Sutil */}
      <div 
        className={`mt-3 transition-all duration-300 ${
          isExpanded ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'
        } rounded-xl overflow-hidden cursor-pointer hover:shadow-md`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💼</span>
              <span className="text-sm font-medium text-gray-700">
                ¿Ofreces servicios profesionales?
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-amber-600 font-medium">World Boulevard</span>
              <span className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
          </div>
          
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="text-sm text-gray-600 mb-3">
                Conecta con clientes potenciales en World Boulevard. 
                <span className="text-amber-700 font-medium"> Comercio orgánico sin publicidad intrusiva.</span>
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  ✨ Crecimiento auténtico • 🤝 Conexión directa
                </div>
                <button
                  onClick={handleActivateWB}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  🚀 Activar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🛍️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Activar World Boulevard
                </h2>
                <p className="text-gray-600">
                  Elige tu plan para vender en World Boulevard
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div 
                  onClick={() => handlePayment('basic')}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Plan Básico</h3>
                      <p className="text-sm text-gray-600">Perfil comercial + Chat directo</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-600">$29</div>
                      <div className="text-xs text-gray-500">/mes</div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handlePayment('premium')}
                  className="p-4 border-2 border-emerald-500 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-emerald-800">Plan Premium ⭐</h3>
                      <p className="text-sm text-emerald-700">Perfil destacado + Galería + Analytics</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-600">$79</div>
                      <div className="text-xs text-emerald-600">/mes</div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handlePayment('enterprise')}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Plan Enterprise</h3>
                      <p className="text-sm text-gray-600">Todo incluido + IA personalizada</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600">$199</div>
                      <div className="text-xs text-gray-500">/mes</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}