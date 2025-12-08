import React, { useState, useEffect } from 'react';
import { X, Users, Store, Rocket, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface OnboardingFlowProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ userId, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { language } = useLanguage();

  const content = {
    en: {
      welcome: 'Welcome to HUMANBIBLIO',
      subtitle: 'Your human-centered digital ecosystem',
      step1Title: 'Three ecosystems, infinite possibilities',
      step1Desc: 'HUMANBIBLIO connects you with people, businesses, and projects that matter',
      step2Title: 'What brings you here today?',
      step2Desc: 'Choose your main interest (you can explore all later)',
      agora: 'Connect with People',
      agoraDesc: 'Find friends, professionals, and authentic connections',
      boulevard: 'Discover Local Businesses',
      boulevardDesc: 'Support local economy and find trusted services',
      universe: 'Join Projects',
      universeDesc: 'Collaborate on meaningful projects and initiatives',
      step3Title: 'Complete your profile',
      step3Desc: 'Help others discover you by adding a photo and some info',
      step4Title: "You're all set!",
      step4Desc: 'Start exploring and connecting with your community',
      next: 'Next',
      back: 'Back',
      skip: 'Skip for now',
      finish: 'Start exploring',
      getStarted: 'Get started'
    },
    es: {
      welcome: 'Bienvenido a HUMANBIBLIO',
      subtitle: 'Tu ecosistema digital centrado en lo humano',
      step1Title: 'Tres ecosistemas, infinitas posibilidades',
      step1Desc: 'HUMANBIBLIO te conecta con personas, negocios y proyectos que importan',
      step2Title: '¿Qué te trae aquí hoy?',
      step2Desc: 'Elige tu interés principal (puedes explorar todo después)',
      agora: 'Conectar con Personas',
      agoraDesc: 'Encuentra amigos, profesionales y conexiones auténticas',
      boulevard: 'Descubrir Negocios Locales',
      boulevardDesc: 'Apoya la economía local y encuentra servicios de confianza',
      universe: 'Unirte a Proyectos',
      universeDesc: 'Colabora en proyectos e iniciativas significativas',
      step3Title: 'Completa tu perfil',
      step3Desc: 'Ayuda a otros a descubrirte agregando una foto y algo de información',
      step4Title: '¡Todo listo!',
      step4Desc: 'Comienza a explorar y conectar con tu comunidad',
      next: 'Siguiente',
      back: 'Atrás',
      skip: 'Saltar por ahora',
      finish: 'Comenzar a explorar',
      getStarted: 'Comenzar'
    }
  };

  const t = content[language];

  const steps = [
    {
      title: t.step1Title,
      description: t.step1Desc,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Ágora</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'es'
                      ? 'Conexiones auténticas con personas reales'
                      : 'Authentic connections with real people'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-3 rounded-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">World Boulevard</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'es'
                      ? 'Descubre y apoya negocios locales'
                      : 'Discover and support local businesses'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500 p-3 rounded-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Universe</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'es'
                      ? 'Colabora en proyectos que importen'
                      : 'Collaborate on projects that matter'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: t.step2Title,
      description: t.step2Desc,
      content: (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRole('agora')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
              selectedRole === 'agora'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <Users className={`w-8 h-8 ${selectedRole === 'agora' ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t.agora}</h3>
                <p className="text-sm text-gray-600">{t.agoraDesc}</p>
              </div>
              {selectedRole === 'agora' && (
                <CheckCircle className="w-6 h-6 text-blue-500 ml-auto" />
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('boulevard')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
              selectedRole === 'boulevard'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <Store className={`w-8 h-8 ${selectedRole === 'boulevard' ? 'text-green-500' : 'text-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t.boulevard}</h3>
                <p className="text-sm text-gray-600">{t.boulevardDesc}</p>
              </div>
              {selectedRole === 'boulevard' && (
                <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('universe')}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
              selectedRole === 'universe'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <Rocket className={`w-8 h-8 ${selectedRole === 'universe' ? 'text-orange-500' : 'text-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t.universe}</h3>
                <p className="text-sm text-gray-600">{t.universeDesc}</p>
              </div>
              {selectedRole === 'universe' && (
                <CheckCircle className="w-6 h-6 text-orange-500 ml-auto" />
              )}
            </div>
          </button>
        </div>
      )
    },
    {
      title: t.step4Title,
      description: t.step4Desc,
      content: (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <p className="text-gray-600 mb-4">
            {language === 'es'
              ? 'Has completado la configuración inicial. ¡Es hora de explorar!'
              : "You've completed the initial setup. Time to explore!"}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            {language === 'es'
              ? '💡 Consejo: Puedes acceder a ayuda en cualquier momento usando el botón de ayuda'
              : '💡 Tip: You can access help anytime using the help button'}
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      await updateProgress(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    try {
      await supabase
        .from('user_onboarding_progress')
        .upsert({
          user_id: userId,
          current_step: currentStep,
          skipped: true,
          completed: false
        });
      onSkip();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      onSkip();
    }
  };

  const updateProgress = async (step: number) => {
    try {
      await supabase
        .from('user_onboarding_progress')
        .upsert({
          user_id: userId,
          current_step: step,
          selected_role: selectedRole || null,
          completed: false,
          skipped: false
        });
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await supabase
        .from('user_onboarding_progress')
        .upsert({
          user_id: userId,
          current_step: steps.length,
          selected_role: selectedRole || null,
          completed: true,
          completed_at: new Date().toISOString(),
          skipped: false
        });
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete();
    }
  };

  const canProceed = currentStep === 0 || currentStep === 2 || (currentStep === 1 && selectedRole);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
              <p className="text-gray-600 mt-1">{steps[currentStep].description}</p>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {steps[currentStep].content}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            {t.skip}
          </button>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? t.finish : t.next}
              {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
