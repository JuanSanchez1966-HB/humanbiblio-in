import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Business } from '../types';

interface BoulevardCarouselProps {
  businesses: Business[];
  onBusinessClick: (business: Business) => void;
}

export default function BoulevardCarousel({ businesses, onBusinessClick }: BoulevardCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { t } = useLanguage();

  // Seleccionar negocios destacados para el carrusel
  const featuredBusinesses = businesses.filter(b => b.is_featured).slice(0, 6);

  useEffect(() => {
    if (!isAutoPlaying || featuredBusinesses.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredBusinesses.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredBusinesses.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredBusinesses.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredBusinesses.length) % featuredBusinesses.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (featuredBusinesses.length === 0) {
    return null;
  }

  const currentBusiness = featuredBusinesses[currentSlide];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('boulevard.featured.title')}
        </h2>
        <p className="text-gray-600">
          {t('boulevard.featured.description')}
        </p>
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Main Carousel */}
        <div className="relative h-[32rem] overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {featuredBusinesses.map((business, index) => (
              <div key={business.id} className="w-full flex-shrink-0 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Image Section */}
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {business.avatar_url ? (
                      <img
                        src={business.avatar_url}
                        alt={business.name}
                       className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-white ${business.avatar_url ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <div className="text-8xl mb-4">🏢</div>
                        <h3 className="text-3xl font-bold">{business.name}</h3>
                      </div>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {t('boulevard.badge.featured')}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div className="mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                          {t('lang') === 'en' && business.category_en ? business.category_en : business.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{(Math.random() * 1.5 + 3.5).toFixed(1)}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {t('lang') === 'en' && business.name_en ? business.name_en : business.name}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {t('lang') === 'en' && business.description_en ? business.description_en : business.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-gray-900">{t('business.card.services')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {(t('lang') === 'en' && business.products_services_en ? business.products_services_en : business.products_services).slice(0, 3).map((service, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 flex-shrink-0">
                      <button
                        onClick={() => onBusinessClick(business)}
                        className="w-full px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {t('boulevard.contact.now')}
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => alert(`💬 Enviando mensaje a ${business.name}...`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title={t('communication.chat.title')}
                        >
                          <span>💬</span>
                          <span className="text-sm">Chat</span>
                        </button>
                        <button
                          onClick={() => alert(`🎤 Enviando mensaje de voz a ${business.name}...`)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title={t('communication.audio.title')}
                        >
                          <span>🎤</span>
                          <span className="text-sm">Voz</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => alert(`📞 Llamando a ${business.name}...`)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title={t('communication.voice.title')}
                        >
                          <span>📞</span>
                          <span className="text-sm">{t('boulevard.call')}</span>
                        </button>
                        <button
                          onClick={() => alert(`📹 Iniciando videollamada con ${business.name}...`)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title={t('communication.video.title')}
                        >
                          <span>📹</span>
                          <span className="text-sm">Video</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (business.website) {
                            window.open(business.website, '_blank');
                          } else {
                            alert(`🌐 Sitio web de ${business.name} próximamente`);
                          }
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <span>🌐</span>
                        <span>{t('boulevard.website')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            →
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center space-x-2 py-6 bg-gray-50">
          {featuredBusinesses.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-emerald-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Control */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
            title={isAutoPlaying ? t('boulevard.autoplay.pause') : t('boulevard.autoplay.play')}
          >
            {isAutoPlaying ? '⏸️' : '▶️'}
          </button>
        </div>

        {/* Business Counter */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-800">
          {currentSlide + 1} / {featuredBusinesses.length}
        </div>
      </div>

      {/* Carousel Info */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-4 bg-white rounded-2xl shadow-lg px-6 py-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-600">🌱</span>
            <span className="text-sm font-medium text-gray-700">{t('boulevard.info.organic')}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">🤝</span>
            <span className="text-sm font-medium text-gray-700">{t('boulevard.info.direct')}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">✨</span>
            <span className="text-sm font-medium text-gray-700">{t('boulevard.info.no_intermediaries')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}