import React, { useState } from 'react';
import type { User } from '../types';

interface WBActivationButtonProps {
  user: User;
  onActivate: (user: User) => void;
}

export default function WBActivationButton({ user, onActivate }: WBActivationButtonProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleActivateWB = () => {
    // Prevenir propagación de eventos
    event?.preventDefault();
    event?.stopPropagation();
    setShowPaymentModal(true);
  };

  const handlePayment = (tier: 'basic' | 'premium' | 'enterprise') => {
    // Simular proceso de pago
    setTimeout(() => {
      alert(`¡Pago procesado! ${user.full_name} ahora puede vender en World Boulevard con plan ${tier}. 🛍️✨`);
      setShowPaymentModal(false);
      onActivate(user);
    }, 100);
  };

  return (
    <>
      <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
        <div className="text-center">
          <div className="text-2xl mb-2">🛍️</div>
          <h4 className="font-semibold text-yellow-800 mb-2">¿Vendes productos o servicios?</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Activa tu perfil comercial en World Boulevard y conecta con clientes potenciales
          </p>
          <button
            onClick={handleActivateWB}
            className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
          >
            🚀 Activar World Boulevard
          </button>
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

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">🎯 Beneficios World Boulevard:</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>• 🛍️ Perfil comercial profesional</p>
                  <p>• 📸 Galería multimedia para productos</p>
                  <p>• 💬 Chat directo con clientes potenciales</p>
                  <p>• 🌍 Geolocalización para clientes cercanos</p>
                  <p>• 📊 Analytics de visitas e interacciones</p>
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