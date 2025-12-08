import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface TooltipState {
  tooltipId: string;
  seen: boolean;
  dismissed: boolean;
  seenCount: number;
}

export function useTooltips(userId: string | undefined) {
  const [tooltipStates, setTooltipStates] = useState<Map<string, TooltipState>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadTooltipStates();
    }
  }, [userId]);

  const loadTooltipStates = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tooltips_seen')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const statesMap = new Map<string, TooltipState>();
      data?.forEach(item => {
        statesMap.set(item.tooltip_id, {
          tooltipId: item.tooltip_id,
          seen: true,
          dismissed: item.dismissed,
          seenCount: item.seen_count
        });
      });

      setTooltipStates(statesMap);
    } catch (error) {
      console.error('Error loading tooltip states:', error);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowTooltip = useCallback((tooltipId: string, maxShowCount: number = 3): boolean => {
    if (!userId) return false;

    const state = tooltipStates.get(tooltipId);

    if (!state) {
      return true;
    }

    if (state.dismissed) {
      return false;
    }

    return state.seenCount < maxShowCount;
  }, [userId, tooltipStates]);

  const markTooltipSeen = useCallback(async (tooltipId: string) => {
    if (!userId) return;

    try {
      const existingState = tooltipStates.get(tooltipId);

      if (existingState) {
        const { error } = await supabase
          .from('tooltips_seen')
          .update({
            seen_count: existingState.seenCount + 1,
            last_seen_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('tooltip_id', tooltipId);

        if (error) throw error;

        setTooltipStates(prev => {
          const newMap = new Map(prev);
          newMap.set(tooltipId, {
            ...existingState,
            seenCount: existingState.seenCount + 1
          });
          return newMap;
        });
      } else {
        const { error } = await supabase
          .from('tooltips_seen')
          .insert({
            user_id: userId,
            tooltip_id: tooltipId,
            seen_count: 1,
            dismissed: false
          });

        if (error) throw error;

        setTooltipStates(prev => {
          const newMap = new Map(prev);
          newMap.set(tooltipId, {
            tooltipId,
            seen: true,
            dismissed: false,
            seenCount: 1
          });
          return newMap;
        });
      }
    } catch (error) {
      console.error('Error marking tooltip seen:', error);
    }
  }, [userId, tooltipStates]);

  const dismissTooltip = useCallback(async (tooltipId: string) => {
    if (!userId) return;

    try {
      const existingState = tooltipStates.get(tooltipId);

      if (existingState) {
        const { error } = await supabase
          .from('tooltips_seen')
          .update({
            dismissed: true
          })
          .eq('user_id', userId)
          .eq('tooltip_id', tooltipId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tooltips_seen')
          .insert({
            user_id: userId,
            tooltip_id: tooltipId,
            seen_count: 1,
            dismissed: true
          });

        if (error) throw error;
      }

      setTooltipStates(prev => {
        const newMap = new Map(prev);
        newMap.set(tooltipId, {
          tooltipId,
          seen: true,
          dismissed: true,
          seenCount: existingState?.seenCount || 1
        });
        return newMap;
      });
    } catch (error) {
      console.error('Error dismissing tooltip:', error);
    }
  }, [userId, tooltipStates]);

  const resetTooltips = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('tooltips_seen')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setTooltipStates(new Map());
    } catch (error) {
      console.error('Error resetting tooltips:', error);
    }
  }, [userId]);

  return {
    tooltipStates,
    loading,
    shouldShowTooltip,
    markTooltipSeen,
    dismissTooltip,
    resetTooltips
  };
}
