import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { User, Business } from '../types';

interface CommunicationHubProps {
  recipient: User | Business;
  onMessage: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onVoiceMessage: () => void;
  onClose: () => void;
}

export default function CommunicationHub({
  recipient,
  onMessage,
  onVoiceCall,
  onVideoCall,
  onVoiceMessage,
  onClose
}: CommunicationHubProps) {
  const [selectedMethod, setSelectedMethod] = useState<'chat' | 'voice' | 'video' | 'audio' | null>(null);
  const { t } = useLanguage();
  
  const recipientName = 'full_name' in recipient ? recipient.full_name : recipient.name;
  const isUser = 'full_name' in recipient;

  const communicationMethods = [
    {
      id: 'chat',
      title: t('communication.chat.title'),
      description: isUser ? t('communication.chat.description') : t('communication.chat.business'),
      emoji: '💬',
      color: 'from-blue-500 to-indigo-600',
      action: onMessage,
      available: true
    },
    {
      id: 'voice',
      title: t('communication.voice.title'),
      description: isUser ? t('communication.voice.description') : t('communication.voice.business'),
      emoji: '📞',
      color: 'from-green-500 to-emerald-600',
      action: onVoiceCall,
      available: isUser || !!onVoiceCall
    },
    {
      id: 'video',
      title: t('communication.video.title'),
      description: t('communication.video.description'),
      emoji: '📹',
      color: 'from-purple-500 to-violet-600',
      action: onVideoCall,
      available: isUser && !!onVideoCall
    },
    {
      id: 'audio',
      title: t('communication.audio.title'),
      description: t('communication.audio.description'),
      emoji: '🎤',
      color: 'from-orange-500 to-red-600',
      action: onVoiceMessage,
      available: true
    }
  ];

  const handleMethodSelect = (method: typeof communicationMethods[0]) => {
    if (!method.available || !method.action) return;
    
    setSelectedMethod(method.id as any);
    
    // Pequeña animación antes de ejecutar
    setTimeout(() => {
      method.action();
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {recipientName.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {recipientName}
            </h2>
            <p className="text-gray-600">
              {isUser ? (recipient as User).profession : (recipient as Business).category}
            </p>
          </div>

          {/* Communication Methods */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
              {t('communication.hub.title')}
            </h3>
            
            {communicationMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method)}
                disabled={!method.available}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : method.available
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:scale-102'
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center text-white text-xl`}>
                    {method.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{method.title}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {method.available && (
                    <div className="text-blue-500">
                      →
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Inteligencia Natural Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-600">🧠</span>
              <span className="font-semibold text-blue-900">{t('communication.natural.intelligence')}</span>
            </div>
            <p className="text-sm text-blue-800">
              {isUser 
                ? t('communication.natural.description')
                : t('communication.natural.business')
              }
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {t('form.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}