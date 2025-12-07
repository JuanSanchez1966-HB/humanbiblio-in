import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface SearchFilters {
  category?: string;
  location?: string;
  interests?: string[];
  profession?: string;
}

interface ProfileResult {
  id: string;
  full_name: string;
  profession: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  interests: string[] | null;
  rank: number;
}

interface BusinessResult {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string | null;
  avatar_url: string | null;
  is_featured: boolean;
  rank: number;
}

export function useSupabaseSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProfiles = useCallback(async (
    searchTerm: string,
    filters: SearchFilters = {},
    limit: number = 50
  ): Promise<ProfileResult[]> => {
    setIsSearching(true);
    setError(null);

    try {
      if (!searchTerm.trim()) {
        let query = supabase
          .from('profiles')
          .select('id, full_name, profession, bio, location, avatar_url, interests')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (filters.profession) {
          query = query.eq('profession', filters.profession);
        }
        if (filters.location) {
          query = query.eq('location', filters.location);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        return (data || []).map(profile => ({
          ...profile,
          rank: 100
        }));
      }

      const { data, error: searchError } = await supabase.rpc('search_profiles', {
        search_query: searchTerm,
        filter_profession: filters.profession || null,
        filter_location: filters.location || null,
        result_limit: limit
      });

      if (searchError) throw searchError;

      return data || [];
    } catch (err: any) {
      console.error('Error searching profiles:', err);
      setError(err.message);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const searchBusinesses = useCallback(async (
    searchTerm: string,
    filters: SearchFilters = {},
    onlyApproved: boolean = true,
    limit: number = 50
  ): Promise<BusinessResult[]> => {
    setIsSearching(true);
    setError(null);

    try {
      if (!searchTerm.trim()) {
        let query = supabase
          .from('wb_businesses')
          .select('id, name, category, description, location, avatar_url, is_featured')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit);

        if (onlyApproved) {
          query = query.eq('is_approved', true);
        }
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.location) {
          query = query.eq('location', filters.location);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        return (data || []).map(business => ({
          ...business,
          rank: 100
        }));
      }

      const { data, error: searchError } = await supabase.rpc('search_businesses', {
        search_query: searchTerm,
        filter_category: filters.category || null,
        filter_location: filters.location || null,
        only_approved: onlyApproved,
        result_limit: limit
      });

      if (searchError) throw searchError;

      return data || [];
    } catch (err: any) {
      console.error('Error searching businesses:', err);
      setError(err.message);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const getSearchStats = useCallback(async () => {
    try {
      const { data, error: statsError } = await supabase.rpc('get_search_stats');

      if (statsError) throw statsError;

      return data || [];
    } catch (err: any) {
      console.error('Error getting search stats:', err);
      return [];
    }
  }, []);

  return {
    searchProfiles,
    searchBusinesses,
    getSearchStats,
    isSearching,
    error
  };
}
