import React from 'react';

interface LogoComponentProps {
  size?: 'small' | 'medium' | 'large' | 'hero' | 'hero-large';
  className?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function LogoComponent({ 
  size = 'medium', 
  className = '', 
  onClick, 
  onDoubleClick 
}: LogoComponentProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'h-8 w-auto';
      case 'medium': return 'h-32 w-auto';
      case 'large': return 'h-48 w-auto';
      case 'hero': return 'h-24 w-auto';
      case 'hero-large': return 'h-40 w-auto max-w-full';
      default: return 'h-16 w-auto';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('⚠️ Logo corporativo no disponible - Usando fallback');
    const target = e.currentTarget;
    const nextElement = target.nextElementSibling as HTMLElement;
    if (target) target.style.display = 'none';
    if (nextElement) nextElement.style.display = 'flex';
  };

  const handleImageLoad = () => {
    console.log('🎉 ¡LOGO CORPORATIVO HUMANBIBLIO CARGADO!');
    console.log('🎨 Logo funcionando desde Imgur');
    console.log('🏛️ HUMANBIBLIO con branding corporativo activado');
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo corporativo desde Imgur */}
      <img 
        src="https://i.imgur.com/TzZrbxK.png"
        alt="HUMANBIBLIO - La Inteligencia Natural"
        className={`${getSizeClasses()} object-contain logo-corporate cursor-pointer transition-all duration-500 hover:scale-105`}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ 
          maxHeight: '100%', 
          width: 'auto', 
          filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))' 
        }}
      />
      
      {/* Fallback profesional (oculto por defecto) */}
      <div 
        className={`${getSizeClasses().replace('h-', 'text-').replace('w-auto', '')} cursor-pointer hover:scale-105 transition-transform duration-300 items-center justify-center hidden`}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={{ 
          fontSize: size === 'hero-large' ? '6rem' : 
                   size === 'large' ? '8rem' : 
                   size === 'hero' ? '3rem' : 
                   size === 'medium' ? '2rem' : '1.5rem' 
        }}
      >
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-2xl border-2 border-white/20 backdrop-blur-sm">
          <div className="text-center">
            <div className={`mb-3 ${size === 'hero-large' ? 'text-6xl' : 'text-4xl'}`}>🏛️</div>
            <div className={`font-bold ${size === 'hero-large' ? 'text-2xl' : 'text-lg'}`}>HUMANBIBLIO</div>
            <div className={`opacity-90 ${size === 'hero-large' ? 'text-base' : 'text-sm'}`}>La Inteligencia Natural</div>
          </div>
        </div>
      </div>
    </div>
  );
}