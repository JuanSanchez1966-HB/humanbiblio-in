import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import BoulevardCarousel from './BoulevardCarousel';
import SponsorsCarousel from './SponsorsCarousel';
import type { Business, ProjectFunder } from '../types';

interface BoulevardTabsProps {
  businesses: Business[];
  sponsors: ProjectFunder[];
  onBusinessClick: (business: Business) => void;
  onSponsorClick: (sponsor: ProjectFunder) => void;
}

export default function BoulevardTabs({ 
  businesses, 
  sponsors, 
  onBusinessClick, 
  onSponsorClick 
}: BoulevardTabsProps) {
  const [activeTab, setActiveTab] = useState<'negocios' | 'financiadores'>('negocios');
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('negocios')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'negocios'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {t('boulevard.tabs.businesses')}
          </button>
          <button
            onClick={() => setActiveTab('financiadores')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'financiadores'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {t('boulevard.tabs.sponsors')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'negocios' ? (
        <BoulevardCarousel
          businesses={businesses}
          onBusinessClick={onBusinessClick}
        />
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('boulevard.sponsors.title')}
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t('boulevard.sponsors.description')}
            </p>
          </div>
          
          <SponsorsCarousel
            sponsors={sponsors}
            onSponsorClick={onSponsorClick}
          />

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 text-center">
            <h4 className="text-lg font-bold text-yellow-800 mb-3">
              {t('boulevard.sponsor.promotion.title')}
            </h4>
            <p className="text-yellow-700 mb-4">
              {t('boulevard.sponsor.promotion.description')}
            </p>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 rounded-xl font-semibold shadow-lg cursor-not-allowed">
              🚀 {t('boulevard.sponsor.promotion.button')} - Coming Soon
            </div>
          </div>
        </div>
      )}
    </div>
  );
}