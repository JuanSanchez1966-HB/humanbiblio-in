import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NearbyExplorer from './NearbyExplorer';
import MatchingDashboard from './MatchingDashboard';
import ComingSoonCard from './ComingSoonCard';
import { useUsers, useBusinesses } from '../hooks/useSupabaseData'; import { isDemoMode } from '../lib/supabase';
import { useIntelligentConversations } from '../hooks/useIntelligentConversations';
import { useLanguage } from '../contexts/LanguageContext';
import type { User, Business } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'nearby' | 'matching'>('overview');
  const { users } = useUsers();
  const { businesses } = useBusinesses();
  const { findOrCreateConversation } = useIntelligentConversations(user?.id || null);
  const [chatState, setChatState] = useState<{
    recipient: User | Business | null;
    conversationId: string | null;
  }>({ recipient: null, conversationId: null });

  const handleMessage = async (recipient: User | Business) => {
    if (!user) {
      alert('Debes iniciar sesión para enviar mensajes');
      return;
    }

    try {
      const recipientId = 'bio' in recipient ? recipient.id : recipient.owner_id;
      if (!recipientId) {
        alert('Error: No se pudo identificar al destinatario');
        return;
      }

      let conversationId: string | null = null;
if (isDemoMode) {
  // Generar un ID de conversación simulado para el modo demo
  conversationId = `demo-conv-${user.id}-${recipientId}-${Date.now()}`;
  console.log('🎭 Modo Demo: Usando ID de conversación simulado:', conversationId);
} else {
  // En modo producción, intentar crear/encontrar la conversación real
  conversationId = await findOrCreateConversation(recipientId);
}

if (!conversationId) {
  alert('Error al crear la conversación. Inténtalo de nuevo.');
  return;
}
      setChatState({ recipient, conversationId });
    } catch (error) {
      console.error('Error opening chat:', error);
      alert('Error al abrir el chat. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📊 Dashboard Personal
        </h1>
        <p className="text-xl text-gray-600">
          Bienvenido, {user?.full_name || 'Usuario'}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            📊 Resumen
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'nearby'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🌍 Cerca de Mí
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'matching'
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🎯 Matching IA
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    👥
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Conexiones</h3>
                    <p className="text-gray-600">Personas conectadas</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600">12</div>
                <div className="text-xs text-gray-500 mt-1">🌍 5 países</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    💬
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mensajes</h3>
                    <p className="text-gray-600">Conversaciones activas</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600">8</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Valoración</h3>
                    <p className="text-gray-600">Puntuación promedio</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600">4.8</div>
                <div className="text-xs text-gray-500 mt-1">🗣️ 8 idiomas</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'es' ? 'Actividad Reciente' : 'Recent Activity'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {language === 'es' ? 'Nueva conexión con Ana García' : 'New connection with Ana García'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'es' ? 'Hace 2 horas' : '2 hours ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    💬
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {language === 'es' ? 'Mensaje de Carlos Rodríguez' : 'Message from Carlos Rodríguez'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'es' ? 'Hace 4 horas' : '4 hours ago'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                {language === 'es' ? '🚀 Próximas Funcionalidades' : '🚀 Coming Soon'}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                {language === 'es'
                  ? 'Ayúdanos a priorizar las funcionalidades que más te interesan'
                  : 'Help us prioritize the features you care about most'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calls & Video */}
                <ComingSoonCard
                  icon="📞"
                  title="Llamadas y Videollamadas"
                  titleEn="Calls & Video Calls"
                  description="Conecta por voz o video directamente desde la app, sin necesidad de intercambiar números de teléfono."
                  descriptionEn="Connect by voice or video directly from the app, no need to exchange phone numbers."
                  features={[
                    'Llamadas de voz HD',
                    'Videollamadas 1080p',
                    'Grabación de conversaciones',
                    'Compartir pantalla'
                  ]}
                  featuresEn={[
                    'HD voice calls',
                    '1080p video calls',
                    'Conversation recording',
                    'Screen sharing'
                  ]}
                  launchDate={language === 'es' ? 'Febrero 2025' : 'February 2025'}
                  featureName="calls"
                  gradient="from-blue-500 to-indigo-600"
                />

                {/* Real-Time Translation */}
                <ComingSoonCard
                  icon="🌐"
                  title="Traducción en Tiempo Real"
                  titleEn="Real-Time Translation"
                  description="Habla en tu idioma, la otra persona escucha en el suyo. IA que rompe barreras lingüísticas."
                  descriptionEn="Speak in your language, the other person hears in theirs. AI that breaks language barriers."
                  features={[
                    'Traducción simultánea en llamadas',
                    'Subtítulos automáticos',
                    '30+ idiomas soportados',
                    'Preserva contexto y matices'
                  ]}
                  featuresEn={[
                    'Simultaneous translation in calls',
                    'Automatic subtitles',
                    '30+ supported languages',
                    'Preserves context and nuance'
                  ]}
                  launchDate={language === 'es' ? 'Marzo 2025' : 'March 2025'}
                  featureName="translation"
                  gradient="from-emerald-500 to-teal-600"
                />

                {/* Intelligent CRM */}
                <ComingSoonCard
                  icon="📊"
                  title="CRM Inteligente"
                  titleEn="Intelligent CRM"
                  description="Gestiona contactos profesionales con IA que sugiere cuándo y cómo hacer seguimiento."
                  descriptionEn="Manage professional contacts with AI that suggests when and how to follow up."
                  features={[
                    'Historial completo de interacciones',
                    'Recordatorios automáticos',
                    'Analytics de relaciones',
                    'Notas y etiquetas privadas'
                  ]}
                  featuresEn={[
                    'Complete interaction history',
                    'Automatic reminders',
                    'Relationship analytics',
                    'Private notes and tags'
                  ]}
                  launchDate={language === 'es' ? 'Abril 2025' : 'April 2025'}
                  featureName="crm"
                  gradient="from-purple-500 to-violet-600"
                />

                {/* YANA - Community Crowdfunding */}
                <ComingSoonCard
                  icon="🌌"
                  title="YANA - Crowdfunding Comunitario"
                  titleEn="YANA - Community Crowdfunding"
                  description="Financia y apoya proyectos locales. Invierte en tu comunidad y conéctate con emprendedores."
                  descriptionEn="Fund and support local projects. Invest in your community and connect with entrepreneurs."
                  features={[
                    'Proyectos validados por comunidad',
                    'Financiamiento conversacional',
                    'Trust Score integrado',
                    'Beneficios para patrocinadores'
                  ]}
                  featuresEn={[
                    'Community-validated projects',
                    'Conversational funding',
                    'Integrated Trust Score',
                    'Benefits for sponsors'
                  ]}
                  launchDate={language === 'es' ? 'Junio 2025' : 'June 2025'}
                  featureName="yana"
                  gradient="from-pink-500 to-rose-600"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nearby' && (
          <NearbyExplorer
            users={users}
            businesses={businesses}
            onMessage={handleMessage}
            onCall={(user) => alert(`Iniciando llamada con ${user.full_name}...`)}
            onVideoCall={(user) => alert(`Iniciando videollamada con ${user.full_name}...`)}
            onContact={handleMessage}
          />
        )}

        {activeTab === 'matching' && (
          <MatchingDashboard
            users={users}
            businesses={businesses}
            onMessage={handleMessage}
          />
        )}
      </div>
    </div>
  );
}