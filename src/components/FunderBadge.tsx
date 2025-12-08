import React from 'react';
import type { ProjectFunder } from '../types';

interface FunderBadgeProps {
  funder: ProjectFunder;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function FunderBadge({ funder, onClick, size = 'medium' }: FunderBadgeProps) {
  const getBadgeConfig = () => {
    switch (funder.recognition_level) {
      case 'platinum':
        return {
          gradient: 'from-purple-500 to-violet-600',
          icon: '👑',
          title: 'Financiador Platino',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800'
        };
      case 'gold':
        return {
          gradient: 'from-yellow-500 to-orange-600',
          icon: '🥇',
          title: 'Financiador Oro',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      case 'silver':
        return {
          gradient: 'from-gray-400 to-gray-600',
          icon: '🥈',
          title: 'Financiador Plata',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
      default:
        return {
          gradient: 'from-orange-500 to-red-600',
          icon: '🥉',
          title: 'Financiador Bronce',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        };
    }
  };

  const config = getBadgeConfig();
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base'
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer`}
        title={`${config.title}: ${funder.funder_name}`}
      >
        {config.icon}
      </button>
      
      {/* Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className={`${config.bgColor} border border-gray-200 rounded-xl p-3 shadow-xl min-w-48`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {funder.funder_avatar ? (
                <img 
                  src={funder.funder_avatar} 
                  alt={funder.funder_name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                funder.funder_name.charAt(0)
              )}
            </div>
            <div>
              <p className={`font-bold ${config.textColor}`}>{funder.funder_name}</p>
              <p className="text-xs text-gray-600">{funder.funder_profession}</p>
            </div>
          </div>
          <div className={`text-xs ${config.textColor} mb-2`}>
            <p className="font-semibold">{config.title}</p>
            <p>${funder.amount_funded.toLocaleString()} financiados</p>
          </div>
          {funder.public_message && (
            <p className="text-xs text-gray-700 italic">
              "{funder.public_message}"
            </p>
          )}
          <div className="text-center mt-2">
            <span className="text-xs text-blue-600 font-medium">
              👆 Click para ver perfil
            </span>
          </div>
          
          {/* Arrow */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-200`}></div>
        </div>
      </div>
    </div>
  );
}