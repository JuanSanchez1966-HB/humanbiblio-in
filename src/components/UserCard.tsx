import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { User } from '../types';
import TrustScoreBadge from './TrustScoreBadge';

interface UserCardProps {
  user: User;
  onMessage: (user: User) => void;
  onCall: (user: User) => void;
  onVideoCall: (user: User) => void;
}

const UserCard = React.memo(function UserCard({ user, onMessage, onCall, onVideoCall }: UserCardProps) {
  const { t } = useLanguage();

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100/50 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          {/* Botón WB Verde - Reposicionado */}
          {user.is_wb_seller && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('🟢 CLICK EN BOTÓN WB PARA:', user.full_name);

                // Disparar evento personalizado
                const event = new CustomEvent('navigateToWBProfile', {
                  detail: { user }
                });
                window.dispatchEvent(event);
              }}
              className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1 shadow-lg z-10 transition-all duration-300 transform hover:scale-110"
              title={t('user.card.wb.view').replace('{name}', user.full_name)}
            >
              <span className="bg-white text-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">WB</span>
              <span>{t('user.card.wb.sells')}</span>
            </button>
          )}

          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${user.avatar_url ? 'hidden' : ''}`}>
              {user.full_name.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
              <TrustScoreBadge score={user.trust_score || 75} size="small" showDetails />
            </div>
<<<<<<< HEAD
            <p className="text-blue-600 font-medium">{t('lang') === 'en' && user.profession_en ? user.profession_en : user.profession}</p>
=======
            <p className="text-blue-600 font-medium">{user.profession}</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            {/* Información Cultural Global */}
            <div className="flex items-center space-x-2 mt-1">
              {user.country_flag && (
                <span className="text-lg" title={user.country}>
                  {user.country_flag}
                </span>
              )}
              {user.native_language && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {user.native_language}
                </span>
              )}
              {user.languages_spoken && user.languages_spoken.length > 1 && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                  +{user.languages_spoken.length - 1} idiomas
                </span>
              )}
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{t('lang') === 'en' && user.bio_en ? user.bio_en : user.bio}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(t('lang') === 'en' && user.interests_en ? user.interests_en : user.interests).slice(0, 3).map((interest, index) => (
=======
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{user.bio}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {user.interests.slice(0, 3).map((interest, index) => (
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
            >
              {interest}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onMessage(user)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title={t('user.card.message')}
            >
              💬
            </button>
            <button
              onClick={() => onCall(user)}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title={t('user.card.call')}
            >
              📞
            </button>
            <button
              onClick={() => onVideoCall(user)}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title={t('user.card.video')}
            >
              📹
            </button>
            <button
              onClick={() => {
                // Abrir grabador de voz
                const event = new CustomEvent('openVoiceRecorder', { detail: { user } });
                window.dispatchEvent(event);
              }}
              className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              title={t('user.card.voice')}
            >
              🎤
            </button>
          </div>
          {user.location && (
            <span className="text-xs text-gray-500 flex items-center">
              📍 {user.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default UserCard;