import React from 'react';
import FunderBadge from './FunderBadge';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
import type { ProjectFunder, User, Business } from '../types';

interface FundersShowcaseProps {
  funders: ProjectFunder[];
  onFunderClick: (funder: ProjectFunder) => void;
  maxDisplay?: number;
  title?: string;
}

<<<<<<< HEAD
export default function FundersShowcase({
  funders,
  onFunderClick,
  maxDisplay = 5,
  title
}: FundersShowcaseProps) {
  const { t } = useLanguage();
=======
export default function FundersShowcase({ 
  funders, 
  onFunderClick, 
  maxDisplay = 5,
  title = "🏆 Financiado por"
}: FundersShowcaseProps) {
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
  if (funders.length === 0) return null;

  const displayFunders = funders.slice(0, maxDisplay);
  const remainingCount = Math.max(0, funders.length - maxDisplay);

  // Calcular total financiado
  const totalFunded = funders.reduce((sum, funder) => sum + funder.amount_funded, 0);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-yellow-800 flex items-center">
          <span className="mr-2">🏆</span>
<<<<<<< HEAD
          {title || t('funder.funded.by')}
=======
          {title}
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
        </h4>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            ${totalFunded.toLocaleString()}
          </div>
<<<<<<< HEAD
          <div className="text-xs text-gray-600">{t('funder.total.funded')}</div>
=======
          <div className="text-xs text-gray-600">Total financiado</div>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Badges de financiadores */}
        <div className="flex -space-x-2">
          {displayFunders.map((funder) => (
            <FunderBadge
              key={funder.id}
              funder={funder}
              onClick={() => onFunderClick(funder)}
              size="medium"
            />
          ))}
        </div>

        {/* Contador de financiadores adicionales */}
        {remainingCount > 0 && (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-sm">
            +{remainingCount}
          </div>
        )}

        {/* Información adicional */}
        <div className="flex-1 text-right">
          <p className="text-sm font-medium text-yellow-800">
<<<<<<< HEAD
            {funders.length} {funders.length > 1 ? t('funder.count.plural') : t('funder.count.singular')}
          </p>
          <p className="text-xs text-yellow-700">
            {t('funder.project.success')}
=======
            {funders.length} financiador{funders.length > 1 ? 'es' : ''}
          </p>
          <p className="text-xs text-yellow-700">
            Proyecto financiado exitosamente
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
          </p>
        </div>
      </div>

      {/* Mensaje de financiadores destacados */}
      {funders.some(f => f.public_message) && (
        <div className="mt-3 pt-3 border-t border-yellow-300">
          <div className="space-y-2">
            {funders
              .filter(f => f.public_message)
              .slice(0, 2)
              .map((funder) => (
                <div key={funder.id} className="bg-white/50 rounded-lg p-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-yellow-900 text-sm">{funder.funder_name}:</span>
                  </div>
                  <p className="text-xs text-yellow-800 italic">
                    "{funder.public_message}"
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}