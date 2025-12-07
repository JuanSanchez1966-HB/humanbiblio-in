import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import FundersShowcase from './FundersShowcase';
import type { UniverseProfile } from '../types';

interface UniverseProfileCardProps {
  profile: UniverseProfile;
  onLike: (profileId: string) => void;
  onContact: (profile: UniverseProfile) => void;
  onFunderClick?: (funder: any) => void;
  showHJBadge?: boolean;
}

export default function UniverseProfileCard({ 
  profile, 
  onLike, 
  onContact, 
  onFunderClick,
  showHJBadge = false 
}: UniverseProfileCardProps) {
  const { t } = useLanguage();

  const getLookingForColor = () => {
    switch (profile.looking_for) {
      case 'funding': return 'from-green-500 to-emerald-600';
      case 'partnership': return 'from-blue-500 to-indigo-600';
      case 'collaboration': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLookingForText = () => {
    switch (profile.looking_for) {
      case 'funding': return `💰 ${t('project.looking.funding')}`;
      case 'partnership': return `🤝 ${t('project.looking.partners')}`;
      case 'collaboration': return `👥 ${t('project.looking.collaboration')}`;
      default: return `💬 ${t('project.looking.discussion')}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative">
      {/* Distintivo HJ */}
      {profile.is_seeking_partners && showHJBadge && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs px-3 py-1 rounded-full font-bold z-10 shadow-lg">
          🤝 HJ
        </div>
      )}

      <div className="p-6">
        {/* Header del perfil */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            {profile.user_avatar ? (
              <img 
                src={profile.user_avatar} 
                alt={profile.user_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center text-white text-lg font-bold ${profile.user_avatar ? 'hidden' : ''}`}>
              {profile.user_name.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{profile.user_name}</h3>
            <p className="text-purple-600 font-medium text-sm">{profile.user_profession}</p>
          </div>
        </div>

        {/* Tema/Proyecto */}
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{profile.topic}</h4>
          {profile.project_title && (
            <p className="text-sm text-indigo-600 font-semibold mb-2">
              📋 Proyecto: {profile.project_title}
            </p>
          )}
          <p className="text-gray-600 text-sm line-clamp-3">{profile.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Financiadores si el proyecto está financiado */}
        {profile.is_funded && profile.funders && profile.funders.length > 0 && onFunderClick && (
          <div className="mb-4">
            <FundersShowcase
              funders={profile.funders}
              onFunderClick={onFunderClick}
              maxDisplay={3}
              title={`🏆 ${t('project.funded.by')}`}
            />
          </div>
        )}

        {/* Status y métricas */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 bg-gradient-to-r ${getLookingForColor()} text-white rounded-full text-xs font-bold`}>
            {getLookingForText()}
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="mr-1">👍</span>
              {profile.likes_count}
            </span>
            <span className="flex items-center">
              <span className="mr-1">💬</span>
              {profile.contact_count}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
          <button
            onClick={() => onLike(profile.id)}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            👍 {t('project.like')}
          </button>
          <button
            onClick={() => onContact(profile)}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
          >
            💬 {t('project.contact')}
          </button>
        </div>

        {/* Tiempo */}
        <div className="mt-3 text-xs text-gray-500 text-center">
          {t('project.published')} {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}