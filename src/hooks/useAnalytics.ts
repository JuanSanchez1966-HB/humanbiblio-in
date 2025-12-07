import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface UseAnalyticsOptions {
  userId?: string;
  enabled?: boolean;
}

// Lista de IDs mock conocidos para filtrar de analytics
const MOCK_USER_IDS = ['1', '2', '3', '4', '5'];
const MOCK_BUSINESS_IDS = ['wb-ana-garcia', 'wb-carlos-rodriguez', 'wb-maria-santos', 'wb-david-martinez'];

// Función auxiliar para detectar IDs mock
function isMockId(id: string): boolean {
  return (
    MOCK_USER_IDS.includes(id) ||
    MOCK_BUSINESS_IDS.includes(id) ||
    id.startsWith('DEMO-') ||
    id.startsWith('wb-') && MOCK_BUSINESS_IDS.includes(id)
  );
}

export function useAnalytics({ userId, enabled = true }: UseAnalyticsOptions = {}) {
  const sessionIdRef = useRef<string>(
    typeof window !== 'undefined'
      ? sessionStorage.getItem('analytics_session_id') || crypto.randomUUID()
      : crypto.randomUUID()
  );

  // Guardar session ID
  useEffect(() => {
    if (typeof window !== 'undefined' && enabled) {
      sessionStorage.setItem('analytics_session_id', sessionIdRef.current);
    }
  }, [enabled]);

  // Cerrar sesión al salir
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      closeSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);

  // Log page view
  const logPageView = useCallback(
    async (
      pageType: 'agora' | 'boulevard' | 'universe' | 'profile' | 'business' | 'project' | 'home' | 'dashboard',
      pageId?: string
    ) => {
      if (!enabled) return;

      // Filtrar IDs de perfiles mock para evitar contaminación
      if (pageId && isMockId(pageId)) {
        console.log('🎭 Vista de perfil mock - no se registra en analytics');
        return;
      }

      try {
        await supabase.rpc('log_page_view', {
          p_user_id: userId || null,
          p_session_id: sessionIdRef.current,
          p_page_type: pageType,
          p_page_id: pageId || null,
          p_referrer: document.referrer || null,
          p_user_agent: navigator.userAgent
        });
      } catch (error) {
        console.error('Error logging page view:', error);
      }
    },
    [userId, enabled]
  );

  // Log user action
  const logAction = useCallback(
    async (
      actionType:
        | 'click_call'
        | 'click_whatsapp'
        | 'click_message'
        | 'click_email'
        | 'search_users'
        | 'search_businesses'
        | 'search_projects'
        | 'like_project'
        | 'share'
        | 'save'
        | 'create_profile'
        | 'create_business'
        | 'create_project'
        | 'upload_image'
        | 'update_profile',
      targetId?: string,
      metadata?: Record<string, any>
    ) => {
      if (!enabled) return;

      // Filtrar acciones sobre perfiles mock para evitar contaminación
      if (targetId && isMockId(targetId)) {
        console.log('🎭 Acción sobre perfil mock - no se registra en analytics');
        return;
      }

      try {
        await supabase.rpc('log_user_action', {
          p_user_id: userId || null,
          p_session_id: sessionIdRef.current,
          p_action_type: actionType,
          p_action_target: null,
          p_target_id: targetId || null,
          p_metadata: metadata || {}
        });
      } catch (error) {
        console.error('Error logging action:', error);
      }
    },
    [userId, enabled]
  );

  // Log conversion event
  const logConversion = useCallback(
    async (
      eventType:
        | 'signup'
        | 'first_login'
        | 'profile_completed'
        | 'first_connection'
        | 'first_message'
        | 'first_search'
        | 'business_created'
        | 'project_created'
        | 'first_image_upload'
        | 'location_shared',
      eventData?: Record<string, any>
    ) => {
      if (!enabled || !userId) return;

      try {
        await supabase.from('conversion_events').insert({
          user_id: userId,
          event_type: eventType,
          event_data: eventData || {}
        });
      } catch (error) {
        console.error('Error logging conversion:', error);
      }
    },
    [userId, enabled]
  );

  // Close session
  const closeSession = useCallback(async () => {
    if (!enabled) return;

    try {
      await supabase.rpc('close_session', {
        p_session_id: sessionIdRef.current,
        p_end_time: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error closing session:', error);
    }
  }, [enabled]);

  return {
    sessionId: sessionIdRef.current,
    logPageView,
    logAction,
    logConversion,
    closeSession
  };
}
