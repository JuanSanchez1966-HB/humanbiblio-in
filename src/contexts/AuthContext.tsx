import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import TermsModal from '../components/TermsModal';
import { getErrorMessage } from '../utils/errorMessages';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  // PILOT MODE: Terms acceptance disabled for quick launch
  // const [needsTermsAcceptance, setNeedsTermsAcceptance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    let mounted = true;
    
    // Si estamos en modo demo, saltar autenticación
    if (isDemoMode) {
      console.log('🎭 AuthContext: Modo demo - saltando autenticación');
      setInitialLoading(false);
      return;
    }
    
    console.log('🔗 AuthContext: Iniciando autenticación con Supabase...');
    
    // Obtener sesión inicial
    const initializeAuth = async () => {
      try {
        console.log('🔍 AuthContext: Obteniendo sesión inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.warn('⚠️ AuthContext: Error de sesión:', error);
          setInitialLoading(false);
          return;
        }
        
        console.log('✅ AuthContext: Sesión obtenida:', session ? 'Usuario logueado' : 'Sin sesión');
        setSession(session);
        
        if (session?.user) {
          console.log('👤 AuthContext: Cargando perfil de usuario...');
          await fetchUserProfile(session.user.id);
        }
        
        setInitialLoading(false);
      } catch (error) {
        console.error('❌ AuthContext: Error de inicialización:', error);
        if (mounted) {
          setInitialLoading(false);
        }
      }
    };
    
    // Timeout de seguridad - máximo 10 segundos
    const timeout = setTimeout(() => {
      if (mounted && initialLoading) {
        console.log('⏰ AuthContext: Timeout (10s) - continuando');
        setInitialLoading(false);
      }
    }, 10000);
    
    initializeAuth();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      
      setInitialLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // PILOT MODE: Terms acceptance check disabled for quick launch
  /*
  const checkTermsAcceptance = async (userId: string) => {
    if (isDemoMode) return;

    try {
      const { data, error } = await supabase.rpc('user_has_accepted_current_terms', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error checking terms:', error);
        return;
      }

      setNeedsTermsAcceptance(!data);
    } catch (error) {
      console.error('Error checking terms acceptance:', error);
    }
  };
  */

  const fetchUserProfile = async (userId: string) => {
    console.log('👤 Cargando perfil de usuario:', userId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        console.log('✅ Perfil cargado exitosamente');
        console.log('🚀 PILOT MODE: Terms check skipped for quick launch');
        setUser(data);
        setUserProfile(data);

        // PILOT MODE: Terms acceptance check disabled
        // await checkTermsAcceptance(userId);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      alert('🎭 Modo Demo: La autenticación real requiere configurar Supabase');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('🔐 Iniciando login para:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔴 Error de login:', error);
        throw error;
      }

      console.log('✅ Login exitoso:', data.user?.email);
    } catch (err: any) {
      console.error('🔴 Error capturado:', err);
      const friendlyMessage = getErrorMessage(err);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    if (isDemoMode) {
      alert('🎭 Modo Demo: El registro real requiere configurar Supabase');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('📝 Iniciando registro para:', email);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: userData.full_name || 'Nuevo Usuario',
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      console.log('✅ Usuario creado:', authData.user.email);

      // Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: userData.full_name || 'Nuevo Usuario',
          profession: userData.profession || null,
          bio: userData.bio || null,
          interests: userData.interests || [],
          location: userData.location || null,
          country: userData.country || null,
          country_flag: userData.country_flag || null,
          native_language: userData.native_language || null,
          languages_spoken: userData.languages_spoken || [],
          avatar_url: userData.avatar_url || null,
          is_wb_seller: userData.is_wb_seller || false,
          wb_profile_id: userData.wb_profile_id || null,
          wb_subscription_active: userData.wb_subscription_active || false,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      console.log('✅ Registro completado');
    } catch (err: any) {
      console.error('🔴 Error en registro:', err);
      const friendlyMessage = getErrorMessage(err);
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      console.log('🎭 Modo demo - no hay sesión real que cerrar');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    setUser(null);
    setUserProfile(null);
    setSession(null);
  };

  // Mostrar loading inicial
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              🏛️
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Conectando con HUMANBIBLIO
          </h3>
          <p className="text-gray-600">
            Cargando tu sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      session,
      signIn,
      signUp,
      signOut,
      loading,
      error,
      clearError
    }}>
      {children}

      {/* PILOT MODE: Terms Modal disabled for quick launch */}
      {/*
      {needsTermsAcceptance && user && !isDemoMode && (
        <TermsModal
          userId={user.id}
          onAccept={() => {
            setNeedsTermsAcceptance(false);
          }}
          onDecline={async () => {
            await signOut();
          }}
        />
      )}
      */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}