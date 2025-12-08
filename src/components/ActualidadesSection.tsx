import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import UniverseProfileCard from './UniverseProfileCard';
import type { UniverseProfile, ProjectFunder } from '../types';

interface ActualidadesSectionProps {
  profiles: UniverseProfile[];
  onLike: (profileId: string) => void;
  onContact: (profile: UniverseProfile) => void;
  onFunderClick?: (funder: ProjectFunder) => void;
}

export default function ActualidadesSection({ profiles, onLike, onContact, onFunderClick }: ActualidadesSectionProps) {
  const { t } = useLanguage();
  
  // Ordenar por likes y mostrar los más populares
  const trendingProfiles = profiles
    .sort((a, b) => b.likes_count - a.likes_count)
    .slice(0, 12);

  const topProject = trendingProfiles[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-4">🔥</div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('universe.news.title')}</h3>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('universe.news.subtitle')}
        </p>
      </div>

      {/* Proyecto Destacado */}
      {topProject && (
        <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h4 className="text-2xl font-bold mb-2">Proyecto Más Popular</h4>
            <h4 className="text-2xl font-bold mb-2">{t('universe.most.popular')}</h4>
            <p className="text-orange-100">{t('universe.most.popular.subtitle')}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                {topProject.user_avatar ? (
                  <img 
                    src={topProject.user_avatar} 
                    alt={topProject.user_name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {topProject.user_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h5 className="text-2xl font-bold">{topProject.topic}</h5>
                <p className="text-orange-100">por {topProject.user_name} • {topProject.user_profession}</p>
              </div>
            </div>

            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              {topProject.description.substring(0, 200)}...
            </p>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{topProject.likes_count}</div>
                <div className="text-orange-200">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{topProject.contact_count}</div>
                <div className="text-orange-200">Contactos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.floor(Math.random() * 50) + 20}</div>
                <div className="text-orange-200">Conversaciones</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {topProject.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => onLike(topProject.id)}
                  className="px-6 py-2 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-semibold"
                >
                  👍 Like
                </button>
                <button
                  onClick={() => onContact(topProject)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
                >
                  🤝 Colaborar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Proyectos Trending */}
      <div>
        <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">📈</span>
          {t('universe.trending.projects')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProfiles.slice(1).map((profile, index) => (
            <div key={profile.id} className="relative">
              <UniverseProfileCard
                profile={profile}
                onLike={onLike}
                onContact={onContact}
                onFunderClick={onFunderClick}
                showHJBadge={true}
              />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                #{index + 2} Trending
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas de la Comunidad */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
        <div className="text-5xl mb-4">🌍</div>
        <h4 className="text-2xl font-bold mb-4">{t('universe.community.impact')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold">{profiles.length}</div>
            <div className="text-indigo-200">{t('universe.active.projects')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{profiles.reduce((sum, p) => sum + p.likes_count, 0)}</div>
            <div className="text-indigo-200">{t('universe.total.likes')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{profiles.reduce((sum, p) => sum + p.contact_count, 0)}</div>
            <div className="text-indigo-200">{t('universe.connections')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{profiles.filter(p => p.is_seeking_partners).length}</div>
            <div className="text-indigo-200">{t('universe.seeking.partners')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}