import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUsers } from '../hooks/useSupabaseData';
import UniverseProfileCard from './UniverseProfileCard';
import UniverseSearchBar from './UniverseSearchBar';
import HagamosloJuntosForm from './HagamosloJuntosForm';
import ActualidadesSection from './ActualidadesSection';
import type { UniverseProfile, User, ProjectFunder } from '../types';

// Mock data para demo
const MOCK_UNIVERSE_PROFILES: UniverseProfile[] = [
  {
    id: '1',
    user_id: '1',
    user_name: 'Ana García',
    user_avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_profession: 'Psicóloga Clínica',
    topic: 'Terapia Digital para Ansiedad',
    description: 'Estoy desarrollando un protocolo de terapia digital que combina CBT con IA para tratar ansiedad. Busco colaboradores en tech y otros psicólogos.',
    project_title: 'TherapyAI - Protocolo Digital CBT',
    looking_for: 'collaboration',
    contact_preference: 'chat',
    is_seeking_partners: true,
    likes_count: 234,
    contact_count: 45,
    status: 'active',
    tags: ['psicología', 'IA', 'salud mental', 'terapia'],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    funding_received: 15000,
    is_funded: true,
    funders: [
      {
        id: 'f1',
        funder_user_id: '2',
        funder_name: 'Carlos Rodríguez',
        funder_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        funder_profession: 'Desarrollador Full Stack',
        funder_profession_en: 'Full Stack Developer',
        funder_type: 'individual',
        amount_funded: 8000,
        funding_date: new Date().toISOString(),
        recognition_level: 'gold',
        public_message: 'Excelente proyecto que combina mi expertise tech con salud mental',
        public_message_en: 'Excellent project that combines my tech expertise with mental health',
        is_wb_business: true,
        wb_business_id: 'wb-carlos-rodriguez'
      },
      {
        id: 'f2',
        funder_user_id: '3',
        funder_name: 'María Santos',
        funder_avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        funder_profession: 'Chef Ejecutiva',
        funder_profession_en: 'Executive Chef',
        funder_type: 'individual',
        amount_funded: 5000,
        funding_date: new Date().toISOString(),
        recognition_level: 'silver',
        public_message: 'Como chef, entiendo la importancia del bienestar mental',
        public_message_en: 'As a chef, I understand the importance of mental well-being',
        is_wb_business: true,
        wb_business_id: 'wb-maria-santos'
      },
      {
        id: 'f3',
        funder_user_id: '4',
        funder_name: 'David Martínez',
        funder_avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        funder_profession: 'Músico y Productor',
        funder_profession_en: 'Musician and Producer',
        funder_type: 'individual',
        amount_funded: 2000,
        funding_date: new Date().toISOString(),
        recognition_level: 'bronze',
        public_message: 'La música y la terapia van de la mano',
        public_message_en: 'Music and therapy go hand in hand',
        is_wb_business: true,
        wb_business_id: 'wb-david-martinez'
      }
    ]
  },
  {
    id: '2',
    user_id: '2',
    user_name: 'Carlos Rodríguez',
    user_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_profession: 'Desarrollador Full Stack',
    topic: 'Blockchain para Pequeños Agricultores',
    description: 'Quiero crear una plataforma blockchain que conecte directamente agricultores con consumidores, eliminando intermediarios.',
    project_title: 'FarmChain - Agricultura Transparente',
    looking_for: 'funding',
    contact_preference: 'any',
    is_seeking_partners: true,
    likes_count: 189,
    contact_count: 32,
    status: 'active',
    tags: ['blockchain', 'agricultura', 'sostenibilidad', 'tech'],
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    funding_received: 0,
    is_funded: false,
    funders: []
  },
  {
    id: '3',
    user_id: '3',
    user_name: 'María Santos',
    user_avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_profession: 'Chef Ejecutiva',
    topic: 'Cocina Molecular Accesible',
    description: 'Quiero democratizar la cocina molecular creando kits caseros y cursos online para que cualquiera pueda experimentar.',
    project_title: 'MolecularHome - Ciencia en tu Cocina',
    looking_for: 'partnership',
    contact_preference: 'chat',
    is_seeking_partners: false,
    likes_count: 156,
    contact_count: 28,
    status: 'active',
    tags: ['cocina', 'ciencia', 'educación', 'innovación'],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    funding_received: 0,
    is_funded: false,
    funders: []
  },
  {
    id: '4',
    user_id: '4',
    user_name: 'David Martínez',
    user_avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_profession: 'Músico y Productor',
    topic: 'Música Terapéutica Personalizada',
    description: 'Combino musicoterapia con IA para crear composiciones personalizadas que reduzcan estrés y mejoren bienestar emocional.',
    project_title: 'SoundHealing - Música que Sana',
    looking_for: 'discussion',
    contact_preference: 'call',
    is_seeking_partners: true,
    likes_count: 298,
    contact_count: 67,
    status: 'active',
    tags: ['música', 'terapia', 'IA', 'bienestar'],
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    funding_received: 25000,
    is_funded: true,
    funders: [
      {
        id: 'f4',
        funder_user_id: '1',
        funder_name: 'Ana García',
        funder_avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        funder_profession: 'Psicóloga Clínica',
        funder_profession_en: 'Clinical Psychologist',
        funder_type: 'individual',
        amount_funded: 15000,
        funding_date: new Date().toISOString(),
        recognition_level: 'platinum',
        public_message: 'La musicoterapia es el futuro del bienestar mental',
        public_message_en: 'Music therapy is the future of mental wellness',
        is_wb_business: true,
        wb_business_id: 'wb-ana-garcia'
      },
      {
        id: 'f5',
        funder_user_id: '2',
        funder_name: 'Carlos Rodríguez',
        funder_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        funder_profession: 'Desarrollador Full Stack',
        funder_profession_en: 'Full Stack Developer',
        funder_type: 'individual',
        amount_funded: 10000,
        funding_date: new Date().toISOString(),
        recognition_level: 'gold',
        public_message: 'Puedo ayudar con la parte tecnológica de la app',
        public_message_en: 'I can help with the technical side of the app',
        is_wb_business: true,
        wb_business_id: 'wb-carlos-rodriguez'
      }
    ]
  },
  {
    id: '5',
    user_id: '5',
    user_name: 'Lucía Fernández',
    user_avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_profession: 'Diseñadora UX/UI',
    topic: 'Interfaces para Personas con Discapacidad',
    description: 'Diseño interfaces inclusivas que permitan a personas con diferentes discapacidades acceder plenamente a la tecnología.',
    project_title: 'AccessibleUX - Tecnología para Todos',
    looking_for: 'collaboration',
    contact_preference: 'chat',
    is_seeking_partners: true,
    likes_count: 445,
    contact_count: 89,
    status: 'active',
    tags: ['accesibilidad', 'diseño', 'inclusión', 'UX'],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    funding_received: 0,
    is_funded: false,
    funders: []
  }
];

