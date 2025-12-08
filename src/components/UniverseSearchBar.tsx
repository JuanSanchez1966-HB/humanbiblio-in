import React, { useState, useEffect } from 'react';
import type { UniverseProfile } from '../types';

interface UniverseSearchBarProps {
  profiles: UniverseProfile[];
  onSearchResults: (results: UniverseProfile[]) => void;
}

export default function UniverseSearchBar({ profiles, onSearchResults }: UniverseSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      onSearchResults(profiles);
      return;
    }

    const filtered = profiles.filter(profile => 
      profile.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      profile.user_profession?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    onSearchResults(filtered);
  }, [searchTerm, profiles, onSearchResults]);

  const trendingTopics = [
    'Inteligencia Artificial',
    'Sostenibilidad',
    'Salud Mental',
    'Blockchain',
    'Educación',
    'Arte Digital',
    'Música Terapéutica',
    'Cocina Molecular',
    'Accesibilidad',
    'Emprendimiento Social'
  ];

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
          🔍
        </div>
        <input
          type="text"
          placeholder="Buscar proyectos, temas, ideas, colaboraciones..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-lg bg-white transition-all duration-300"
        />
        
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Trending Topics */}
      {showSuggestions && searchTerm.length < 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">🔥 Temas Trending:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSearchTerm(topic)}
                className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm hover:bg-purple-200 transition-colors text-left"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}