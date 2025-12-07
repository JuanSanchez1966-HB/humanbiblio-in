import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useIntelligentConversations(userId: string | null) {
  const [conversations, setConversations] = useState<Record<string, any>>({});

  const findOrCreateConversation = useCallback(async (recipientId: string): Promise<string | null> => {
    if (!userId) return null;
    
    try {
      // Buscar conversación existente
      const { data: existingConversations, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', [userId, recipientId]);

      if (searchError) {
        console.error('Error searching conversations:', searchError);
        throw searchError;
      }

      // Si existe una conversación, devolverla
      if (existingConversations && existingConversations.length > 0) {
        return existingConversations[0].id;
      }

      // Crear nueva conversación
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participants: [userId, recipientId]
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating conversation:', createError);
        throw createError;
      }

      return newConversation.id;
    } catch (error) {
      console.error('Error in findOrCreateConversation:', error);
      return null;
    }
  }, [userId]);

  return {
    conversations,
    findOrCreateConversation
  };
}