export default function UniverseSection() {
  const [activeTab, setActiveTab] = useState<'explore' | 'hagamoslo' | 'actualidades'>('explore');
  const [searchResults, setSearchResults] = useState<UniverseProfile[]>(MOCK_UNIVERSE_PROFILES);
  const [showHJForm, setShowHJForm] = useState(false);
  const { users } = useUsers();
  const { t } = useLanguage();

  const handleSearch = (results: UniverseProfile[]) => {
    setSearchResults(results);
  };

  const handleLike = (profileId: string) => {
    console.log(`👍 Like agregado al perfil ${profileId}`);
    alert('¡Like agregado! 👍 Cada like acerca este proyecto a más visibilidad y posibles colaboradores.');
  };

  const handleContact = (profile: UniverseProfile) => {
    const user = users.find(u => u.id === profile.user_id);
    if (user) {
      alert(`💬 Iniciando conversación con ${profile.user_name} sobre "${profile.topic}"...`);
    }
  };

  const handleFunderClick = (funder: ProjectFunder) => {
    console.log('🏆 Click en financiador:', funder.funder_name);
    
    // Buscar el usuario financiador
    const funderUser = users.find(u => u.id === funder.funder_user_id);
    
    if (funderUser) {
      if (funder.is_wb_business) {
        // Si tiene negocio en WB, navegar a World Boulevard
        alert(`🛍️ Navegando al perfil comercial de ${funder.funder_name} en World Boulevard...`);
        
        // Disparar evento para cambiar a Boulevard y mostrar su negocio
        const event = new CustomEvent('navigateToFunderBusiness', {
          detail: { funder, user: funderUser }
        });
        window.dispatchEvent(event);
      } else {
        // Si no tiene negocio, mostrar perfil en Ágora
        alert(`👤 Navegando al perfil de ${funder.funder_name} en el Ágora...`);
        
        // Disparar evento para mostrar perfil en Ágora
        const event = new CustomEvent('navigateToFunderProfile', {
          detail: { funder, user: funderUser }
        });
        window.dispatchEvent(event);
      }
    } else {
      alert(`ℹ️ ${funder.funder_name} no está disponible en este momento.`);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header Cósmico */}
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🛸</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🌌 {t('universe.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
          {t('universe.subtitle')}
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-purple-800 mb-3">🌟 {t('universe.paradox.title')}</h3>
          <p className="text-purple-700 leading-relaxed">
            {t('universe.paradox.description')}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🌌 {t('universe.tabs.explore')}
          </button>
          <button
            onClick={() => setActiveTab('hagamoslo')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'hagamoslo'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🤝 {t('universe.tabs.together')}
          </button>
          <button
            onClick={() => setActiveTab('actualidades')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'actualidades'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🔥 {t('universe.tabs.news')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <UniverseSearchBar 
            profiles={MOCK_UNIVERSE_PROFILES}
            onSearchResults={handleSearch}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((profile) => (
              <UniverseProfileCard
                key={profile.id}
                profile={profile}
                onLike={handleLike}
                onContact={handleContact}
                onFunderClick={handleFunderClick}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hagamoslo' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Hagámoslo Juntos</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>HUMANBIBLIO resuelve esta paradoja.</strong>
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={() => setShowHJForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🚀 Publicar Mi Proyecto
            </button>
          </div>

          {/* Proyectos buscando colaboradores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults
              .filter(profile => profile.is_seeking_partners)
              .map((profile) => (
                <UniverseProfileCard
                  key={profile.id}
                  profile={profile}
                  onLike={handleLike}
                  onContact={handleContact}
                  showHJBadge={true}
                />
              ))}
          </div>
        </div>
      )}

      {activeTab === 'actualidades' && (
        <ActualidadesSection 
          profiles={searchResults}
          onLike={handleLike}
          onContact={handleContact}
          onFunderClick={handleFunderClick}
        />
      )}

      {/* Formulario Hagámoslo Juntos */}
      {showHJForm && (
        <HagamosloJuntosForm
          isOpen={showHJForm}
          onClose={() => setShowHJForm(false)}
          onSubmit={(data) => {
            console.log('Nuevo proyecto HJ:', data);
            setShowHJForm(false);
            alert('¡Proyecto publicado! 🚀 Ahora apareces en "Hagámoslo Juntos" con el distintivo HJ. Los colaboradores pueden contactarte.');
          }}
        />
      )}
    </div>
  );
}