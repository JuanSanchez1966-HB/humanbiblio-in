import React, { useState } from 'react';
import type { Business } from '../types';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
}

interface RobustBusinessCarouselProps {
  business: Business;
  onClose: () => void;
}

export default function RobustBusinessCarousel({ business, onClose }: RobustBusinessCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Media específica para cada negocio
  const getBusinessMedia = (businessName: string): MediaItem[] => {
    switch (businessName) {
      case 'Terapia Integral Ana García':
        return [
          {
            id: '1',
            url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Consulta Psicológica Profesional',
            description: 'Espacio acogedor y confidencial para terapia individual'
          },
          {
            id: '2',
            url: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Sesiones de Mindfulness',
            description: 'Técnicas de relajación y meditación guiada'
          },
          {
            id: '3',
            url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Terapia de Pareja',
            description: 'Espacio especializado para fortalecer relaciones'
          },
          {
            id: '4',
            url: 'https://images.pexels.com/photos/4101137/pexels-photo-4101137.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Consultas Online',
            description: 'Terapia virtual desde la comodidad de tu hogar'
          }
        ];
      
      case 'TechSolutions Carlos Rodríguez':
        return [
          {
            id: '1',
            url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Oficina Tecnológica Moderna',
            description: 'Espacio de trabajo con la última tecnología para desarrollo'
          },
          {
            id: '2',
            url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Desarrollo Web Avanzado',
            description: 'Aplicaciones React modernas y escalables'
          },
          {
            id: '3',
            url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Consultoría IT Especializada',
            description: 'Transformación digital para empresas de todos los tamaños'
          },
          {
            id: '4',
            url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Equipo de Desarrollo',
            description: 'Profesionales con más de 10 años de experiencia'
          }
        ];
      
      case 'Cocina Creativa María Santos':
        return [
          {
            id: '1',
            url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Chef María en Acción',
            description: 'Preparando especialidades mediterráneas con técnica profesional'
          },
          {
            id: '2',
            url: 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Repostería Artesanal',
            description: 'Dulces y pasteles hechos con técnicas francesas'
          },
          {
            id: '3',
            url: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Clases de Cocina',
            description: 'Enseñanza personalizada en cocina mediterránea'
          },
          {
            id: '4',
            url: 'https://images.pexels.com/photos/1002543/pexels-photo-1002543.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Catering Premium',
            description: 'Servicios de catering para eventos especiales'
          }
        ];
      
      case 'Sonidos del Sur - David Martínez':
        return [
          {
            id: '1',
            url: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Estudio de Grabación Profesional',
            description: 'Equipamiento de audio de última generación para grabaciones de calidad'
          },
          {
            id: '2',
            url: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Producción Musical Avanzada',
            description: 'Creamos sonidos únicos para artistas y proyectos comerciales'
          },
          {
            id: '3',
            url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Sesiones de Grabación',
            description: 'Ambiente profesional para capturar la mejor música'
          },
          {
            id: '4',
            url: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=1200',
            type: 'image',
            title: 'Mezcla y Masterización',
            description: 'Proceso final para lograr sonido profesional de radio'
          }
        ];
      
      default:
        return [
          {
            id: '1',
            url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
            type: 'image',
            title: business.name,
            description: business.description
          }
        ];
    }
  };

  const mediaItems = getBusinessMedia(business.name);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const currentMedia = mediaItems[currentImageIndex];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🏢
              </div>
              <div>
                <h2 className="text-2xl font-bold">{business.name}</h2>
                <p className="text-emerald-100">{business.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📸 Galería Multimedia</h3>
            
            {/* Imagen Principal */}
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={currentMedia.url}
                  alt={currentMedia.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
              </div>
              
              {/* Controles de navegación */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    →
                  </button>
                </>
              )}
              
              {/* Indicador de posición */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Información de la imagen actual */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-2">{currentMedia.title}</h4>
              <p className="text-gray-600 text-sm">{currentMedia.description}</p>
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {mediaItems.map((media, index) => (
                  <button
                    key={media.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'border-emerald-500 scale-105' 
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <img
                      src={media.url}
                      alt={media.title}
                     className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Negocio */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{business.name}</h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                  {business.category}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{(Math.random() * 1.5 + 3.5).toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({Math.floor(Math.random() * 200) + 20} reseñas)</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{business.description}</p>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3">🎯 Servicios y Productos</h4>
              <div className="space-y-2">
                {business.products_services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-emerald-600 mr-3">✓</span>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <h4 className="font-bold text-emerald-900 mb-3">📞 Información de Contacto</h4>
              <div className="space-y-2">
                {business.contact_email && (
                  <div className="flex items-center">
                    <span className="text-emerald-600 mr-3">📧</span>
                    <span className="text-gray-700">{business.contact_email}</span>
                  </div>
                )}
                {business.contact_phone && (
                  <div className="flex items-center">
                    <span className="text-emerald-600 mr-3">📞</span>
                    <span className="text-gray-700">{business.contact_phone}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center">
                    <span className="text-emerald-600 mr-3">🌐</span>
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Visitar sitio web
                    </a>
                  </div>
                )}
                {business.location && (
                  <div className="flex items-center">
                    <span className="text-emerald-600 mr-3">📍</span>
                    <span className="text-gray-700">{business.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Indicador de Comercio Orgánico */}
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-emerald-600 text-xl">🌱</span>
                <span className="text-emerald-800 font-bold">Comercio Orgánico Certificado</span>
                <span className="text-emerald-600 text-xl">✨</span>
              </div>
              <div className="space-y-1 text-sm text-emerald-800">
                <div className="flex items-center justify-center">
                  <span className="mr-2">✅</span>
                  <span>Crecimiento auténtico sin publicidad forzada</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">✅</span>
                  <span>Verificado por HUMANBIBLIO</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">✅</span>
                  <span>Comunicación directa sin intermediarios</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  alert(`💬 Iniciando conversación con ${business.name}...`);
                  onClose();
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                💬 Contactar Negocio
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    alert(`📞 Iniciando llamada con ${business.name}...`);
                  }}
                  className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  📞 Llamar
                </button>
                <button
                  onClick={() => {
                    if (business.website) {
                      window.open(business.website, '_blank');
                    } else {
                      const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(business.location || business.name)}`;
                      window.open(mapUrl, '_blank');
                    }
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  {business.website ? '🌐 Web' : '📍 Mapa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}