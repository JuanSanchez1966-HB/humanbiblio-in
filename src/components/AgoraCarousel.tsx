import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const culturalImages = [
  {
    id: 1,
    url: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'multicultural',
    titleEs: 'Conexiones Interculturales',
    titleEn: 'Intercultural Connections',
    descEs: 'Conoce personas de diferentes culturas y expande tu visión del mundo',
    descEn: 'Meet people from different cultures and expand your worldview'
  },
  {
    id: 2,
    url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'romantic',
    titleEs: 'Conexiones Auténticas',
    titleEn: 'Authentic Connections',
    descEs: 'Encuentra personas que resuenan contigo en un nivel profundo',
    descEn: 'Find people who resonate with you on a deep level'
  },
  {
    id: 3,
    url: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'study',
    titleEs: 'Colaboración Académica',
    titleEn: 'Academic Collaboration',
    descEs: 'Conecta con estudiantes y profesionales para proyectos académicos',
    descEn: 'Connect with students and professionals for academic projects'
  },
  {
    id: 4,
    url: 'https://images.pexels.com/photos/3184421/pexels-photo-3184421.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'work',
    titleEs: 'Oportunidades Profesionales',
    titleEn: 'Professional Opportunities',
    descEs: 'Descubre colaboradores y oportunidades laborales globales',
    descEn: 'Discover collaborators and global work opportunities'
  },
  {
    id: 5,
    url: 'https://images.pexels.com/photos/3184393/pexels-photo-3184393.jpeg?auto=compress&cs=tinysrgb&w=1200',
    theme: 'creative',
    titleEs: 'Creatividad Colaborativa',
    titleEn: 'Collaborative Creativity',
    descEs: 'Únete a mentes creativas para proyectos artísticos y culturales',
    descEn: 'Join creative minds for artistic and cultural projects'
  }
];

export default function AgoraCarousel() {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % culturalImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentImage = culturalImages[currentIndex];

  return (
    <div className="mb-12">
      <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl group">
        {/* Image */}
        <img
          src={currentImage.url}
          alt={language === 'es' ? currentImage.titleEs : currentImage.titleEn}
<<<<<<< HEAD
          className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-110"
=======
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h3 className="text-3xl font-bold text-white mb-3">
            {language === 'es' ? currentImage.titleEs : currentImage.titleEn}
          </h3>
          <p className="text-lg text-blue-100 mb-6">
            {language === 'es' ? currentImage.descEs : currentImage.descEn}
          </p>

          {/* Indicators */}
          <div className="flex items-center space-x-2">
            {culturalImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + culturalImages.length) % culturalImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % culturalImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
}
