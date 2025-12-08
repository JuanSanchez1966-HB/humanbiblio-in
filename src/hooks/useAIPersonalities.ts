import { useState, useCallback } from 'react';

export interface AIPersonality {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  expertise: string[];
  personality_traits: string[];
  response_style: string;
  greeting: string;
}

export const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'professional-coach',
    name: 'Professional Coach',
    profession: 'Networking & Communication Expert',
    avatar: '💼',
    expertise: ['networking', 'professional communication', 'career development', 'relationship building', 'conversation starters', 'professional etiquette', 'collaboration', 'personal branding'],
    personality_traits: ['supportive', 'encouraging', 'professional', 'insightful', 'strategic'],
    response_style: 'Provides thoughtful suggestions for professional networking and communication. Offers conversation starters, helps craft meaningful messages, and supports authentic connection building.',
    greeting: '👋 Hi! I\'m your Professional Coach. I\'m here to help you build meaningful professional connections and communicate effectively. How can I assist you today?'
  }
];

export function useAIPersonalities() {
  const [currentPersonality, setCurrentPersonality] = useState<AIPersonality | null>(AI_PERSONALITIES[0]);

  const detectPersonality = useCallback((_message: string, _recipientName: string): AIPersonality => {
    return AI_PERSONALITIES[0];
  }, []);

  const generateResponse = useCallback((
    message: string,
    personality: AIPersonality,
    conversationHistory: Array<{content: string, sender: 'user' | 'ai'}>
  ): string => {
    return generateProfessionalCoachResponse(message, conversationHistory);
  }, []);

  const analyzeSentiment = useCallback((message: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['great', 'excellent', 'perfect', 'thanks', 'happy', 'glad', 'wonderful', 'appreciate'];
    const negativeWords = ['bad', 'terrible', 'problem', 'issue', 'worried', 'concerned', 'difficult', 'challenge'];

    const messageLower = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => messageLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => messageLower.includes(word)).length;

    if (positiveCount > negativeCount) {
      return 'positive';
    } else if (negativeCount > positiveCount) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }, []);

  return {
    detectPersonality,
    generateResponse,
    analyzeSentiment,
    currentPersonality
  };
}

function generateProfessionalCoachResponse(message: string, history: Array<{content: string, sender: 'user' | 'ai'}>): string {
  const messageLower = message.toLowerCase();

  if (messageLower.includes('connect') || messageLower.includes('networking')) {
    return "Great! Building meaningful connections is all about authenticity. Here's a suggestion: Start with a genuine compliment about their work or experience, then ask an open-ended question related to their expertise. Would you like me to help you craft a specific message?";
  }

  if (messageLower.includes('message') || messageLower.includes('write')) {
    return "Crafting the right message is key. Focus on these elements: 1) Personalize it to their background, 2) Be clear about your intention, 3) Show genuine interest, 4) Keep it concise. What type of message are you looking to send?";
  }

  if (messageLower.includes('help') || messageLower.includes('advice')) {
    return "I'm here to support your professional growth! Whether it's networking strategies, communication tips, or building your personal brand, I can help. What specific area would you like to focus on?";
  }

  if (messageLower.includes('meet') || messageLower.includes('introduction')) {
    return "First impressions matter! When meeting someone new professionally: Be punctual, prepare thoughtful questions, listen actively, and follow up within 24-48 hours. What's your goal for this connection?";
  }

  return "As your Professional Coach, I'm here to help you navigate professional relationships authentically. Whether it's starting conversations, building your network, or advancing your career, I've got your back. What would you like to work on?";
}
