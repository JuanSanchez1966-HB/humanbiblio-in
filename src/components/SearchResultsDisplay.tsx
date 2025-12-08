import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import UserCard from './UserCard';
import BusinessCard from './BusinessCard';
import LoadingCard from './LoadingCard';
import type { User, Business } from '../types';

interface SearchResultsDisplayProps {
  users: User[];
  businesses: Business[];
  activeSection: 'agora' | 'boulevard';
  searchTerm: string;
  onMessage: (recipient: User | Business) => void;
  onCall?: (user: User) => void;
  onVideoCall?: (user: User) => void;
  onContact?: (business: Business) => void;
  loading?: boolean;
}

export default function SearchResultsDisplay({
  users,
  businesses,
  activeSection,
  searchTerm,
  onMessage,
  onCall,
  onVideoCall,
  onContact,
  loading = false
}: SearchResultsDisplayProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="animate-pulse text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('search.loading')}
          </h3>
          <p className="text-gray-600 text-sm">
            {activeSection === 'agora'
              ? t('search.loading.profiles')
              : t('search.loading.businesses')
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingCard
            count={6}
            type={activeSection === 'agora' ? 'user' : 'business'}
          />
        </div>
      </div>
    );
  }

  const totalResults = users.length + businesses.length;
  const showUsers = activeSection === 'agora' || activeSection === 'boulevard';
  const showBusinesses = activeSection === 'boulevard';

  return (
    <div className="space-y-8">
      {/* Estadísticas de búsqueda */}
      {searchTerm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {totalResults} {t('search.results')} "{searchTerm}"
                </h3>
                <p className="text-gray-600">
                  {activeSection === 'agora' 
                    ? `${users.length} ${t('search.people.found')}`
                    : `${users.length} ${t('search.people')} + ${businesses.length} ${t('search.businesses')}`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{totalResults}</div>
              <div className="text-sm text-gray-500">{t('search.matches')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Resultados de Usuarios (Ágora) */}
      {showUsers && users.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">👥</span>
              {activeSection === 'agora' ? t('search.brilliant.minds') : t('search.professionals')}
              <span className="ml-2 text-lg text-blue-600">({users.length})</span>
            </h3>
            {searchTerm && (
              <div className="text-sm text-gray-600">
                {t('search.ordered.relevance')}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onMessage={onMessage}
                onCall={onCall || (() => {})}
                onVideoCall={onVideoCall || (() => {})}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resultados de Negocios (World Boulevard) */}
      {showBusinesses && businesses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🛍️</span>
              {t('search.unique.businesses')}
              <span className="ml-2 text-lg text-emerald-600">({businesses.length})</span>
            </h3>
            {searchTerm && (
              <div className="text-sm text-gray-600">
                {t('search.ordered.relevance')}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onContact={onContact || (() => {})}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {totalResults === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('search.no.results')}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {t('search.no.results.description').replace('{section}', activeSection === 'agora' ? t('search.people') : t('search.businesses')).replace('{term}', searchTerm)}
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">💡 {t('search.suggestions')}:</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• {t('search.tip.spelling')}</p>
                <p>• {t('search.tip.general')}</p>
                <p>• {t('search.tip.synonyms')}</p>
                <p>• {t('search.tip.filters')}</p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 {t('search.show.all')}
            </button>
          </div>
        </div>
      )}

      {/* Búsquedas populares */}
      {!searchTerm && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <span className="mr-2">🔥</span>
            {t('search.popular')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeSection === 'agora' ? [
              'Psychology', 'Development', 'Design', 'Music', 'Cooking', 'Technology', 'Art', 'Consulting'
            ] : [
              'Gastronomy', 'Technology', 'Health', 'Music', 'Consulting', 'Art', 'Education', 'Services'
            ].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}