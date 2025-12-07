import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CallToActionSectionProps {
  onJoinAgora: () => void;
  onExploreBoulevard: () => void;
  onOpenDashboard: () => void;
}

export default function CallToActionSection({
  onJoinAgora,
  onExploreBoulevard,
  onOpenDashboard
}: CallToActionSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            {t('cta.title')}
          </h2>
          <p className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>
        </div>

        {/* Tres Caminos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Ágora */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏛️</div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('cta.agora.title')}</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              {t('cta.agora.desc')}
            </p>
            <div className="space-y-2 mb-8 text-sm text-blue-200">
              <div className="flex items-center justify-center">
                <span className="mr-2">✨</span>
                <span>{t('cta.agora.feature1')}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🎯</span>
                <span>{t('cta.agora.feature2')}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">📞</span>
                <span>{t('cta.agora.feature3')}</span>
              </div>
            </div>
            <button
              onClick={onJoinAgora}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-blue-500/25"
            >
              {t('cta.agora.button')}
            </button>
          </div>

          {/* Boulevard */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🛍️</div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('cta.boulevard.title')}</h3>
            <p className="text-emerald-100 mb-6 leading-relaxed">
              {t('cta.boulevard.desc')}
            </p>
            <div className="space-y-2 mb-8 text-sm text-emerald-200">
              <div className="flex items-center justify-center">
                <span className="mr-2">🌱</span>
                <span>{t('cta.boulevard.feature1')}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🎬</span>
                <span>{t('cta.boulevard.feature2')}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🤝</span>
                <span>{t('cta.boulevard.feature3')}</span>
              </div>
            </div>
            <button
              onClick={onExploreBoulevard}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-emerald-500/25"
            >
              {t('cta.boulevard.button')}
            </button>
          </div>

          {/* Dashboard */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('cta.dashboard.title')}</h3>
            <p className="text-purple-100 mb-6 leading-relaxed">
              {t('cta.dashboard.desc')}
            </p>
            <div className="space-y-2 mb-8 text-sm text-purple-200">
              <div className="flex items-center justify-center">
                <span className="mr-2">📈</span>
                <span>{t('cta.dashboard.feature1')}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🌍</span>
                <span>{t('cta.dashboard.feature2')}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🎯</span>
                <span>{t('cta.dashboard.feature3')}</span>
              </div>
            </div>
            <button
              onClick={onOpenDashboard}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-2xl hover:from-purple-600 hover:to-violet-700 transition-all duration-300 font-bold shadow-2xl hover:shadow-purple-500/25"
            >
              {t('cta.dashboard.button')}
            </button>
          </div>
        </div>

        {/* Mensaje Final Inspirador */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="text-center">
            <div className="text-5xl mb-6">🌍</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {t('cta.future.title')}
            </h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('cta.future.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}