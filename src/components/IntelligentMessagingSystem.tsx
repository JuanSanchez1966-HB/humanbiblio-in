import React, { useState, useEffect, useRef } from 'react';
import { useIntelligentChat } from '../hooks/useIntelligentChat';
import type { User, Business } from '../types';

interface IntelligentMessagingSystemProps {
  recipient: User | Business;
  conversationId: string | null;
  onClose: () => void;
}

export default function IntelligentMessagingSystem({ 
  recipient, 
  conversationId, 
  onClose 
}: IntelligentMessagingSystemProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const recipientName = 'full_name' in recipient ? recipient.full_name : recipient.name;
  const { getConversation, sendMessage, getConversationStats } = useIntelligentChat(recipientName);
  
  const conversation = conversationId ? getConversation(conversationId) : null;
  const stats = conversationId ? getConversationStats(conversationId) : null;

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    await sendMessage(conversationId, message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation || !conversationId) {
    return null;
  }

  const isAIEnabled = 'full_name' in recipient; // Solo usuarios tienen IA

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {recipientName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{recipientName}</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">En línea</span>
                {isAIEnabled && conversation.currentPersonality && (
                  <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    <span>🧠</span>
                    <span>IA Contextual Activado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* AI Personality Banner */}
        {isAIEnabled && conversation.currentPersonality && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 p-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{conversation.currentPersonality.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-blue-900">{conversation.currentPersonality.name}</span>
                  <span className="text-blue-700">•</span>
                  <span className="text-blue-700 text-sm">{conversation.currentPersonality.profession}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {conversation.currentPersonality.expertise.slice(0, 4).map((skill, index) => (
                    <span key={index} className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                🎯 Respuestas Contextuales
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">
                {isAIEnabled ? '🧠' : '💬'}
              </div>
              <p className="text-lg font-medium mb-2">
                {isAIEnabled ? 'Chat IA Ultra-Inteligente' : 'Nueva Conversación'}
              </p>
              <p className="text-sm">
                {isAIEnabled 
                  ? `Inicia una conversación con ${recipientName}. La IA responderá según su expertise profesional.`
                  : `Inicia una conversación con ${recipientName}`
                }
              </p>
              {isAIEnabled && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-left max-w-md mx-auto">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Funcionalidades IA:</h4>
                  <div className="space-y-1 text-xs text-blue-800">
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                      <span>Respuestas según expertise profesional</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                      <span>Análisis de sentimiento automático</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                      <span>Memoria conversacional</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                      <span>Timing de respuesta humano</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                  {msg.sender === 'ai' && msg.personality && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                      {msg.personality.avatar}
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                      {msg.sentiment && (
                        <span className={`text-xs ml-2 ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                          {msg.sentiment === 'positive' ? '😊' : 
                           msg.sentiment === 'negative' ? '😔' : '😐'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Typing indicator */}
          {conversation.isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                {conversation.currentPersonality && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                    {conversation.currentPersonality.avatar}
                  </div>
                )}
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {conversation.currentPersonality?.name || recipientName} está escribiendo...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Stats Bar (solo para IA) */}
        {isAIEnabled && stats && stats.totalMessages > 0 && (
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{stats.totalMessages} mensajes</span>
              {stats.sentimentAnalysis && (
                <div className="flex items-center space-x-2">
                  {stats.sentimentAnalysis.positive && (
                    <span className="flex items-center">
                      😊 {stats.sentimentAnalysis.positive}
                    </span>
                  )}
                  {stats.sentimentAnalysis.negative && (
                    <span className="flex items-center">
                      😔 {stats.sentimentAnalysis.negative}
                    </span>
                  )}
                  {stats.sentimentAnalysis.neutral && (
                    <span className="flex items-center">
                      😐 {stats.sentimentAnalysis.neutral}
                    </span>
                  )}
                </div>
              )}
              {stats.currentPersonality && (
                <span className="text-blue-600">
                  IA: {stats.currentPersonality.name}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isAIEnabled 
                  ? `Escribe a ${recipientName}... (La IA responderá según su expertise)`
                  : `Escribe tu mensaje a ${recipientName}...`
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={conversation.isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || conversation.isTyping}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {conversation.isTyping ? '⏳' : '📤'}
            </button>
          </div>
          
          {isAIEnabled && (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="mr-1">🧠</span>
              Las respuestas son generadas por IA basándose en el expertise profesional de {recipientName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}