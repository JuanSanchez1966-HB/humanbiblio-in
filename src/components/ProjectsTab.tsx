import React, { useState } from 'react';
import { useUsers } from '../hooks/useSupabaseData';
import ProjectCard from './ProjectCard';
import ProjectCreationForm from './ProjectCreationForm';
import ProjectSearchBar from './ProjectSearchBar';
import TrendingProjects from './TrendingProjects';
import type { Project } from '../types';

// Mock projects para demo
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'App de Meditación para Desarrolladores',
    title_en: 'Meditation App for Developers',
    description: 'Una aplicación que combina técnicas de mindfulness específicamente diseñadas para programadores que sufren de burnout. Incluye sesiones de 5-15 minutos entre sprints de código.',
    description_en: 'An application that combines mindfulness techniques specifically designed for programmers suffering from burnout. Includes 5-15 minute sessions between code sprints.',
    category: 'Bienestar Tech',
    category_en: 'Tech Wellness',
    creator_id: '2',
    creator_name: 'Carlos Rodríguez',
    creator_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    funding_goal: 25000,
    current_funding: 8500,
    likes_count: 234,
    comments_count: 67,
    status: 'active',
    tags: ['mindfulness', 'desarrollo', 'bienestar', 'app móvil'],
    tags_en: ['mindfulness', 'development', 'wellness', 'mobile app'],
    media_urls: [],
    is_public_conversation: true,
    funding_threshold: 500,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Plataforma de Intercambio de Recetas Familiares',
    title_en: 'Family Recipe Exchange Platform',
    description: 'Red social donde las familias pueden compartir recetas tradicionales con historias detrás de cada plato. Cada receta incluye video de la abuela cocinando y la historia familiar.',
    description_en: 'Social network where families can share traditional recipes with stories behind each dish. Each recipe includes a video of grandma cooking and the family history.',
    category: 'Gastronomía Social',
    category_en: 'Social Gastronomy',
    creator_id: '3',
    creator_name: 'María Santos',
    creator_avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    funding_goal: 15000,
    current_funding: 12800,
    likes_count: 456,
    comments_count: 123,
    status: 'active',
    tags: ['cocina', 'familia', 'tradición', 'video', 'historias'],
    tags_en: ['cooking', 'family', 'tradition', 'video', 'stories'],
    media_urls: [],
    is_public_conversation: true,
    funding_threshold: 300,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Terapia Musical para Ansiedad',
    title_en: 'Music Therapy for Anxiety',
    description: 'Protocolo de musicoterapia personalizada usando IA para crear composiciones específicas que reduzcan la ansiedad según el perfil emocional de cada persona.',
    description_en: 'Personalized music therapy protocol using AI to create specific compositions that reduce anxiety according to each person\'s emotional profile.',
    category: 'Salud Mental + Música',
    category_en: 'Mental Health + Music',
    creator_id: '4',
    creator_name: 'David Martínez',
    creator_avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    funding_goal: 35000,
    current_funding: 5200,
    likes_count: 189,
    comments_count: 45,
    status: 'active',
    tags: ['música', 'terapia', 'ansiedad', 'IA', 'salud mental'],
    tags_en: ['music', 'therapy', 'anxiety', 'AI', 'mental health'],
    media_urls: [],
    is_public_conversation: true,
    funding_threshold: 400,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Red de Apoyo para Emprendedores Rurales',
    title_en: 'Support Network for Rural Entrepreneurs',
    description: 'Plataforma que conecta emprendedores en zonas rurales con mentores urbanos, facilitando el intercambio de conocimientos y recursos para desarrollar negocios sostenibles.',
    description_en: 'Platform connecting entrepreneurs in rural areas with urban mentors, facilitating the exchange of knowledge and resources to develop sustainable businesses.',
    category: 'Emprendimiento Social',
    category_en: 'Social Entrepreneurship',
    creator_id: '1',
    creator_name: 'Ana García',
    creator_avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    funding_goal: 20000,
    current_funding: 18500,
    likes_count: 678,
    comments_count: 234,
    status: 'funded',
    tags: ['emprendimiento', 'rural', 'mentoring', 'sostenibilidad'],
    tags_en: ['entrepreneurship', 'rural', 'mentoring', 'sustainability'],
    media_urls: [],
    is_public_conversation: true,
    funding_threshold: 600,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function ProjectsTab() {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchResults, setSearchResults] = useState<Project[]>(projects);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { users } = useUsers();

  const categories = [
    'all',
    ...Array.from(new Set(projects.map(p => p.category)))
  ];

  const handleSearch = (results: Project[]) => {
    setSearchResults(results);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchResults(projects);
    } else {
      setSearchResults(projects.filter(p => p.category === category));
    }
  };

  const handleLikeProject = (projectId: string) => {
    // En producción, esto actualizaría la base de datos
    console.log(`👍 Like agregado al proyecto ${projectId}`);
    alert('¡Like agregado! 👍 Cada like acerca este proyecto a su financiación.');
  };

  const handleCreateProject = (projectData: Partial<Project>) => {
    console.log('Nuevo proyecto creado:', projectData);
    setShowCreateForm(false);
    alert('¡Proyecto creado exitosamente! 🚀 Ahora está visible para toda la comunidad.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          💡 Mi Proyecto - Financiación Conversacional
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
          Comparte tu idea, genera conversaciones auténticas, y obtén financiación basada en el interés real de la comunidad.
        </p>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">🌟 Cómo Funciona la Financiación Conversacional</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-yellow-800">
            <div className="text-center">
              <div className="text-2xl mb-2">💡</div>
              <p><strong>1. Comparte</strong><br/>Tu idea o proyecto</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <p><strong>2. Conversa</strong><br/>Con la comunidad</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👍</div>
              <p><strong>3. Acumula Likes</strong><br/>Por conversaciones auténticas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <p><strong>4. Obtén Financiación</strong><br/>Automática al alcanzar threshold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Button */}
      <div className="text-center">
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          💡 Crear Mi Proyecto
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <ProjectSearchBar 
          projects={projects}
          onSearchResults={handleSearch}
        />
        
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'Todos los Proyectos' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Projects */}
      <TrendingProjects 
        projects={searchResults.filter(p => p.likes_count > 200)}
        onLike={handleLikeProject}
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onLike={handleLikeProject}
            onComment={(projectId, comment) => {
              console.log(`Comentario en proyecto ${projectId}:`, comment);
              alert('¡Comentario agregado! 💬 Tu participación ayuda a que este proyecto crezca.');
            }}
            onContact={(creatorId) => {
              const creator = users.find(u => u.id === creatorId);
              if (creator) {
                alert(`💬 Iniciando conversación con ${creator.full_name} sobre su proyecto...`);
              }
            }}
          />
        ))}
      </div>

      {/* Project Creation Form */}
      {showCreateForm && (
        <ProjectCreationForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateProject}
        />
      )}

      {/* Revolutionary Impact Notice */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
        <div className="text-5xl mb-4">🌍</div>
        <h3 className="text-2xl font-bold mb-4">Revolución en Financiación de Proyectos</h3>
        <p className="text-indigo-100 text-lg max-w-3xl mx-auto leading-relaxed">
          Por primera vez en la historia, las mejores ideas se financian por la <strong>calidad de las conversaciones</strong> 
          que generan, no por el presupuesto de marketing que tengan detrás.
        </p>
      </div>
    </div>
  );
}