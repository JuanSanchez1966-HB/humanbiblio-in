import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface ComingSoonCardProps {
  icon: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  launchDate: string;
  featureName: 'calls' | 'translation' | 'crm' | 'yana';
  gradient: string;
}

export default function ComingSoonCard({
  icon,
  title,
  titleEn,
  description,
  descriptionEn,
  features,
  featuresEn,
  launchDate,
  featureName,
  gradient
}: ComingSoonCardProps) {
  const { language } = useLanguage();
  const [interested, setInterested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [priorityVote, setPriorityVote] = useState<number | null>(null);

  const currentTitle = language === 'es' ? title : titleEn;
  const currentDescription = language === 'es' ? description : descriptionEn;
  const currentFeatures = language === 'es' ? features : featuresEn;

  const handleInterest = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert(language === 'es'
          ? 'Por favor inicia sesión para expresar interés'
          : 'Please log in to show interest');
        return;
      }

      const { error } = await supabase
        .from('feature_interest')
        .upsert({
          user_id: user.id,
          feature_name: featureName,
          priority_vote: priorityVote || 3,
          clicked_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,feature_name'
        });

      if (error) throw error;

      setInterested(true);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error recording interest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      setShowFeedback(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('feature_feedback')
        .insert({
          user_id: user.id,
          feature_name: featureName,
          feedback_text: feedbackText
        });

      setShowFeedback(false);
      setFeedbackText('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105">
      {/* Badge "Próximamente" */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
          {language === 'es' ? 'Próximamente' : 'Coming Soon'}
        </span>
      </div>

      {/* Icon */}
      <div className="text-6xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{currentTitle}</h3>

      {/* Description */}
      <p className="text-gray-700 text-base mb-6 leading-relaxed">{currentDescription}</p>

      {/* Features List */}
      <ul className="space-y-3 mb-6">
        {currentFeatures.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2 text-base text-gray-600">
            <span className="text-green-500 mt-0.5 text-lg">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Launch Date */}
      <div className="mb-6 text-base text-gray-600">
        <span className="font-semibold text-gray-900">
          {language === 'es' ? 'Lanzamiento estimado:' : 'Estimated launch:'}{' '}
        </span>
        <span>{launchDate}</span>
      </div>

      {/* Interest Section */}
      {!interested ? (
        <div className="space-y-4">
          {/* Priority Vote */}
          <div>
            <p className="text-base text-gray-700 mb-2 font-medium">
              {language === 'es'
                ? '¿Qué tan importante es esto para ti?'
                : 'How important is this to you?'}
            </p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setPriorityVote(value)}
                  className={`w-12 h-12 rounded-lg font-bold transition-all text-base ${
                    priorityVote === value
                      ? 'bg-blue-600 text-white scale-110 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              1 = {language === 'es' ? 'Poco' : 'Low'} · 5 = {language === 'es' ? 'Muy' : 'Very'}
            </p>
          </div>

          {/* Interest Button */}
          <button
            onClick={handleInterest}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {loading
              ? (language === 'es' ? 'Registrando...' : 'Registering...')
              : (language === 'es' ? '✋ Quiero acceso anticipado' : '✋ I want early access')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Success Message */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="font-bold text-green-800 text-lg mb-1">
              {language === 'es'
                ? '¡Registrado!'
                : 'Registered!'}
            </p>
            <p className="text-base text-green-700">
              {language === 'es'
                ? 'Te avisaremos cuando esté disponible'
                : "We'll notify you when it's available"}
            </p>
          </div>

          {/* Optional Feedback */}
          {showFeedback && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-base mb-2 text-gray-700 font-medium">
                {language === 'es'
                  ? '¿Tienes alguna sugerencia o comentario?'
                  : 'Any suggestions or feedback?'}
              </p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={language === 'es'
                  ? 'Opcional: Cuéntanos qué te gustaría ver...'
                  : 'Optional: Tell us what you\'d like to see...'}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                rows={3}
              />
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleFeedbackSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
                >
                  {language === 'es' ? 'Enviar' : 'Submit'}
                </button>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-base hover:bg-gray-300 transition-colors"
                >
                  {language === 'es' ? 'Omitir' : 'Skip'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
