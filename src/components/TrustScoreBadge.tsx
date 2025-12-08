import React from 'react';

interface TrustScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

const TrustScoreBadge = React.memo(function TrustScoreBadge({
  score,
  size = 'medium',
  showDetails = false
}: TrustScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score < 40) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    if (score < 70) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-lg';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const colors = getScoreColor(score);

  const breakdown = {
    'Perfil Completo': 20,
    'Verificación': 15,
    'Interacciones': 25,
    'Feedback': 20,
    'Antigüedad': 10,
    'Actividad': 10
  };

  return (
    <div className="relative group">
      <div
        className={`${colors.bg} ${colors.text} ${colors.border} border-2 rounded-full font-bold ${getSizeClasses()} flex items-center space-x-1 shadow-sm`}
      >
        <span className="text-xs">🛡️</span>
        <span>{score}</span>
        <span className="text-xs opacity-70">/ 100</span>
      </div>

      {showDetails && (
        <div className="absolute z-10 hidden group-hover:block top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64">
          <div className="mb-3">
            <h4 className="font-bold text-gray-900 mb-1">Trust Score</h4>
            <p className="text-xs text-gray-600">Basado en comportamiento verificable</p>
          </div>

          <div className="space-y-2">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-xs text-gray-700">{key}</span>
                <span className="text-xs font-semibold text-gray-900">{value}%</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Estado</span>
              <span className={`text-xs font-bold ${colors.text}`}>
                {score < 40 ? '⬇️ Mejorar' : score < 70 ? '➡️ Bueno' : '⬆️ Excelente'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TrustScoreBadge;
