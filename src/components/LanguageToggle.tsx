import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-1">
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          language === 'es'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        🇪🇸 ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        🇺🇸 EN
      </button>
    </div>
  );
}