import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ProjectFunder, User } from '../types';

interface SponsorsCarouselProps {
  sponsors: ProjectFunder[];
  onSponsorClick: (sponsor: ProjectFunder) => void;
}

export default function SponsorsCarousel({ sponsors, onSponsorClick }: SponsorsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { t } = useLanguage();

  // Filtrar solo financiadores con negocios en WB para el carrusel
  const featuredSponsors = sponsors.filter(s => s.is_wb_business).slice(0, 6);

  useEffect(() => {
    if (!isAutoPlaying || featuredSponsors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredSponsors.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredSponsors.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredSponsors.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredSponsors.length) % featuredSponsors.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (featuredSponsors.length === 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl p-8 text-center">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-xl font-bold text-yellow-800 mb-2">
          {t('boulevard.sponsor.empty.title')}
        </h3>
        <p className="text-yellow-700 mb-4">
          {t('boulevard.sponsor.empty.description')}
        </p>
        <button
          onClick={() => alert(t('boulevard.sponsor.empty.alert'))}
          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 font-semibold"
        >
          {t('boulevard.sponsor.empty.button')}
        </button>
      </div>
    );
  }

  const currentSponsor = featuredSponsors[currentSlide];

  const getRecognitionConfig = (level: string) => {
    switch (level) {
      case 'platinum':
        return {
          gradient: 'from-purple-500 to-violet-600',
          icon: '👑',
          title: t('boulevard.sponsor.level.platinum'),
          bgColor: 'from-purple-50 to-violet-50',
          borderColor: 'border-purple-300'
        };
      case 'gold':
        return {
          gradient: 'from-yellow-500 to-orange-600',
          icon: '🥇',
          title: t('boulevard.sponsor.level.gold'),
          bgColor: 'from-yellow-50 to-orange-50',
          borderColor: 'border-yellow-300'
        };
      case 'silver':
        return {
          gradient: 'from-gray-400 to-gray-600',
          icon: '🥈',
          title: t('boulevard.sponsor.level.silver'),
          bgColor: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-300'
        };
      default:
        return {
          gradient: 'from-orange-500 to-red-600',
          icon: '🥉',
          title: t('boulevard.sponsor.level.bronze'),
          bgColor: 'from-orange-50 to-red-50',
          borderColor: 'border-orange-300'
        };
    }
  };

  const config = getRecognitionConfig(currentSponsor.recognition_level);

  return (
    <div className="mb-12">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Main Carousel */}
        <div className="relative h-[450px] overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {featuredSponsors.map((sponsor, index) => (
              <div key={sponsor.id} className="w-full flex-shrink-0 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Image Section */}
                  <div className={`relative bg-gradient-to-br ${config.bgColor} flex items-center justify-center border-r ${config.borderColor}`}>
                    {sponsor.funder_avatar ? (
                      <img
                        src={sponsor.funder_avatar}
                        alt={sponsor.funder_name}
                       className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${sponsor.funder_avatar ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <div className="text-8xl mb-4">{config.icon}</div>
                        <h3 className="text-3xl font-bold text-gray-800">{sponsor.funder_name}</h3>
                      </div>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Recognition Badge */}
                    <div className={`absolute top-4 left-4 bg-gradient-to-r ${config.gradient} text-white px-4 py-2 rounded-full font-bold shadow-lg`}>
                      {config.icon} {config.title}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-4 py-2 bg-gradient-to-r ${config.gradient} text-white rounded-full text-sm font-bold`}>
                          {t('lang') === 'en' && sponsor.funder_profession_en ? sponsor.funder_profession_en : sponsor.funder_profession}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">💰</span>
                          <span className="font-bold">${sponsor.amount_funded.toLocaleString()}</span>
                          <span className="text-gray-500 text-sm">{t('boulevard.sponsor.funded')}</span>
                        </div>
                      </div>

                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {sponsor.funder_name}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {t('lang') === 'en' && sponsor.public_message_en ? sponsor.public_message_en : sponsor.public_message || `${sponsor.funder_name} ${t('boulevard.sponsor.active.message')}`}
                      </p>

                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-900">{t('boulevard.sponsor.impact.title')}</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {Math.floor(Math.random() * 5) + 1} {t('boulevard.sponsor.impact.projects')}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {Math.floor(Math.random() * 20) + 10} {t('boulevard.sponsor.impact.entrepreneurs')}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            ${(sponsor.amount_funded * (Math.random() * 3 + 1)).toLocaleString()} {t('boulevard.sponsor.impact.total')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => onSponsorClick(sponsor)}
                        className={`w-full px-6 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105`}
                      >
                        {sponsor.is_wb_business ? t('boulevard.sponsor.button.business') : t('boulevard.sponsor.button.profile')}
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => alert(`💬 Enviando mensaje a ${sponsor.funder_name}...`)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title="Chat de texto"
                        >
                          <span>💬</span>
                          <span className="text-sm">Chat</span>
                        </button>
                        <button
                          onClick={() => alert(`🎤 Enviando mensaje de voz a ${sponsor.funder_name}...`)}
                          className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title="Mensaje de voz"
                        >
                          <span>🎤</span>
                          <span className="text-sm">Voz</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => alert(`📞 Llamando a ${sponsor.funder_name}...`)}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title="Llamada de voz"
                        >
                          <span>📞</span>
                          <span className="text-sm">Llamar</span>
                        </button>
                        <button
                          onClick={() => alert(`📹 Iniciando videollamada con ${sponsor.funder_name}...`)}
                          className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-1"
                          title="Videollamada"
                        >
                          <span>📹</span>
                          <span className="text-sm">Video</span>
                        </button>
                      </div>

                      <button
                        onClick={() => alert(`${t('boulevard.sponsor.alert.collaborate')} ${sponsor.funder_name}...`)}
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <span>🤝</span>
                        <span>{t('boulevard.sponsor.button.collaborate')}</span>
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
          {featuredSponsors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? `bg-gradient-to-r ${config.gradient} scale-125` 
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

        {/* Sponsor Counter */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-800">
          {currentSlide + 1} / {featuredSponsors.length}
        </div>
      </div>

      {/* Carousel Info */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-4 bg-white rounded-2xl shadow-lg px-6 py-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🏆</span>
            <span className="text-sm font-medium text-gray-700">{t('boulevard.sponsor.info.featured')}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">💰</span>
            <span className="text-sm font-medium text-gray-700">{t('boulevard.sponsor.info.investment')}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">🌟</span>
            <span className="text-sm font-medium text-gray-700">{t('boulevard.sponsor.info.recognition')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}