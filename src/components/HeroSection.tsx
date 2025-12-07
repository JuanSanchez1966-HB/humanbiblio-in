import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LogoComponent from './LogoComponent';

interface HeroSectionProps {
  onJoinAgora: () => void;
  onExploreBoulevard: () => void;
}

export default function HeroSection({ onJoinAgora, onExploreBoulevard }: HeroSectionProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const { t } = useLanguage();

  const phrases = [
    t('hero.subtitle1'),
    t('hero.subtitle2'),
    t('hero.subtitle3'),
    t('hero.subtitle4')
  ];

  useEffect(() => {
    if (phrases.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Encabezado Blanco para Logo */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <LogoComponent 
                  size="hero-large"
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-purple-400/10 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-400/10 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-teal-400/10 rounded-full animate-float"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Descripción Principal */}
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
            {t('hero.description')}
            <br />
            <span className="text-purple-200 font-semibold">{t('hero.description2')}</span>
          </p>

          {/* Estadísticas Impresionantes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 animate-pulse">4</div>
              <div className="text-blue-200 text-sm">{t('hero.stat.ai')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 animate-pulse">100%</div>
              <div className="text-blue-200 text-sm">{t('hero.stat.manipulation')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 animate-pulse">∞</div>
              <div className="text-blue-200 text-sm">{t('hero.stat.connections')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 animate-pulse">PWA</div>
              <div className="text-blue-200 text-sm">{t('hero.stat.app')}</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onJoinAgora}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
            >
              {t('hero.cta.agora')}
            </button>
            <button
              onClick={onExploreBoulevard}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
            >
              {t('hero.cta.boulevard')}
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p className="text-white/70 text-sm mt-2">{t('hero.scroll')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}