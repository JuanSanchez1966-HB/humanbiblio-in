import React, { useState } from 'react';
import { X, Star, Send, MessageCircle } from 'lucide-react';
import { useSurveys } from '../hooks/useSurveys';

interface Question {
  id: string;
  type: 'rating' | 'choice' | 'text' | 'nps';
  question: string;
  scale?: number;
  options?: string[];
  required?: boolean;
}

interface SurveyModalProps {
  surveyId: string;
  userId: string;
  title: string;
  questions: Question[];
  onComplete: () => void;
  onDismiss: () => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({
  surveyId,
  userId,
  title,
  questions,
  onComplete,
  onDismiss
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitSurveyResponse } = useSurveys();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleRatingChange = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleChoiceChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleTextChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const canProceed = () => {
    if (currentQuestion.required === false) return true;
    const response = responses[currentQuestion.id];
    return response !== undefined && response !== '';
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      const success = await submitSurveyResponse(surveyId, userId, responses, true);
      setIsSubmitting(false);

      if (success) {
        onComplete();
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index < currentQuestionIndex
                    ? 'bg-green-500'
                    : index === currentQuestionIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>

        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          <label className="block text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.question}
            {currentQuestion.required !== false && <span className="text-red-500 ml-1">*</span>}
          </label>

          {currentQuestion.type === 'rating' && (
            <div className="flex justify-center gap-3">
              {Array.from({ length: currentQuestion.scale || 5 }, (_, i) => i + 1).map(value => (
                <button
                  key={value}
                  onClick={() => handleRatingChange(value)}
                  className={`w-16 h-16 rounded-xl border-2 transition-all ${
                    responses[currentQuestion.id] === value
                      ? 'border-yellow-500 bg-yellow-50 scale-110'
                      : 'border-gray-200 hover:border-yellow-300 hover:scale-105'
                  }`}
                >
                  <Star
                    className={`w-8 h-8 mx-auto ${
                      responses[currentQuestion.id] >= value
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                  <span className="text-xs text-gray-600 mt-1 block">{value}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'nps' && (
            <div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 11 }, (_, i) => i).map(value => (
                  <button
                    key={value}
                    onClick={() => handleRatingChange(value)}
                    className={`flex-1 p-3 rounded-lg border-2 text-sm font-bold transition-all ${
                      responses[currentQuestion.id] === value
                        ? value <= 6
                          ? 'bg-red-500 text-white border-red-600 scale-110'
                          : value <= 8
                          ? 'bg-yellow-500 text-white border-yellow-600 scale-110'
                          : 'bg-green-500 text-white border-green-600 scale-110'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poco probable</span>
                <span>Muy probable</span>
              </div>
            </div>
          )}

          {currentQuestion.type === 'choice' && (
            <div className="space-y-3">
              {currentQuestion.options?.map(option => (
                <button
                  key={option}
                  onClick={() => handleChoiceChange(option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    responses[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        responses[currentQuestion.id] === option
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {responses[currentQuestion.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <textarea
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
              rows={6}
              placeholder="Escribe tu respuesta aquí..."
            />
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Atrás
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              'Enviando...'
            ) : isLastQuestion ? (
              <>
                <Send className="w-4 h-4" />
                Enviar
              </>
            ) : (
              'Siguiente'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
