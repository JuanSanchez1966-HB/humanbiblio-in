import { useState, useMemo, useCallback } from 'react';
import type { User, Business } from '../types';

interface SearchFilters {
  category?: string;
  location?: string;
  interests?: string[];
  profession?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
  distance?: number;
}

interface SearchResult<T> {
  item: T;
  score: number;
  matchedFields: string[];
  relevance: 'high' | 'medium' | 'low';
}

export function useAdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Función de búsqueda inteligente para usuarios
  const searchUsers = useCallback((users: User[], term: string, filters: SearchFilters = {}): SearchResult<User>[] => {
    if (!term.trim() && Object.keys(filters).length === 0) {
      return users.map(user => ({ item: user, score: 100, matchedFields: [], relevance: 'high' as const }));
    }

    const searchTermLower = term.toLowerCase();
    const results: SearchResult<User>[] = [];

    users.forEach(user => {
      let score = 0;
      const matchedFields: string[] = [];

      // Búsqueda en nombre (peso alto)
      if (user.full_name.toLowerCase().includes(searchTermLower)) {
        score += 50;
        matchedFields.push('nombre');
      }

      // Búsqueda en profesión (peso alto)
      if (user.profession?.toLowerCase().includes(searchTermLower)) {
        score += 40;
        matchedFields.push('profesión');
      }

      // Búsqueda en biografía (peso medio)
      if (user.bio?.toLowerCase().includes(searchTermLower)) {
        score += 25;
        matchedFields.push('biografía');
      }

      // Búsqueda en intereses (peso medio)
      const matchingInterests = user.interests?.filter(interest => 
        interest.toLowerCase().includes(searchTermLower)
      ) || [];
      if (matchingInterests.length > 0) {
        score += matchingInterests.length * 15;
        matchedFields.push('intereses');
      }

      // Búsqueda en ubicación (peso bajo)
      if (user.location?.toLowerCase().includes(searchTermLower)) {
        score += 10;
        matchedFields.push('ubicación');
      }

      // Búsqueda fuzzy (coincidencias parciales)
      const fuzzyMatches = calculateFuzzyMatch(searchTermLower, [
        user.full_name,
        user.profession || '',
        user.bio || '',
        ...(user.interests || [])
      ].join(' ').toLowerCase());
      
      if (fuzzyMatches > 0.3) {
        score += fuzzyMatches * 20;
        matchedFields.push('coincidencia parcial');
      }

      // Aplicar filtros
      if (filters.profession && user.profession?.toLowerCase() !== filters.profession.toLowerCase()) {
        score *= 0.5;
      }

      if (filters.location && user.location?.toLowerCase() !== filters.location.toLowerCase()) {
        score *= 0.7;
      }

      if (filters.interests && filters.interests.length > 0) {
        const commonInterests = user.interests?.filter(interest => 
          filters.interests!.some(filterInterest => 
            interest.toLowerCase().includes(filterInterest.toLowerCase())
          )
        ) || [];
        if (commonInterests.length === 0) {
          score *= 0.3;
        } else {
          score += commonInterests.length * 10;
        }
      }

      // Solo incluir si hay alguna coincidencia
      if (score > 0 || matchedFields.length > 0) {
        const relevance = score > 60 ? 'high' : score > 30 ? 'medium' : 'low';
        results.push({ item: user, score, matchedFields, relevance });
      }
    });

    // Ordenar por score descendente
    return results.sort((a, b) => b.score - a.score);
  }, []);

  // Función de búsqueda inteligente para negocios
  const searchBusinesses = useCallback((businesses: Business[], term: string, filters: SearchFilters = {}): SearchResult<Business>[] => {
    if (!term.trim() && Object.keys(filters).length === 0) {
      return businesses.map(business => ({ item: business, score: 100, matchedFields: [], relevance: 'high' as const }));
    }

    const searchTermLower = term.toLowerCase();
    const results: SearchResult<Business>[] = [];

    businesses.forEach(business => {
      let score = 0;
      const matchedFields: string[] = [];

      // Búsqueda en nombre del negocio (peso alto)
      if (business.name.toLowerCase().includes(searchTermLower)) {
        score += 50;
        matchedFields.push('nombre');
      }

      // Búsqueda en categoría (peso alto)
      if (business.category.toLowerCase().includes(searchTermLower)) {
        score += 45;
        matchedFields.push('categoría');
      }

      // Búsqueda en descripción (peso medio)
      if (business.description.toLowerCase().includes(searchTermLower)) {
        score += 30;
        matchedFields.push('descripción');
      }

      // Búsqueda en productos/servicios (peso alto)
      const matchingServices = business.products_services.filter(service => 
        service.toLowerCase().includes(searchTermLower)
      );
      if (matchingServices.length > 0) {
        score += matchingServices.length * 20;
        matchedFields.push('productos/servicios');
      }

      // Búsqueda en ubicación (peso medio)
      if (business.location?.toLowerCase().includes(searchTermLower)) {
        score += 15;
        matchedFields.push('ubicación');
      }

      // Búsqueda en contacto (peso bajo)
      if (business.contact_email?.toLowerCase().includes(searchTermLower)) {
        score += 10;
        matchedFields.push('contacto');
      }

      // Búsqueda fuzzy
      const fuzzyMatches = calculateFuzzyMatch(searchTermLower, [
        business.name,
        business.category,
        business.description,
        ...business.products_services,
        business.location || ''
      ].join(' ').toLowerCase());
      
      if (fuzzyMatches > 0.3) {
        score += fuzzyMatches * 25;
        matchedFields.push('coincidencia parcial');
      }

      // Aplicar filtros
      if (filters.category && business.category.toLowerCase() !== filters.category.toLowerCase()) {
        score *= 0.5;
      }

      if (filters.location && business.location?.toLowerCase() !== filters.location.toLowerCase()) {
        score *= 0.7;
      }

      // Boost para negocios destacados
      if (business.is_featured) {
        score += 15;
        matchedFields.push('destacado');
      }

      // Solo incluir si hay alguna coincidencia
      if (score > 0 || matchedFields.length > 0) {
        const relevance = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
        results.push({ item: business, score, matchedFields, relevance });
      }
    });

    // Ordenar por score descendente
    return results.sort((a, b) => b.score - a.score);
  }, []);

  // Función de coincidencia fuzzy simple
  const calculateFuzzyMatch = (search: string, text: string): number => {
    if (search.length === 0) return 0;
    if (text.includes(search)) return 1;

    let matches = 0;
    const searchWords = search.split(' ').filter(word => word.length > 2);
    
    searchWords.forEach(word => {
      if (text.includes(word)) {
        matches += 1;
      }
    });

    return matches / searchWords.length;
  };

  // Sugerencias de búsqueda
  const getSearchSuggestions = useCallback((users: User[], businesses: Business[], currentTerm: string) => {
    const suggestions: string[] = [];
    const termLower = currentTerm.toLowerCase();

    if (termLower.length < 2) return [];

    // Sugerencias de profesiones
    const professions = [...new Set(users.map(u => u.profession).filter(Boolean))];
    professions.forEach(profession => {
      if (profession!.toLowerCase().includes(termLower)) {
        suggestions.push(profession!);
      }
    });

    // Sugerencias de categorías de negocios
    const categories = [...new Set(businesses.map(b => b.category))];
    categories.forEach(category => {
      if (category.toLowerCase().includes(termLower)) {
        suggestions.push(category);
      }
    });

    // Sugerencias de intereses
    const allInterests = users.flatMap(u => u.interests || []);
    const uniqueInterests = [...new Set(allInterests)];
    uniqueInterests.forEach(interest => {
      if (interest.toLowerCase().includes(termLower)) {
        suggestions.push(interest);
      }
    });

    // Sugerencias de servicios
    const allServices = businesses.flatMap(b => b.products_services);
    const uniqueServices = [...new Set(allServices)];
    uniqueServices.forEach(service => {
      if (service.toLowerCase().includes(termLower)) {
        suggestions.push(service);
      }
    });

    return [...new Set(suggestions)].slice(0, 8);
  }, []);

  // Agregar término al historial
  const addToHistory = useCallback((term: string) => {
    if (term.trim() && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev.slice(0, 9)]); // Máximo 10 términos
    }
  }, [searchHistory]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  return {
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
  };
}