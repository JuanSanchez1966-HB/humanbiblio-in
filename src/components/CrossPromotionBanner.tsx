import React from 'react';
import type { ActiveSection } from '../types';

interface CrossPromotionBannerProps {
  currentSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export default function CrossPromotionBanner({ currentSection, onSectionChange }: CrossPromotionBannerProps) {
  if (currentSection === 'dashboard') return null;

  const isAgora = currentSection === 'agora';
  
  return (
    <div className={`${
      isAgora 
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
    } text-white py-4`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">
              {isAgora ? '🛍️' : '🏛️'}
            </div>
            <div>
              <h3 className="font-semibold">
                {isAgora 
                  ? '¿Tienes un negocio? Descubre World Boulevard' 
                  : '¿Buscas personas? Explora el Ágora'
                }
              </h3>
              <p className="text-sm opacity-90">
                {isAgora 
                  ? 'Conecta con clientes y haz crecer tu negocio'
                  : 'Encuentra profesionales y expertos increíbles'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => onSectionChange(isAgora ? 'boulevard' : 'agora')}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm"
          >
            {isAgora ? 'Ir al Boulevard' : 'Ir al Ágora'}
          </button>
        </div>
      </div>
    </div>
  );
}