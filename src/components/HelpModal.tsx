import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { HelpCircle, Users, Store, Rocket, Search, MessageSquare, Map, Star } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const content = {
    es: {
      title: 'Centro de Ayuda',
      subtitle: 'Guía rápida para usar HUMANBIBLIO',
      quickTips: 'Consejos Rápidos',
      sections: [
        {
          title: '¿Qué es el piloto?',
          icon: HelpCircle,
          content: 'Estás probando la versión piloto de HUMANBIBLIO. Tu feedback es crucial para mejorar la plataforma antes del lanzamiento oficial. Usa el botón de feedback abajo a la izquierda para compartir tus opiniones.'
        },
        {
          title: 'El Ágora - Conexiones',
          icon: Users,
          content: 'Conecta con profesionales y mentes brillantes. Usa el buscador para encontrar personas por profesión, intereses o ubicación. Puedes iniciar conversaciones, ver perfiles completos y conectar de forma auténtica.'
        },
        {
          title: 'World Boulevard - Negocios',
          icon: Store,
          content: 'Descubre negocios locales únicos. Los usuarios con el botón verde "WB Vende" tienen perfil comercial. Click en ese botón para ver sus productos, servicios, horarios y ubicación. Puedes dejar reseñas y apoyar negocios locales.'
        },
        {
          title: 'Universe - Proyectos',
          icon: Rocket,
          content: 'Explora y únete a proyectos colaborativos. Crea tu propio proyecto, busca colaboradores, comparte recursos y haz realidad tus ideas. Los proyectos pueden ser sociales, empresariales, creativos o educativos.'
        },
        {
          title: 'Búsqueda Avanzada',
          icon: Search,
          content: 'Usa filtros para encontrar exactamente lo que buscas: por ubicación, intereses, profesión, tipo de negocio o categoría de proyecto. La búsqueda es inteligente y aprende de tus preferencias.'
        },
        {
          title: 'Mensajería',
          icon: MessageSquare,
          content: 'Chatea directamente con otros usuarios. Los mensajes pueden incluir texto, imágenes y notas de voz. La plataforma detecta si tienes WhatsApp instalado para una mejor experiencia.'
        },
        {
          title: 'Explorador Cercano',
          icon: Map,
          content: 'Activa tu ubicación para descubrir personas, negocios y proyectos cerca de ti. Perfecto para encontrar oportunidades locales y construir tu comunidad.'
        },
        {
          title: 'Reseñas y Confianza',
          icon: Star,
          content: 'Deja reseñas honestas de negocios que visites. Tu Trust Score aumenta al recibir reseñas positivas, lo que te hace más visible en la plataforma.'
        }
      ],
      tips: [
        'Completa tu perfil para que otros te descubran fácilmente',
        'Usa fotos claras y profesionales',
        'Sé auténtico en tus interacciones',
        'Explora las 3 secciones: Ágora, Boulevard y Universe',
        'Tu feedback es invaluable - compártelo regularmente'
      ],
      contactTitle: '¿Necesitas más ayuda?',
      contactText: 'Contáctanos en: support@humanbiblio.com'
    },
    en: {
      title: 'Help Center',
      subtitle: 'Quick guide to using HUMANBIBLIO',
      quickTips: 'Quick Tips',
      sections: [
        {
          title: 'What is the pilot?',
          icon: HelpCircle,
          content: 'You are testing the pilot version of HUMANBIBLIO. Your feedback is crucial to improve the platform before the official launch. Use the feedback button at the bottom left to share your thoughts.'
        },
        {
          title: 'The Agora - Connections',
          icon: Users,
          content: 'Connect with professionals and brilliant minds. Use the search bar to find people by profession, interests, or location. You can start conversations, view full profiles, and connect authentically.'
        },
        {
          title: 'World Boulevard - Businesses',
          icon: Store,
          content: 'Discover unique local businesses. Users with the green "WB Sells" button have a business profile. Click that button to see their products, services, hours, and location. You can leave reviews and support local businesses.'
        },
        {
          title: 'Universe - Projects',
          icon: Rocket,
          content: 'Explore and join collaborative projects. Create your own project, find collaborators, share resources, and bring your ideas to life. Projects can be social, business, creative, or educational.'
        },
        {
          title: 'Advanced Search',
          icon: Search,
          content: 'Use filters to find exactly what you\'re looking for: by location, interests, profession, business type, or project category. The search is intelligent and learns from your preferences.'
        },
        {
          title: 'Messaging',
          icon: MessageSquare,
          content: 'Chat directly with other users. Messages can include text, images, and voice notes. The platform detects if you have WhatsApp installed for a better experience.'
        },
        {
          title: 'Nearby Explorer',
          icon: Map,
          content: 'Enable your location to discover people, businesses, and projects near you. Perfect for finding local opportunities and building your community.'
        },
        {
          title: 'Reviews & Trust',
          icon: Star,
          content: 'Leave honest reviews of businesses you visit. Your Trust Score increases when you receive positive reviews, making you more visible on the platform.'
        }
      ],
      tips: [
        'Complete your profile so others can discover you easily',
        'Use clear and professional photos',
        'Be authentic in your interactions',
        'Explore all 3 sections: Agora, Boulevard, and Universe',
        'Your feedback is invaluable - share it regularly'
      ],
      contactTitle: 'Need more help?',
      contactText: 'Contact us at: support@humanbiblio.com'
    }
  };

  const currentContent = content[language];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentContent.title}
              </h2>
              <p className="text-lg text-blue-600">
                {currentContent.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{currentContent.quickTips}</h3>
            <ul className="space-y-2">
              {currentContent.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentContent.sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-5 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💬</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {currentContent.contactTitle}
                </h4>
                <p className="text-gray-700 text-sm">
                  {currentContent.contactText}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {language === 'es'
                    ? 'También puedes usar el botón de feedback (esquina inferior izquierda) para reportar problemas o sugerir mejoras.'
                    : 'You can also use the feedback button (bottom left corner) to report issues or suggest improvements.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
            >
              {language === 'es' ? 'Entendido' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
