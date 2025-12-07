import React, { useState, useEffect } from 'react';
import type { Project } from '../types';

interface ProjectSearchBarProps {
  projects: Project[];
  onSearchResults: (results: Project[]) => void;
}

export default function ProjectSearchBar({ projects, onSearchResults }: ProjectSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      onSearchResults(projects);
      return;
    }

    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    onSearchResults(filtered);
  }, [searchTerm, projects, onSearchResults]);

  const suggestions = [
    'Inteligencia Artificial',
    'Sostenibilidad',
    'Salud Mental',
    'Educación',
    'Emprendimiento',
    'Tecnología',
    'Arte Digital',
    'Innovación Social'
  ];

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
          💡
        </div>
        <input
          type="text"
          placeholder="Buscar proyectos por tema, categoría, o palabras clave..."
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

      {/* Suggestions */}
      {showSuggestions && searchTerm.length < 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">💡 Temas populares:</h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchTerm(suggestion)}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}