import React from 'react';

export default function TechnologyShowcase() {
  const technologies = [
    {
      name: 'React 18',
      icon: '⚛️',
      description: 'Frontend moderno y reactivo',
      status: 'Implementado',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'TypeScript',
      icon: '📘',
      description: 'Código robusto y mantenible',
      status: 'Implementado',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Supabase',
      icon: '🗄️',
      description: 'Base de datos y autenticación',
      status: 'Configurado',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      name: 'PWA',
      icon: '📱',
      description: 'Progressive Web App',
      status: 'Implementado',
      color: 'from-purple-400 to-purple-600'
    },
    {
      name: 'WebRTC',
      icon: '📞',
      description: 'Comunicación en tiempo real',
      status: 'Preparado',
      color: 'from-green-400 to-green-600'
    },
    {
      name: 'Geolocation API',
      icon: '🌍',
      description: 'Ubicación inteligente',
      status: 'Implementado',
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      name: 'MediaRecorder API',
      icon: '🎤',
      description: 'Grabación de voz',
      status: 'Implementado',
      color: 'from-orange-400 to-orange-600'
    },
    {
      name: 'IA Contextual',
      icon: '🧠',
      description: 'Inteligencia Natural',
      status: 'Implementado',
      color: 'from-violet-400 to-violet-600'
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            🚀 Tecnología de Vanguardia
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stack tecnológico moderno que potencia la Inteligencia Natural
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">
                  {tech.name}
                </h3>
                
                <p className="text-sm text-gray-300 mb-4">
                  {tech.description}
                </p>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  tech.status === 'Implementado' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : tech.status === 'Configurado'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {tech.status === 'Implementado' ? '✅' : tech.status === 'Configurado' ? '🔧' : '⏳'} {tech.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arquitectura Visual */}
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            🏗️ Arquitectura de la Inteligencia Natural
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl">
                🎨
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Frontend</h4>
              <p className="text-gray-300 text-sm">React + TypeScript + Tailwind CSS</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl">
                🗄️
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Backend</h4>
              <p className="text-gray-300 text-sm">Supabase + PostgreSQL + RLS</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-3xl">
                🧠
              </div>
              <h4 className="text-xl font-bold text-white mb-2">IA</h4>
              <p className="text-gray-300 text-sm">Contextual + Personalidades + Análisis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}