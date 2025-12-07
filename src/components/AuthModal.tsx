import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingButton from './LoadingButton';
import ErrorMessage from './ErrorMessage';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'ok' | 'blocked'>('unknown');
  const { signIn, signUp, loading, error: authError, clearError } = useAuth();

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  // Reset all states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLocalError(null);
      setIsSubmitting(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setConnectionStatus('unknown');
      clearError();
    }
  }, [isOpen, clearError]);

  // Simplified: Skip connection test for pilot
  useEffect(() => {
    if (isOpen && connectionStatus === 'unknown') {
      setConnectionStatus('ok');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setIsSubmitting(true);

    try {
      console.log('🔐 AuthModal: Starting auth...');

      if (isLogin) {
        await signIn(email, password);
        console.log('✅ AuthModal: Login successful');
      } else {
        await signUp(email, password, { full_name: fullName });
        console.log('✅ AuthModal: Signup successful');
      }

      setIsSubmitting(false);
      onClose();

      // Log action in background (don't await)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          supabase.rpc('log_user_action', {
            p_user_id: user.id,
            p_action_type: isLogin ? 'login' : 'conversion',
            p_target_id: isLogin ? undefined : 'signup',
            p_metadata: { email, fullName, source: 'auth_modal' }
          }).catch(err => console.warn('Analytics error:', err));
        }
      } catch (err) {
        console.warn('Could not log action:', err);
      }
    } catch (error: any) {
      console.error('❌ AuthModal: Error:', error);
      setLocalError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-auth-modal>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? t('auth.login.title') : t('auth.signup.title')}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
            </p>
          </div>


          {localError && (
            <div className="mb-4">
              <ErrorMessage
                type="error"
                message={localError}
                onClose={() => {
                  setLocalError(null);
                  clearError();
                }}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.fullname')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <LoadingButton
              type="submit"
              loading={loading || isSubmitting}
              loadingText={t('auth.processing')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {isLogin ? t('auth.login.button') : t('auth.signup.button')}
            </LoadingButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? t('auth.no.account') : t('auth.have.account')}
            </button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">{t('auth.looking.for')}</p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('openAgoraRegistration'));
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  {t('auth.join.agora')}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('openBoulevardRegistration'));
                  }}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                >
                  {t('auth.register.business')}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}