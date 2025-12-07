import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content_original: string;
  content_language: string;
  content_translated: string | null;
  translation_language: string | null;
  translation_needed: boolean;
  message_type: 'text' | 'image' | 'voice' | 'video' | 'file';
  is_ai_generated: boolean;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  conversation_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export function useRealTimeMessaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase.rpc('get_user_conversations', {
        p_user_id: user.id
      });

      if (fetchError) throw fetchError;

      setConversations(data || []);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getOrCreateConversation = useCallback(async (otherUserId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error: createError } = await supabase.rpc('get_or_create_conversation', {
        p_user_id_1: user.id,
        p_user_id_2: otherUserId
      });

      if (createError) throw createError;

      await fetchConversations();

      return data;
    } catch (err: any) {
      console.error('Error getting/creating conversation:', err);
      setError(err.message);
      return null;
    }
  }, [user, fetchConversations]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content_original,
          content_language,
          content_translated,
          translation_language,
          translation_needed,
          message_type,
          is_ai_generated,
          created_at
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const messagesWithReadStatus = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: readStatus } = await supabase
            .from('message_read_status')
            .select('id')
            .eq('message_id', msg.id)
            .eq('user_id', user.id)
            .maybeSingle();

          return {
            ...msg,
            is_read: !!readStatus
          };
        })
      );

      setMessages(prev => ({
        ...prev,
        [conversationId]: messagesWithReadStatus
      }));
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    contentLanguage: string = 'auto',
    needsTranslation: boolean = false,
    targetLanguage?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data: messageData, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content_original: content,
          content_language: contentLanguage,
          translation_needed: needsTranslation,
          translation_language: targetLanguage,
          message_type: 'text'
        })
        .select()
        .single();

      if (sendError) throw sendError;

      await fetchMessages(conversationId);
      await fetchConversations();

      return true;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message);
      return false;
    }
  }, [user, fetchMessages, fetchConversations]);

  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      const { error: markError } = await supabase
        .from('message_read_status')
        .insert({
          message_id: messageId,
          user_id: user.id
        });

      if (markError && markError.code !== '23505') {
        throw markError;
      }
    } catch (err: any) {
      console.error('Error marking message as read:', err);
    }
  }, [user]);

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    if (!user || !messages[conversationId]) return;

    const unreadMessages = messages[conversationId].filter(
      msg => msg.sender_id !== user.id && !msg.is_read
    );

    for (const msg of unreadMessages) {
      await markMessageAsRead(msg.id);
    }

    await fetchConversations();
  }, [user, messages, markMessageAsRead, fetchConversations]);

  const setTypingIndicator = useCallback(async (conversationId: string, isTyping: boolean) => {
    if (!user) return;

    try {
      if (isTyping) {
        await supabase
          .from('typing_indicators')
          .upsert({
            conversation_id: conversationId,
            user_id: user.id,
            started_at: new Date().toISOString()
          });
      } else {
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id);
      }
    } catch (err: any) {
      console.error('Error setting typing indicator:', err);
    }
  }, [user]);

  const getUnreadCount = useCallback(async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data, error: countError } = await supabase.rpc('get_unread_message_count', {
        p_user_id: user.id
      });

      if (countError) throw countError;

      return data || 0;
    } catch (err: any) {
      console.error('Error getting unread count:', err);
      return 0;
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    const conversationChannel = supabase
      .channel('conversations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id_1=eq.${user.id},user_id_2=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (messages[newMessage.conversation_id]) {
            fetchMessages(newMessage.conversation_id);
          }
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user, fetchConversations, fetchMessages, messages]);

  return {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    getOrCreateConversation,
    fetchMessages,
    sendMessage,
    markMessageAsRead,
    markConversationAsRead,
    setTypingIndicator,
    getUnreadCount
  };
}
