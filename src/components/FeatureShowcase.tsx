import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FeatureShowcase() {
  const { t } = useLanguage();

  const features = [
    {
      icon: '🧠',
<<<<<<< HEAD
      titleKey: 'features.ai.title',
      descriptionKey: 'features.ai.description',
      detailKeys: ['features.ai.detail1', 'features.ai.detail2', 'features.ai.detail3', 'features.ai.detail4'],
=======
      title: 'IA Contextual',
      description: 'Conversaciones inteligentes que se adaptan al expertise de cada persona',
      details: ['4 personalidades especializadas', 'Respuestas según profesión', 'Análisis de sentimiento', 'Memoria conversacional'],
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: '🌱',
<<<<<<< HEAD
      titleKey: 'features.connections.title',
      descriptionKey: 'features.connections.description',
      detailKeys: ['features.connections.detail1', 'features.connections.detail2', 'features.connections.detail3', 'features.connections.detail4'],
=======
      title: 'Conexiones Conscientes',
      description: 'Cada conexión es intencional, sin algoritmos manipulativos',
      details: ['Flujo de intención', 'Calidad sobre cantidad', 'Sin adicción diseñada', 'Comunicación auténtica'],
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: '🎯',
<<<<<<< HEAD
      titleKey: 'features.matching.title',
      descriptionKey: 'features.matching.description',
      detailKeys: ['features.matching.detail1', 'features.matching.detail2', 'features.matching.detail3', 'features.matching.detail4'],
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: '📱',
      titleKey: 'features.pwa.title',
      descriptionKey: 'features.pwa.description',
      detailKeys: ['features.pwa.detail1', 'features.pwa.detail2', 'features.pwa.detail3', 'features.pwa.detail4'],
=======
      title: 'Matching Inteligente',
      description: 'Algoritmos que conectan por compatibilidad real, no engagement',
      details: ['Análisis de intereses', 'Compatibilidad profesional', 'Proximidad geográfica', 'Objetivos comunes'],
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      icon: '📱',
      title: 'Experiencia Nativa',
      description: 'PWA instalable que funciona como app nativa',
      details: ['Instalación directa', 'Funciona offline', 'Notificaciones push', 'Acceso rápido'],
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: '🌍',
<<<<<<< HEAD
      titleKey: 'features.geo.title',
      descriptionKey: 'features.geo.description',
      detailKeys: ['features.geo.detail1', 'features.geo.detail2', 'features.geo.detail3', 'features.geo.detail4'],
=======
      title: 'Geolocalización Inteligente',
      description: 'Descubre personas y negocios increíbles cerca de ti',
      details: ['Mapa interactivo', 'Filtros de distancia', 'Privacidad protegida', 'Búsqueda local'],
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: '🛡️',
<<<<<<< HEAD
      titleKey: 'features.commerce.title',
      descriptionKey: 'features.commerce.description',
      detailKeys: ['features.commerce.detail1', 'features.commerce.detail2', 'features.commerce.detail3', 'features.commerce.detail4'],
=======
      title: 'Comercio Orgánico',
      description: 'Negocios que crecen auténticamente, sin publicidad forzada',
      details: ['Crecimiento natural', 'Sin intermediarios', 'Relaciones directas', 'Comercio consciente'],
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 transform hover:scale-105"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
<<<<<<< HEAD
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(feature.descriptionKey)}
=======
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </p>
                </div>

                <div className="space-y-3">
<<<<<<< HEAD
                  {feature.detailKeys.map((detailKey, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-3 flex-shrink-0`}></div>
                      <span className="text-sm text-gray-700">{t(detailKey)}</span>
=======
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-3 flex-shrink-0`}></div>
                      <span className="text-sm text-gray-700">{detail}</span>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    </div>
                  ))}
                </div>

                <div className={`mt-6 p-4 bg-gradient-to-r ${feature.gradient} bg-opacity-10 rounded-xl border border-opacity-20`}>
                  <p className="text-center">
                    <span className="text-sm font-semibold text-gray-800">
<<<<<<< HEAD
                      {t('features.amplifies')}
=======
                      Tecnología que amplifica tu humanidad
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparación HUMANBIBLIO vs Redes Tradicionales */}
        <div className="mt-20 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">{t('comparison.title')}</h3>
            <p className="text-red-100">{t('comparison.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Columna Izquierda - Redes Tradicionales */}
            <div className="p-8 bg-red-50 border-r border-gray-200">
              <h4 className="text-2xl font-bold text-red-700 mb-6 flex items-center">
                <span className="mr-3">📱</span>
                {t('comparison.traditional')}
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">🎯</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-red-800 mb-2">{t('traditional.addiction.title')}</h5>
                      <p className="text-sm text-red-700 mb-2">{t('traditional.addiction.desc')}</p>
                      <div className="space-y-1 text-xs text-red-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.addiction.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.addiction.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.addiction.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">🤖</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-red-800 mb-2">{t('traditional.algorithms.title')}</h5>
                      <p className="text-sm text-red-700 mb-2">{t('traditional.algorithms.desc')}</p>
                      <div className="space-y-1 text-xs text-red-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.algorithms.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.algorithms.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.algorithms.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">📢</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-red-800 mb-2">{t('traditional.ads.title')}</h5>
                      <p className="text-sm text-red-700 mb-2">{t('traditional.ads.desc')}</p>
                      <div className="space-y-1 text-xs text-red-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.ads.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.ads.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.ads.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">⚡</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-red-800 mb-2">{t('traditional.engagement.title')}</h5>
                      <p className="text-sm text-red-700 mb-2">{t('traditional.engagement.desc')}</p>
                      <div className="space-y-1 text-xs text-red-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.engagement.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.engagement.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.engagement.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">🔒</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-red-800 mb-2">{t('traditional.data.title')}</h5>
                      <p className="text-sm text-red-700 mb-2">{t('traditional.data.desc')}</p>
                      <div className="space-y-1 text-xs text-red-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.data.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.data.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('traditional.data.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer de Redes Tradicionales */}
              <div className="mt-6 bg-red-100 border border-red-300 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">😔</div>
                <p className="font-bold text-red-800">{t('traditional.result')}</p>
                <p className="text-sm text-red-700">{t('traditional.result.desc')}</p>
              </div>
            </div>

            {/* Columna Derecha - HUMANBIBLIO */}
            <div className="p-8 bg-green-50">
              <h4 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                <span className="mr-3">🏛️</span>
                {t('comparison.humanbiblio')}
              </h4>
              
              <div className="space-y-4">
                <div className="bg-white border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">🌱</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-green-800 mb-2">{t('humanbiblio.authentic.title')}</h5>
                      <p className="text-sm text-green-700 mb-2">{t('humanbiblio.authentic.desc')}</p>
                      <div className="space-y-1 text-xs text-green-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.authentic.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.authentic.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.authentic.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">🧠</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-green-800 mb-2">{t('humanbiblio.ai.title')}</h5>
                      <p className="text-sm text-green-700 mb-2">{t('humanbiblio.ai.desc')}</p>
                      <div className="space-y-1 text-xs text-green-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.ai.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.ai.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.ai.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">🛡️</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-green-800 mb-2">{t('humanbiblio.commerce.title')}</h5>
                      <p className="text-sm text-green-700 mb-2">{t('humanbiblio.commerce.desc')}</p>
                      <div className="space-y-1 text-xs text-green-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.commerce.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.commerce.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.commerce.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">✨</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-green-800 mb-2">{t('humanbiblio.authentic2.title')}</h5>
                      <p className="text-sm text-green-700 mb-2">{t('humanbiblio.authentic2.desc')}</p>
                      <div className="space-y-1 text-xs text-green-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.authentic2.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.authentic2.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.authentic2.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 min-h-[4rem]">
                    <span className="text-2xl flex-shrink-0">🔐</span>
                    <div className="flex-1 flex flex-col justify-start">
                      <h5 className="font-bold text-green-800 mb-2">{t('humanbiblio.privacy.title')}</h5>
                      <p className="text-sm text-green-700 mb-2">{t('humanbiblio.privacy.desc')}</p>
                      <div className="space-y-1 text-xs text-green-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.privacy.1')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.privacy.2')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          <span>{t('humanbiblio.privacy.3')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer de HUMANBIBLIO */}
              <div className="mt-6 bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">😊</div>
                <p className="font-bold text-green-800">{t('humanbiblio.result')}</p>
                <p className="text-sm text-green-700">{t('humanbiblio.result.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}