import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Business } from '../types';
import TrustScoreBadge from './TrustScoreBadge';

interface BusinessCardProps {
  business: Business;
  onContact: (business: Business) => void;
}

const BusinessCard = React.memo(function BusinessCard({ business, onContact }: BusinessCardProps) {
  const { t } = useLanguage();

  // Validación de datos
  if (!business || !business.name) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100/50 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            {business.avatar_url ? (
              <img
                src={business.avatar_url}
                alt={business.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${business.avatar_url ? 'hidden' : ''}`}>
              {business.name?.charAt(0) || '?'}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
<<<<<<< HEAD
              <h3 className="text-xl font-bold text-gray-900">{t('lang') === 'en' && business.name_en ? business.name_en : business.name}</h3>
              <TrustScoreBadge score={business.trust_score || 80} size="small" showDetails />
            </div>
            <p className="text-emerald-600 font-medium">{t('lang') === 'en' && business.category_en ? business.category_en : business.category || 'Servicios'}</p>
=======
              <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
              <TrustScoreBadge score={business.trust_score || 80} size="small" showDetails />
            </div>
            <p className="text-emerald-600 font-medium">{business.category || 'Servicios'}</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            {business.subscription_tier && business.subscription_tier !== 'free' && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                {business.subscription_tier.toUpperCase()}
              </span>
            )}
          </div>
        </div>

<<<<<<< HEAD
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{t('lang') === 'en' && business.description_en ? business.description_en : business.description || 'Sin descripción'}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(t('lang') === 'en' && business.products_services_en ? business.products_services_en : business.products_services || []).slice(0, 3).map((service, index) => (
=======
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{business.description || 'Sin descripción'}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(business.products_services || []).slice(0, 3).map((service, index) => (
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            <span
              key={index}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
            >
              {service}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => onContact(business)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            💬 {t('business.card.contact')}
          </button>
          {business.location && (
            <span className="text-xs text-gray-500 flex items-center">
              📍 {business.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default BusinessCard;