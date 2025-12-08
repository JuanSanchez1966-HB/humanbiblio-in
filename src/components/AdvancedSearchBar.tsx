import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { useLanguage } from '../contexts/LanguageContext';
<<<<<<< HEAD
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
import type { User, Business } from '../types';

interface AdvancedSearchBarProps {
  users: User[];
  businesses: Business[];
  activeSection: 'agora' | 'boulevard';
  onSearchResults: (results: { users: User[]; businesses: Business[] }) => void;
  className?: string;
}

export default function AdvancedSearchBar({ 
  users, 
  businesses, 
  activeSection, 
  onSearchResults,
  className = ''
}: AdvancedSearchBarProps) {
  const { t } = useLanguage();
<<<<<<< HEAD
  const { user } = useAuth();
  const { logAction } = useAnalytics({ userId: user?.id });
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    searchHistory,
    searchUsers,
    searchBusinesses,
    getSearchSuggestions,
    addToHistory,
    clearSearch
  } = useAdvancedSearch();

  // Ejecutar búsqueda cuando cambie el término o filtros
  useEffect(() => {
    setIsSearching(true);

    // Debounce para evitar búsquedas excesivas
    const timeoutId = setTimeout(() => {
      if (!searchTerm && Object.keys(filters).length === 0) {
        onSearchResults({ users, businesses });
        setIsSearching(false);
        return;
      }

      const userResults = searchUsers(users, searchTerm, filters);
      const businessResults = searchBusinesses(businesses, searchTerm, filters);

      onSearchResults({
        users: userResults.map(r => r.item),
        businesses: businessResults.map(r => r.item)
      });

<<<<<<< HEAD
      if (searchTerm) {
        logAction(`search_${activeSection}`, null, {
          query: searchTerm,
          userResults: userResults.length,
          businessResults: businessResults.length,
          filters: Object.keys(filters).length > 0 ? filters : undefined
        });
      }

=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, users, businesses, searchUsers, searchBusinesses, onSearchResults]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = getSearchSuggestions(users, businesses, searchTerm);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    addToHistory(term);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addToHistory(searchTerm);
      setShowSuggestions(false);
    }
  };

  const getPlaceholder = () => {
    if (activeSection === 'agora') {
      return t('agora.search.placeholder');
    } else {
      return t('boulevard.search.placeholder');
    }
  };

  const getSearchIcon = () => {
    return activeSection === 'agora' ? '👥' : '🛍️';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
          {getSearchIcon()}
        </div>
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-14 pr-20 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
        />
        
        {/* Botones de acción */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {isSearching && (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          )}
          {searchTerm && !isSearching && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title={t('search.clear')}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full transition-colors ${
              showFilters || Object.keys(filters).length > 0
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title={t('search.filters')}
          >
            🔧
          </button>
        </div>
      </div>

      {/* Sugerencias de búsqueda */}
      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          {/* Sugerencias automáticas */}
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                {t('search.suggestions')}
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-700 hover:text-blue-700"
                  >
                    <span className="mr-2">🔍</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Historial de búsqueda */}
          {searchHistory.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">🕒</span>
                {t('search.recent')}
              </h4>
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                  >
                    <span className="mr-2">🕒</span>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtros avanzados */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔧</span>
            {t('search.filters')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por categoría/profesión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeSection === 'agora' ? t('form.profession') : t('business.form.category')}
              </label>
              <select
                value={activeSection === 'agora' ? filters.profession || '' : filters.category || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  [activeSection === 'agora' ? 'profession' : 'category']: e.target.value || undefined
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('search.all.categories')}</option>
                {activeSection === 'agora' ? (
                  [...new Set(users.map(u => u.profession).filter(Boolean))].map(profession => (
                    <option key={profession} value={profession}>{profession}</option>
                  ))
                ) : (
                  [...new Set(businesses.map(b => b.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))
                )}
              </select>
            </div>

            {/* Filtro por ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.location')}
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  location: e.target.value || undefined
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('search.all.locations')}</option>
                {[...new Set([
                  ...users.map(u => u.location).filter(Boolean),
                  ...businesses.map(b => b.location).filter(Boolean)
                ])].map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Filtro por intereses (solo Ágora) */}
            {activeSection === 'agora' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.interests')}
                </label>
                <select
                  onChange={(e) => {
                    const interest = e.target.value;
                    if (interest) {
                      setFilters(prev => ({
                        ...prev,
                        interests: prev.interests ? [...prev.interests, interest] : [interest]
                      }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('search.add.interest')}</option>
                  {[...new Set(users.flatMap(u => u.interests || []))].map(interest => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
                {filters.interests && filters.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.interests.map((interest, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {interest}
                        <button
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            interests: prev.interests?.filter(i => i !== interest)
                          }))}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botones de filtros */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t('search.clear')}
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('search.apply')}
            </button>
          </div>
        </div>
      )}

      {/* Indicadores de búsqueda activa */}
      {(searchTerm || Object.keys(filters).length > 0) && (
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm text-gray-600">{t('search.active')}:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              🔍 "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            const displayValue = Array.isArray(value) ? value.join(', ') : value;
            return (
              <span key={key} className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                {key}: {displayValue}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, [key]: undefined }))}
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}