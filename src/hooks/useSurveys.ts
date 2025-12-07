import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Survey {
  id: string;
  survey_type: string;
  trigger_context: string;
  title: string;
  questions: Question[];
  priority: number;
}

interface Question {
  id: string;
  type: 'rating' | 'choice' | 'text' | 'nps';
  question: string;
  scale?: number;
  options?: string[];
  required?: boolean;
}

interface SurveyResponse {
  survey_id: string;
  responses: Record<string, any>;
  completed: boolean;
}

export function useSurveys() {
  const [availableSurveys, setAvailableSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSurveys = useCallback(async (triggerContext?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('surveys')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false });

      if (triggerContext) {
        query = query.eq('trigger_context', triggerContext);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAvailableSurveys(data || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkIfSurveyCompleted = useCallback(async (surveyId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('survey_id', surveyId)
        .eq('user_id', userId)
        .eq('completed', true)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking survey completion:', error);
      return false;
    }
  }, []);

  const submitSurveyResponse = useCallback(async (
    surveyId: string,
    userId: string,
    responses: Record<string, any>,
    completed: boolean = true
  ) => {
    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          survey_id: surveyId,
          user_id: userId,
          responses,
          completed
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error submitting survey response:', error);
      return false;
    }
  }, []);

  const getSurveyByTrigger = useCallback(async (triggerContext: string, userId: string) => {
    try {
      const { data: surveys, error: surveysError } = await supabase
        .from('surveys')
        .select('*')
        .eq('active', true)
        .eq('trigger_context', triggerContext)
        .order('priority', { ascending: false });

      if (surveysError) throw surveysError;

      if (!surveys || surveys.length === 0) return null;

      for (const survey of surveys) {
        const completed = await checkIfSurveyCompleted(survey.id, userId);
        if (!completed) {
          return survey;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting survey by trigger:', error);
      return null;
    }
  }, [checkIfSurveyCompleted]);

  const checkScheduledSurveys = useCallback(async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return null;

      const accountAge = Math.floor(
        (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      let triggerContext = null;
      if (accountAge === 1) triggerContext = 'day_1';
      else if (accountAge === 7) triggerContext = 'day_7';
      else if (accountAge === 14) triggerContext = 'day_14';
      else if (accountAge === 30) triggerContext = 'day_30';

      if (triggerContext) {
        return await getSurveyByTrigger(triggerContext, userId);
      }

      return null;
    } catch (error) {
      console.error('Error checking scheduled surveys:', error);
      return null;
    }
  }, [getSurveyByTrigger]);

  return {
    availableSurveys,
    loading,
    fetchSurveys,
    checkIfSurveyCompleted,
    submitSurveyResponse,
    getSurveyByTrigger,
    checkScheduledSurveys
  };
}
