import React, { useState } from 'react';
<<<<<<< HEAD
import { Edit } from 'lucide-react';
import type { Business } from '../types';
import BusinessReviews from './BusinessReviews';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import BusinessProfileEditor from './BusinessProfileEditor';
import { useAnalytics } from '../hooks/useAnalytics';
=======
import type { Business } from '../types';
import BusinessReviews from './BusinessReviews';
import { useAuth } from '../contexts/AuthContext';
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193

interface ExpandedBusinessProfileProps {
  business: Business;
  onClose: () => void;
<<<<<<< HEAD
  onUpdate?: () => void;
}

export default function ExpandedBusinessProfile({ business, onClose, onUpdate }: ExpandedBusinessProfileProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { logAction } = useAnalytics({ userId: user?.id });
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [showEditor, setShowEditor] = useState(false);

  const isOwner = user && user.id === business.owner_id;
=======
}

export default function ExpandedBusinessProfile({ business, onClose }: ExpandedBusinessProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193

  // Media específica para cada negocio
  const getBusinessMedia = (businessName: string) => {
    switch (businessName) {
      case 'Terapia Integral Ana García':
        return [
          'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200'
        ];
      case 'TechSolutions Carlos Rodríguez':
        return [
          'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200',
          'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200'
        ];
      default:
        return [business.avatar_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200'];
    }
  };

  const mediaUrls = getBusinessMedia(business.name);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🛍️
              </div>
              <div>
<<<<<<< HEAD
                <h2 className="text-3xl font-bold">{t('lang') === 'en' && business.name_en ? business.name_en : business.name}</h2>
                <p className="text-emerald-100 text-lg">{t('lang') === 'en' && business.category_en ? business.category_en : business.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isOwner && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{t('wb.edit.button')}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/20 rounded-full transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
=======
                <h2 className="text-3xl font-bold">{business.name}</h2>
                <p className="text-emerald-100 text-lg">{business.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-full transition-colors text-2xl"
            >
              ✕
            </button>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-8">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
<<<<<<< HEAD
              {t('expanded.business.tab.info')}
=======
              Información
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
<<<<<<< HEAD
              {t('expanded.business.tab.reviews')}
=======
              Reseñas
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        <div className="p-8">
          {activeTab === 'info' && (
            <>
              {/* Hero Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={mediaUrls[0]}
                  alt={business.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              {mediaUrls.slice(1, 3).map((url, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={url}
                    alt={`${business.name} ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Información Principal */}
            <div className="space-y-8">
              <div>
<<<<<<< HEAD
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('lang') === 'en' && business.name_en ? business.name_en : business.name}</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-lg">
                    {t('lang') === 'en' && business.category_en ? business.category_en : business.category}
=======
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{business.name}</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-lg">
                    {business.category}
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500 text-xl">⭐</span>
                    <span className="font-bold text-lg">{(Math.random() * 1.5 + 3.5).toFixed(1)}</span>
<<<<<<< HEAD
                    <span className="text-gray-500">({Math.floor(Math.random() * 200) + 50} {t('expanded.business.reviews.count')})</span>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{t('lang') === 'en' && business.description_en ? business.description_en : business.description}</p>
=======
                    <span className="text-gray-500">({Math.floor(Math.random() * 200) + 50} reseñas)</span>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{business.description}</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </div>

              {/* Servicios Expandidos */}
              <div>
<<<<<<< HEAD
                <h4 className="text-2xl font-bold text-gray-900 mb-4">🎯 {t('expanded.business.services.title')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(t('lang') === 'en' && business.products_services_en ? business.products_services_en : business.products_services).map((service, index) => (
=======
                <h4 className="text-2xl font-bold text-gray-900 mb-4">🎯 Servicios y Productos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.products_services.map((service, index) => (
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    <div key={index} className="flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-emerald-600 text-xl mr-3">✓</span>
                      <span className="font-medium text-gray-800">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificación Comercio Orgánico */}
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300 rounded-2xl p-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🌱</div>
                  <h4 className="text-xl font-bold text-emerald-800 mb-3">
                    Comercio Orgánico Certificado
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-800">
                    <div className="flex items-center">
                      <span className="mr-2">✅</span>
                      <span>Crecimiento auténtico</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✅</span>
                      <span>Sin publicidad forzada</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✅</span>
                      <span>Verificado por HUMANBIBLIO</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✅</span>
                      <span>Comunicación directa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto y Acciones */}
            <div className="space-y-8">
              {/* Información de Contacto */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">📞 Información de Contacto</h4>
                <div className="space-y-4">
                  {business.contact_email && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                      <span className="text-blue-600 text-xl mr-3">📧</span>
                      <span className="font-medium text-gray-800">{business.contact_email}</span>
                    </div>
                  )}
                  {business.contact_phone && (
                    <div className="flex items-center p-3 bg-green-50 rounded-xl">
                      <span className="text-green-600 text-xl mr-3">📞</span>
                      <span className="font-medium text-gray-800">{business.contact_phone}</span>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                      <span className="text-purple-600 text-xl mr-3">🌐</span>
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-medium text-purple-700 hover:text-purple-800 hover:underline"
                      >
                        Visitar sitio web
                      </a>
                    </div>
                  )}
                  {business.location && (
                    <div className="flex items-center p-3 bg-orange-50 rounded-xl">
                      <span className="text-orange-600 text-xl mr-3">📍</span>
                      <span className="font-medium text-gray-800">{business.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones Principales */}
              <div className="space-y-4">
                <button
                  onClick={() => {
<<<<<<< HEAD
                    logAction('click_contact_business', business.id, {
                      businessName: business.name,
                      category: business.category,
                      from: 'expanded_profile'
                    });
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    alert(`💬 Iniciando conversación con ${business.name}...`);
                    onClose();
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  💬 Contactar Ahora
                </button>
<<<<<<< HEAD

                {/* Métodos de Comunicación */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Métodos de Comunicación</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        logAction('click_chat', business.id, {
                          businessName: business.name,
                          communicationType: 'text'
                        });
                        alert(`💬 Enviando mensaje de texto a ${business.name}...`);
                      }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Chat de texto"
                    >
                      <span className="text-xl">💬</span>
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => {
                        logAction('click_voice_message', business.id, {
                          businessName: business.name,
                          communicationType: 'voice'
                        });
                        alert(`🎤 Enviando mensaje de voz a ${business.name}...`);
                      }}
                      className="px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Mensaje de voz"
                    >
                      <span className="text-xl">🎤</span>
                      <span>Voz</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        logAction('click_call', business.id, {
                          businessName: business.name,
                          communicationType: 'call'
                        });
                        alert(`📞 Llamando a ${business.name}...`);
                      }}
                      className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Llamada de voz"
                    >
                      <span className="text-xl">📞</span>
                      <span>Llamar</span>
                    </button>
                    <button
                      onClick={() => {
                        logAction('click_video_call', business.id, {
                          businessName: business.name,
                          communicationType: 'video'
                        });
                        alert(`📹 Iniciando videollamada con ${business.name}...`);
                      }}
                      className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Videollamada"
                    >
                      <span className="text-xl">📹</span>
                      <span>Video</span>
                    </button>
                  </div>
                </div>

                {/* Botón de Ubicación */}
                <button
                  onClick={() => {
                    logAction('click_view_location', business.id, {
                      businessName: business.name,
                      location: business.location
                    });
                    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(business.location || business.name)}`;
                    window.open(mapUrl, '_blank');
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span className="text-xl">📍</span>
                  <span>Ver Ubicación</span>
                </button>
=======
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => alert(`📞 Llamando a ${business.name}...`)}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                  >
                    📞 Llamar
                  </button>
                  <button
                    onClick={() => {
                      const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(business.location || business.name)}`;
                      window.open(mapUrl, '_blank');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    📍 Ubicación
                  </button>
                </div>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </div>

              {/* Estadísticas del Negocio */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-4">📊 Estadísticas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 500) + 100}</div>
                    <div className="text-sm text-blue-800">Visitas este mes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.floor(Math.random() * 50) + 20}</div>
                    <div className="text-sm text-purple-800">Contactos directos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{Math.floor(Math.random() * 20) + 5}</div>
                    <div className="text-sm text-emerald-800">Clientes nuevos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{(Math.random() * 1.5 + 3.5).toFixed(1)}</div>
                    <div className="text-sm text-orange-800">Valoración promedio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <BusinessReviews businessId={business.id} currentUserId={user?.id} />
          )}
        </div>
      </div>
<<<<<<< HEAD

      {/* Business Profile Editor */}
      {isOwner && showEditor && (
        <BusinessProfileEditor
          business={business}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSaveSuccess={() => {
            setShowEditor(false);
            if (onUpdate) {
              onUpdate();
            }
          }}
        />
      )}
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
    </div>
  );
}