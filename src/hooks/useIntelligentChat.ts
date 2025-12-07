import { useState, useCallback } from 'react';
import { useAIPersonalities, type AIPersonality } from './useAIPersonalities';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personality?: AIPersonality;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  currentPersonality: AIPersonality | null;
}

export function useIntelligentChat(recipientName: string) {
  const [conversations, setConversations] = useState<Record<string, ConversationState>>({});
  const { detectPersonality, generateResponse, analyzeSentiment } = useAIPersonalities();

  const getConversation = useCallback((conversationId: string): ConversationState => {
    return conversations[conversationId] || {
      messages: [],
      isTyping: false,
      currentPersonality: null
    };
  }, [conversations]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string
  ): Promise<void> => {
    const conversation = getConversation(conversationId);
    
    // Detectar personalidad basada en el contenido y destinatario
    const personality = detectPersonality(content, recipientName);
    const sentiment = analyzeSentiment(content);

    // Crear mensaje del usuario
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      sentiment
    };

    // Actualizar conversación con mensaje del usuario
    setConversations(prev => ({
      ...prev,
      [conversationId]: {
        ...conversation,
        messages: [...conversation.messages, userMessage],
        isTyping: true,
        currentPersonality: personality
      }
    }));

    // Simular tiempo de escritura realista (1-3 segundos)
    const typingTime = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      // Generar respuesta de IA
      const aiResponse = generateResponse(
        content,
        personality,
        conversation.messages.map(m => ({ content: m.content, sender: m.sender }))
      );

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        personality,
        sentiment: 'positive' // Las respuestas de IA son generalmente positivas
      };

      // Actualizar conversación con respuesta de IA
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          messages: [...prev[conversationId].messages, aiMessage],
          isTyping: false
        }
      }));
    }, typingTime);
  }, [recipientName, detectPersonality, generateResponse, analyzeSentiment, getConversation]);

  const clearConversation = useCallback((conversationId: string) => {
    setConversations(prev => ({
      ...prev,
      [conversationId]: {
        messages: [],
        isTyping: false,
        currentPersonality: null
      }
    }));
  }, []);

  const getConversationStats = useCallback((conversationId: string) => {
    const conversation = getConversation(conversationId);
    const userMessages = conversation.messages.filter(m => m.sender === 'user');
    const aiMessages = conversation.messages.filter(m => m.sender === 'ai');
    
    const sentimentCounts = userMessages.reduce((acc, msg) => {
      if (msg.sentiment) {
        acc[msg.sentiment] = (acc[msg.sentiment] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMessages: conversation.messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      currentPersonality: conversation.currentPersonality,
      sentimentAnalysis: sentimentCounts,
      lastActivity: conversation.messages[conversation.messages.length - 1]?.timestamp
    };
  }, [getConversation]);

  return {
    conversations,
    getConversation,
    sendMessage,
    clearConversation,
    getConversationStats
  };
}