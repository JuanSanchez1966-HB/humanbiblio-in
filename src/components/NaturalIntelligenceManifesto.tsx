import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LogoComponent from './LogoComponent';

export default function NaturalIntelligenceManifesto() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-8 border border-indigo-200/50 shadow-xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <LogoComponent 
            size="hero"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          <span className="leading-relaxed block" style={{ lineHeight: '1.4', paddingBottom: '0.2rem' }}>{t('manifesto.title')}</span>
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          {t('manifesto.subtitle')} {t('manifesto.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Problema de las redes tradicionales */}
        <div className="bg-white/70 rounded-2xl p-6 border border-red-200/50">
          <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
            <span className="mr-3">⚠️</span>
            {t('manifesto.problem.title')}
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">❌</span>
              <span><strong>{t('manifesto.channel.problem')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">❌</span>
              <span><strong>{t('manifesto.attention.economy')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">❌</span>
              <span><strong>{t('manifesto.intrusive.ads')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">❌</span>
              <span><strong>{t('manifesto.cognitive.dissonance')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">❌</span>
              <span><strong>{t('manifesto.subverted.communication')}</strong></span>
            </div>
          </div>
        </div>

        {/* Solución HUMANBIBLIO */}
        <div className="bg-white/70 rounded-2xl p-6 border border-green-200/50">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
            <span className="mr-3">✨</span>
            {t('manifesto.solution.title')}
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span>
              <span><strong>{t('manifesto.authentic.communication')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span>
              <span><strong>{t('manifesto.natural.intelligence')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span>
              <span><strong>{t('manifesto.organic.commerce')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span>
              <span><strong>{t('manifesto.conscious.connections')}</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✅</span>
              <span><strong>{t('manifesto.creative.freedom')}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-3">🌟 {t('manifesto.mission.title')}</h3>
        <p className="text-blue-100 leading-relaxed">
          {t('manifesto.mission.description')}
        </p>
      </div>
    </div>
  );
}