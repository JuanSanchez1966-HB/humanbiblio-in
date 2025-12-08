import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { useSurveys } from '../hooks/useSurveys';

interface Question {
  id: string;
  type: 'rating' | 'choice' | 'text' | 'nps';
  question: string;
  scale?: number;
  options?: string[];
  required?: boolean;
}

interface MicroSurveyProps {
  surveyId: string;
  userId: string;
  title: string;
  questions: Question[];
  onComplete: () => void;
  onDismiss: () => void;
}

const MicroSurvey: React.FC<MicroSurveyProps> = ({
  surveyId,
  userId,
  title,
  questions,
  onComplete,
  onDismiss
}) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitSurveyResponse } = useSurveys();

  const handleRatingChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleChoiceChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleTextChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await submitSurveyResponse(surveyId, userId, responses, true);
    setIsSubmitting(false);

    if (success) {
      onComplete();
    }
  };

  const canSubmit = questions.every(q => {
    if (q.required === false) return true;
    return responses[q.id] !== undefined && responses[q.id] !== '';
  });

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 w-96 z-40 animate-slide-up">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{title}</h3>
          <button
            onClick={onDismiss}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {questions.map(question => (
          <div key={question.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required !== false && <span className="text-red-500 ml-1">*</span>}
            </label>

            {question.type === 'rating' && (
              <div className="flex gap-2">
                {Array.from({ length: question.scale || 5 }, (_, i) => i + 1).map(value => (
                  <button
                    key={value}
                    onClick={() => handleRatingChange(question.id, value)}
                    className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                      responses[question.id] === value
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 mx-auto ${
                        responses[question.id] >= value
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {question.type === 'nps' && (
              <div className="flex gap-1">
                {Array.from({ length: 11 }, (_, i) => i).map(value => (
                  <button
                    key={value}
                    onClick={() => handleRatingChange(question.id, value)}
                    className={`flex-1 p-2 rounded border text-sm font-medium transition-all ${
                      responses[question.id] === value
                        ? value <= 6
                          ? 'bg-red-500 text-white border-red-600'
                          : value <= 8
                          ? 'bg-yellow-500 text-white border-yellow-600'
                          : 'bg-green-500 text-white border-green-600'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'choice' && (
              <div className="space-y-2">
                {question.options?.map(option => (
                  <button
                    key={option}
                    onClick={() => handleChoiceChange(question.id, option)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      responses[question.id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <textarea
                value={responses[question.id] || ''}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Escribe tu respuesta..."
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            'Enviando...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar respuesta
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MicroSurvey;
