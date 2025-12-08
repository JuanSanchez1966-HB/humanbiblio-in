import React, { useState } from 'react';
import { MessageSquare, X, Send, Bug, Lightbulb, HelpCircle, Frown, Smile } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const FeedbackButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();

  const content = {
    en: {
      button: 'Feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve HUMANBIBLIO',
      selectType: 'What type of feedback?',
      bug: 'Bug Report',
      feature: 'Feature Request',
      help: 'Need Help',
      general: 'General Feedback',
      complaint: 'Complaint',
      praise: 'Praise',
      titleLabel: 'Title',
      titlePlaceholder: 'Brief summary',
      descLabel: 'Description',
      descPlaceholder: 'Tell us more...',
      send: 'Send Feedback',
      sending: 'Sending...',
      cancel: 'Cancel',
      success: 'Thank you for your feedback!',
      successDesc: 'We appreciate you taking the time to help us improve.'
    },
    es: {
      button: 'Feedback',
      title: 'Enviar Feedback',
      subtitle: 'Ayúdanos a mejorar HUMANBIBLIO',
      selectType: '¿Qué tipo de feedback?',
      bug: 'Reportar Error',
      feature: 'Solicitud de Feature',
      help: 'Necesito Ayuda',
      general: 'Feedback General',
      complaint: 'Queja',
      praise: 'Elogio',
      titleLabel: 'Título',
      titlePlaceholder: 'Resumen breve',
      descLabel: 'Descripción',
      descPlaceholder: 'Cuéntanos más...',
      send: 'Enviar Feedback',
      sending: 'Enviando...',
      cancel: 'Cancelar',
      success: '¡Gracias por tu feedback!',
      successDesc: 'Apreciamos que te tomes el tiempo para ayudarnos a mejorar.'
    }
  };

  const t = content[language];

  const feedbackTypes = [
    { id: 'bug', label: t.bug, icon: Bug, color: 'red' },
    { id: 'feature_request', label: t.feature, icon: Lightbulb, color: 'yellow' },
    { id: 'help', label: t.help, icon: HelpCircle, color: 'blue' },
    { id: 'general', label: t.general, icon: MessageSquare, color: 'gray' },
    { id: 'complaint', label: t.complaint, icon: Frown, color: 'orange' },
    { id: 'praise', label: t.praise, icon: Smile, color: 'green' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !feedbackType) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user?.id || null,
          feedback_type: feedbackType,
          title,
          description,
          context: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          },
          status: 'new',
          priority: feedbackType === 'bug' ? 'high' : 'medium'
        });

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
        setFeedbackType('');
        setTitle('');
        setDescription('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorClasses = {
    red: 'border-red-500 bg-red-50 text-red-700',
    yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    blue: 'border-blue-500 bg-blue-50 text-blue-700',
    gray: 'border-gray-500 bg-gray-50 text-gray-700',
    orange: 'border-orange-500 bg-orange-50 text-orange-700',
    green: 'border-green-500 bg-green-50 text-green-700'
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 z-40"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium">{t.button}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            {showSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smile className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.success}</h3>
                <p className="text-gray-600">{t.successDesc}</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t.selectType}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {feedbackTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFeedbackType(type.id)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              feedbackType === type.id
                                ? colorClasses[type.color as keyof typeof colorClasses]
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="w-5 h-5 mb-1" />
                            <span className="text-sm font-medium block">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.titleLabel} *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t.titlePlaceholder}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.descLabel} *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder={t.descPlaceholder}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={!feedbackType || !title || !description || isSubmitting}
                      className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        t.sending
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t.send}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
