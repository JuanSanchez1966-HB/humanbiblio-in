import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { User, Business } from '../types';

interface MatchingDashboardProps {
  users: User[];
  businesses: Business[];
  onMessage: (recipient: User | Business) => void;
}

interface MatchScore {
  id: string;
  name: string;
  type: 'user' | 'business';
  score: number;
  reasons: string[];
  data: User | Business;
}

export default function MatchingDashboard({ users, businesses, onMessage }: MatchingDashboardProps) {
  const { userProfile } = useAuth();
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<MatchScore | null>(null);

  // Simular cálculo de compatibilidad con IA
  useEffect(() => {
    if (!userProfile) return;

    setLoading(true);
    
    // Simular tiempo de procesamiento de IA
    setTimeout(() => {
      const userMatches = calculateUserMatches(userProfile, users);
      const businessMatches = calculateBusinessMatches(userProfile, businesses);
      
      const allMatches = [...userMatches, ...businessMatches]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Top 10 matches
      
      setMatches(allMatches);
      setLoading(false);
    }, 2000);
  }, [userProfile, users, businesses]);

  const calculateUserMatches = (currentUser: User, allUsers: User[]): MatchScore[] => {
    return allUsers
      .filter(user => user.id !== currentUser.id)
      .map(user => {
        let score = 0;
        const reasons: string[] = [];

        // Compatibilidad por intereses
        const commonInterests = currentUser.interests?.filter(interest => 
          user.interests?.includes(interest)
        ) || [];
        
        if (commonInterests.length > 0) {
          score += commonInterests.length * 15;
          reasons.push(`${commonInterests.length} intereses en común: ${commonInterests.slice(0, 2).join(', ')}`);
        }

        // Compatibilidad por profesión
        if (currentUser.profession && user.profession) {
          const professionSimilarity = calculateProfessionSimilarity(currentUser.profession, user.profession);
          score += professionSimilarity;
          if (professionSimilarity > 10) {
            reasons.push('Profesiones complementarias');
          }
        }

        // Compatibilidad por ubicación (simulada)
        const locationBonus = Math.random() * 20;
        score += locationBonus;
        if (locationBonus > 15) {
          reasons.push('Ubicación cercana');
        }

        // Factor de actividad (simulado)
        const activityBonus = Math.random() * 15;
        score += activityBonus;

        // Normalizar score a porcentaje
        const finalScore = Math.min(100, Math.max(0, score));

        return {
          id: user.id,
          name: user.full_name,
          type: 'user' as const,
          score: Math.round(finalScore),
          reasons: reasons.slice(0, 3),
          data: user
        };
      });
  };

  const calculateBusinessMatches = (currentUser: User, allBusinesses: Business[]): MatchScore[] => {
    return allBusinesses.map(business => {
      let score = 0;
      const reasons: string[] = [];

      // Compatibilidad por intereses del usuario con servicios del negocio
      const relevantServices = business.products_services.filter(service =>
        currentUser.interests?.some(interest => 
          service.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(service.toLowerCase())
        )
      );

      if (relevantServices.length > 0) {
        score += relevantServices.length * 20;
        reasons.push(`Servicios relevantes: ${relevantServices.slice(0, 2).join(', ')}`);
      }

      // Compatibilidad por profesión
      if (currentUser.profession) {
        const professionRelevance = calculateBusinessRelevance(currentUser.profession, business);
        score += professionRelevance;
        if (professionRelevance > 15) {
          reasons.push('Relevante para tu profesión');
        }
      }

      // Factor de calidad del negocio (simulado)
      const qualityScore = 60 + Math.random() * 30;
      score += qualityScore * 0.3;

      // Ubicación (simulada)
      const locationBonus = Math.random() * 15;
      score += locationBonus;
      if (locationBonus > 10) {
        reasons.push('Ubicación conveniente');
      }

      // Normalizar score a porcentaje
      const finalScore = Math.min(100, Math.max(0, score));

      return {
        id: business.id,
        name: business.name,
        type: 'business' as const,
        score: Math.round(finalScore),
        reasons: reasons.slice(0, 3),
        data: business
      };
    });
  };

  const calculateProfessionSimilarity = (prof1: string, prof2: string): number => {
    const techKeywords = ['desarrollador', 'programador', 'ingeniero', 'software', 'tech'];
    const healthKeywords = ['médico', 'psicólogo', 'enfermero', 'terapeuta', 'salud'];
    const businessKeywords = ['consultor', 'manager', 'director', 'ejecutivo', 'negocio'];
    
    const getCategory = (profession: string) => {
      const profLower = profession.toLowerCase();
      if (techKeywords.some(keyword => profLower.includes(keyword))) return 'tech';
      if (healthKeywords.some(keyword => profLower.includes(keyword))) return 'health';
      if (businessKeywords.some(keyword => profLower.includes(keyword))) return 'business';
      return 'other';
    };

    const cat1 = getCategory(prof1);
    const cat2 = getCategory(prof2);
    
    return cat1 === cat2 ? 25 : 10;
  };

  const calculateBusinessRelevance = (profession: string, business: Business): number => {
    const profLower = profession.toLowerCase();
    const businessLower = business.category.toLowerCase();
    const servicesLower = business.products_services.join(' ').toLowerCase();
    
    if (profLower.includes('desarrollador') && (businessLower.includes('tech') || servicesLower.includes('software'))) {
      return 30;
    }
    if (profLower.includes('psicólogo') && (businessLower.includes('salud') || servicesLower.includes('bienestar'))) {
      return 30;
    }
    if (profLower.includes('chef') && businessLower.includes('gastronomía')) {
      return 30;
    }
    
    return Math.random() * 20;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🔥';
    if (score >= 60) return '⭐';
    if (score >= 40) return '👍';
    return '🤔';
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              🧠
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          IA Analizando Compatibilidad
        </h3>
        <p className="text-gray-600 mb-4">
          Procesando perfiles y calculando matches personalizados...
        </p>
        <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span>Analizando intereses comunes</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Evaluando compatibilidad profesional</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>Calculando proximidad geográfica</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              <span>Generando recomendaciones personalizadas</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🎯 Matching con IA
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Nuestro algoritmo de IA ha analizado tu perfil y encontrado las mejores conexiones para ti.
        </p>
      </div>

      {/* Compatibility Score Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold mb-2">Compatibilidad Promedio</h3>
        <div className="text-5xl font-bold mb-2">
          {matches.length > 0 ? Math.round(matches.reduce((sum, match) => sum + match.score, 0) / matches.length) : 0}%
        </div>
        <p className="text-blue-100">
          Basado en {matches.length} perfiles analizados
        </p>
      </div>

      {/* Top Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((match, index) => (
          <div
            key={match.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
            onClick={() => setSelectedMatch(match)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    match.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  }`}>
                    {match.type === 'user' ? '👤' : '🏢'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{match.name}</h3>
                    <p className="text-sm text-gray-600">
                      {match.type === 'user' 
                        ? (match.data as User).profession 
                        : (match.data as Business).category
                      }
                    </p>
                    {/* Información Cultural en Matching */}
                    {match.type === 'user' && (match.data as User).country_flag && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-sm">{(match.data as User).country_flag}</span>
                        <span className="text-xs text-gray-500">{(match.data as User).country}</span>
                        {(match.data as User).languages_spoken && (match.data as User).languages_spoken!.length > 1 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {(match.data as User).languages_spoken!.length} idiomas
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(match.score)}`}>
                    <span className="mr-1">{getScoreEmoji(match.score)}</span>
                    {match.score}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    #{index + 1} match
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {match.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessage(match.data);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  💬 Conectar
                </button>
                
                <div className="text-xs text-gray-500">
                  {match.type === 'user' ? 'Persona' : 'Negocio'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {matches.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🤖</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No se encontraron matches
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Completa tu perfil con más información para obtener mejores recomendaciones de IA.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            Completar Perfil
          </button>
        </div>
      )}

      {/* Trending Topics */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Trending Topics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { topic: 'Inteligencia Artificial', count: 24, trend: '+15%' },
            { topic: 'Sostenibilidad', count: 18, trend: '+8%' },
            { topic: 'Emprendimiento', count: 31, trend: '+22%' },
            { topic: 'Bienestar Mental', count: 16, trend: '+12%' }
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-2xl font-bold text-blue-600">{item.count}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">{item.topic}</div>
              <div className="text-xs text-green-600 font-medium">{item.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 ${
                selectedMatch.type === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
                {selectedMatch.type === 'user' ? '👤' : '🏢'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMatch.name}</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(selectedMatch.score)}`}>
                <span className="mr-2">{getScoreEmoji(selectedMatch.score)}</span>
                {selectedMatch.score}% Compatible
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900">¿Por qué es un buen match?</h4>
              {selectedMatch.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start text-sm text-gray-700">
                  <span className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onMessage(selectedMatch.data);
                  setSelectedMatch(null);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                💬 Enviar Mensaje
              </button>
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}