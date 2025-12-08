import React, { useState } from 'react';
import { useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AgoraActionButtonsProps {
  onWBActivation: (userName: string) => void;
  availableUsers: Array<{ id: string; full_name: string; is_wb_seller: boolean }>;
}

export default function AgoraActionButtons({
  onWBActivation,
  availableUsers
}: AgoraActionButtonsProps) {
  const [showWBModal, setShowWBModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Calcular scroll máximo para cremallera
  useEffect(() => {
    if (contentRef.current && showWBModal) {
      const element = contentRef.current;
      const maxScrollValue = element.scrollHeight - element.clientHeight;
      setMaxScroll(maxScrollValue);
    }
  }, [showWBModal]);

  // Manejar scroll con cremallera
  const handleScroll = () => {
    if (contentRef.current) {
      setScrollPosition(contentRef.current.scrollTop);
    }
  };

  // Scroll programático desde cremallera
  const scrollTo = (position: number) => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  };

  const scrollPercentage = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;

  // Solo usuarios que NO venden en WB pueden comprar espacio
  const eligibleUsers = availableUsers; // Todos pueden comprar más espacios

  const handleWBClick = () => {
    if (eligibleUsers.length === 0) {
      alert('🎭 Todos los usuarios ya tienen espacios comerciales activos en World Boulevard');
      return;
    }
    setShowWBModal(true);
  };

  const handlePlanSelect = (plan: 'basic' | 'premium' | 'enterprise') => {
    if (!selectedUser) {
      alert('Por favor selecciona un usuario primero');
      return;
    }

    const user = eligibleUsers.find(u => u.id === selectedUser);
    if (!user) return;

    setShowWBModal(false);
    setTimeout(() => {
      alert(`✅ ¡Plan ${plan} activado para ${user.full_name}!\n\n🛍️ Ahora vende en World Boulevard\n🟢 Botón WB activado en su perfil\n📊 Perfil comercial creado`);
      onWBActivation(user.full_name);
    }, 100);
  };

 

  return (
    <>
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex justify-center">
          {/* Botón WB Centralizado */}
          <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full max-w-md">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:shadow-emerald-500/25">
                WB
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-3">
                {t('action.wb.title')}
              </h3>
              <p className="text-sm text-emerald-700 mb-6">
                {t('action.wb.desc')}
              </p>
              <button
                onClick={handleWBClick}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t('action.wb.button')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Compra WB */}
      {showWBModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowWBModal(false)}>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            
            {/* CREMALLERA LATERAL PARA FORMULARIO WB */}
            <div className="absolute right-2 top-16 bottom-16 w-6 z-10">
              {/* Track de la cremallera */}
              <div className="relative h-full bg-gray-200 rounded-full w-2 mx-auto">
                {/* Indicador de posición */}
                <div 
                  className="absolute w-6 h-6 bg-emerald-600 rounded-full shadow-lg cursor-pointer transform -translate-x-2 transition-all duration-200 hover:bg-emerald-700 hover:scale-110"
                  style={{ 
                    top: `${scrollPercentage}%`,
                    transform: `translateX(-50%) translateY(-50%)`
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                    const clickY = e.clientY - rect.top;
                    const percentage = (clickY / rect.height) * 100;
                    const targetScroll = (percentage / 100) * maxScroll;
                    scrollTo(targetScroll);
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    WB
                  </div>
                </div>
              </div>
              
              {/* Botones de navegación rápida */}
              <div className="absolute -right-8 top-0">
                <button
                  onClick={() => scrollTo(0)}
                  className="w-8 h-8 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors text-xs font-bold shadow-lg"
                  title="Ir al inicio"
                >
                  ↑
                </button>
              </div>
              
              <div className="absolute -right-8 bottom-0">
                <button
                  onClick={() => scrollTo(maxScroll)}
                  className="w-8 h-8 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors text-xs font-bold shadow-lg"
                  title="Ir al final"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Header fijo */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🛍️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Comprar Espacio en World Boulevard
                </h2>
                <p className="text-gray-600">
                  Selecciona el usuario y plan para activar su perfil comercial
                </p>
              </div>
            </div>
            
            {/* Contenido scrolleable con cremallera */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-y-auto"
              onScroll={handleScroll}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <div className="p-6">

              {/* Selector de Usuario */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('agora.wb.select.user')}
                </label>
                <div className="space-y-3">
                  {eligibleUsers.map((user) => (
                    <label key={user.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <input
                        type="radio"
                        name="selectedUser"
                        value={user.id}
                        checked={selectedUser === user.id}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.full_name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{user.full_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Planes */}
              {selectedUser && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div 
                    onClick={() => handlePlanSelect('basic')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 cursor-pointer text-center"
                  >
                    <div className="text-3xl mb-3">🌱</div>
                    <h3 className="font-bold text-gray-900 mb-2">Plan Básico</h3>
                    <div className="text-2xl font-bold text-emerald-600 mb-2">$29</div>
                    <div className="text-xs text-gray-500 mb-4">/mes</div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>• Perfil comercial</p>
                      <p>• Chat directo</p>
                      <p>• Geolocalización</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => handlePlanSelect('premium')}
                    className="p-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-300 cursor-pointer text-center relative"
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                      ⭐ POPULAR
                    </div>
                    <div className="text-3xl mb-3">🚀</div>
                    <h3 className="font-bold text-emerald-800 mb-2">Plan Premium</h3>
                    <div className="text-2xl font-bold text-emerald-600 mb-2">$79</div>
                    <div className="text-xs text-emerald-600 mb-4">/mes</div>
                    <div className="space-y-1 text-sm text-emerald-700">
                      <p>• Todo del Básico</p>
                      <p>• Perfil destacado</p>
                      <p>• Galería multimedia</p>
                      <p>• Analytics</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => handlePlanSelect('enterprise')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 cursor-pointer text-center"
                  >
                    <div className="text-3xl mb-3">👑</div>
                    <h3 className="font-bold text-gray-900 mb-2">Plan Enterprise</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-2">$199</div>
                    <div className="text-xs text-gray-500 mb-4">/mes</div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>• Todo del Premium</p>
                      <p>• IA personalizada</p>
                      <p>• Soporte prioritario</p>
                      <p>• Carrusel destacado</p>
                    </div>
                  </div>
                </div>
              )}

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-emerald-900 mb-2">🎯 Beneficios World Boulevard:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-emerald-800">
                    <p>• 🛍️ Perfil comercial profesional</p>
                    <p>• 📸 Galería multimedia expandible</p>
                    <p>• 💬 Chat directo con clientes</p>
                    <p>• 🌍 Geolocalización inteligente</p>
                    <p>• 📊 Analytics de interacciones</p>
                    <p>• 🎠 Carrusel publicitario</p>
                  </div>
                </div>
                
                {/* Espaciado final para scroll completo */}
                <div className="h-8"></div>
              </div>
            </div>

            {/* Footer fijo */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWBModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  {t('form.cancel')}
                </button>
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setShowWBModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-20"
            >
              ✕
            </button>

            {/* Indicador de scroll */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 border border-gray-200">
              {scrollPercentage < 95 ? '👇 Usa cremallera para navegar' : '✅ Formulario completo'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}