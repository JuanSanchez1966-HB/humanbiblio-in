import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollableSection from './components/ScrollableSection';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageToggle from './components/LanguageToggle';
import HeroSection from './components/HeroSection';
import FeatureShowcase from './components/FeatureShowcase';
import ImpactMetrics from './components/ImpactMetrics';
import CallToActionSection from './components/CallToActionSection';
import NaturalIntelligenceManifesto from './components/NaturalIntelligenceManifesto';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LogoComponent from './components/LogoComponent';
import MobileWhatsAppDetector from './components/MobileWhatsAppDetector';
import UserCard from './components/UserCard';
import BusinessCard from './components/BusinessCard';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import BoulevardCarousel from './components/BoulevardCarousel';
import BoulevardTabs from './components/BoulevardTabs';
import ExpandedBusinessProfile from './components/ExpandedBusinessProfile';
import CommunicationHub from './components/CommunicationHub';
import AgoraActionButtons from './components/AgoraActionButtons';
import AgoraCarousel from './components/AgoraCarousel';
import VoiceMessageRecorder from './components/VoiceMessageRecorder';
import IntelligentMessagingSystem from './components/IntelligentMessagingSystem';
import AgoraRegistrationForm from './components/AgoraRegistrationForm';
import BoulevardRegistrationForm from './components/BoulevardRegistrationForm';
import AdvancedSearchBar from './components/AdvancedSearchBar';
import SearchResultsDisplay from './components/SearchResultsDisplay';
import UniverseSection from './components/UniverseSection';
import OnboardingTooltip from './components/OnboardingTooltip';
import HelpModal from './components/HelpModal';
import OnboardingFlow from './components/OnboardingFlow';
import FeedbackButton from './components/FeedbackButton';
import MicroSurvey from './components/MicroSurvey';
import SurveyModal from './components/SurveyModal';
import { useUsers, useBusinesses } from './hooks/useSupabaseData';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useAnalytics } from './hooks/useAnalytics';
import { useOnboarding } from './hooks/useOnboarding';
import { useSurveys } from './hooks/useSurveys';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { isDemoMode } from './lib/supabase';
import type { ActiveSection, User, Business } from './types';
import type { ProjectFunder } from './types';

function AppContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { logPageView, logAction } = useAnalytics({
    userId: user?.id,
    enabled: !isDemoMode
  });
  const { hasCompletedOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const { checkScheduledSurveys, checkIfSurveyCompleted } = useSurveys();
  const [activeSection, setActiveSection] = useState<ActiveSection>('agora');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNewOnboarding, setShowNewOnboarding] = useState(false);
  const [activeAgoraTab, setActiveAgoraTab] = useState<'profiles'>('profiles');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [searchResults, setSearchResults] = useState<{
    users: User[];
    businesses: Business[];
  }>({ users: [], businesses: [] });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [expandedBusiness, setExpandedBusiness] = useState<Business | null>(null);
  const [showCommunicationHub, setShowCommunicationHub] = useState<{
    recipient: User | Business | null;
    show: boolean;
  }>({ recipient: null, show: false });
  const [showVoiceRecorder, setShowVoiceRecorder] = useState<{
    recipient: User | null;
    show: boolean;
  }>({ recipient: null, show: false });
  const [showMessaging, setShowMessaging] = useState<{
    recipient: User | Business | null;
    conversationId: string | null;
    show: boolean;
  }>({ recipient: null, conversationId: null, show: false });
  const [showAgoraRegistration, setShowAgoraRegistration] = useState(false);
  const [showBoulevardRegistration, setShowBoulevardRegistration] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activatedWBUsers, setActivatedWBUsers] = useState<Set<string>>(new Set());
  const [showUniverseSection, setShowUniverseSection] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState<any>(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  
  // Mock sponsors para el carrusel de financiadores
  const mockSponsors: ProjectFunder[] = [
    {
      id: 'sponsor-1',
      funder_user_id: '1',
      funder_name: 'Ana García',
      funder_avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      funder_profession: 'Psicóloga Clínica',
      funder_type: 'individual',
      amount_funded: 25000,
      funding_date: new Date().toISOString(),
      recognition_level: 'platinum',
      public_message: 'Apoyo proyectos que mejoran el bienestar mental y la salud emocional de las personas',
      is_wb_business: true,
      wb_business_id: 'wb-ana-garcia'
    },
    {
      id: 'sponsor-2',
      funder_user_id: '2',
      funder_name: 'Carlos Rodríguez',
      funder_avatar: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      funder_profession: 'Desarrollador Full Stack',
      funder_type: 'individual',
      amount_funded: 18000,
      funding_date: new Date().toISOString(),
      recognition_level: 'gold',
      public_message: 'Financio startups tech que usan tecnología para resolver problemas reales',
      is_wb_business: true,
      wb_business_id: 'wb-carlos-rodriguez'
    },
    {
      id: 'sponsor-3',
      funder_user_id: '3',
      funder_name: 'María Santos',
      funder_avatar: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      funder_profession: 'Chef Ejecutiva',
      funder_type: 'individual',
      amount_funded: 12000,
      funding_date: new Date().toISOString(),
      recognition_level: 'silver',
      public_message: 'Apoyo proyectos relacionados con gastronomía sostenible y educación culinaria',
      is_wb_business: true,
      wb_business_id: 'wb-maria-santos'
    },
    {
      id: 'sponsor-4',
      funder_user_id: '4',
      funder_name: 'David Martínez',
      funder_avatar: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      funder_profession: 'Músico y Productor',
      funder_type: 'individual',
      amount_funded: 8000,
      funding_date: new Date().toISOString(),
      recognition_level: 'bronze',
      public_message: 'Financio proyectos que combinan arte, música y tecnología para crear experiencias únicas',
      is_wb_business: true,
      wb_business_id: 'wb-david-martinez'
    }
  ];
  
  // Data hooks
  const { users, loading: usersLoading } = useUsers();
  const { businesses, loading: businessesLoading, refetch: refetchBusinesses } = useBusinesses();
  const { installApp, canInstall } = usePWAInstall();

  // Track page views when section changes
  React.useEffect(() => {
    if (activeSection && !showLandingPage) {
      logPageView(activeSection);
    }
  }, [activeSection, showLandingPage, logPageView]);

  // Show new onboarding for first-time users
  React.useEffect(() => {
    if (user && !hasCompletedOnboarding && !showLandingPage && !showNewOnboarding) {
      const timer = setTimeout(() => {
        setShowNewOnboarding(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, hasCompletedOnboarding, showLandingPage, showNewOnboarding]);

  // Check for scheduled surveys
  React.useEffect(() => {
    if (user && !showNewOnboarding && !showSurveyModal) {
      const checkSurveys = async () => {
        const survey = await checkScheduledSurveys(user.id);
        if (survey) {
          setCurrentSurvey(survey);
          setShowSurveyModal(true);
        }
      };

      const timer = setTimeout(checkSurveys, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, showNewOnboarding, showSurveyModal, checkScheduledSurveys]);

  // Usar resultados de búsqueda o datos completos
  const displayUsers = isSearchActive ? searchResults.users : users;
  const displayBusinesses = isSearchActive ? searchResults.businesses : businesses;

  const handleSearchResults = React.useCallback((results: { users: User[]; businesses: Business[] }) => {
    setSearchResults(results);
    setIsSearchActive(true);
  }, []);

  const handleClearSearch = React.useCallback(() => {
    setSearchResults({ users: [], businesses: [] });
    setIsSearchActive(false);
  }, []);

  const handleMessage = React.useCallback((recipient: User | Business) => {
    logAction('click_message', recipient.id);
    setShowCommunicationHub({ recipient, show: true });
  }, [logAction]);

  const handleCall = React.useCallback((user: User) => {
    logAction('click_call', user.id);
    alert(`📞 Iniciando llamada con ${user.full_name}...`);
  }, [logAction]);

  const handleVideoCall = React.useCallback((user: User) => {
    alert(`📹 Iniciando videollamada con ${user.full_name}...`);
  }, []);

  const handleContact = React.useCallback((business: Business) => {
    setExpandedBusiness(business);
  }, []);


  // Función para manejar navegación WB desde botón verde
  const handleWBNavigation = (user: User) => {
    console.log('🟢 NAVEGANDO A WB PARA:', user.full_name);
    console.log('📊 Datos del usuario:', user);
    
    // Cambiar a World Boulevard
    setActiveSection('boulevard');
    setShowLandingPage(false);
    
    // Buscar o crear negocio del usuario
    setTimeout(() => {
      let userBusiness = businesses.find(b => b.owner_id === user.id);
      
      // Si no existe negocio, crear uno dinámico
      if (!userBusiness) {
        userBusiness = {
          id: `wb-${user.id}`,
          name: `${user.profession} - ${user.full_name}`,
          category: user.profession || 'Servicios Profesionales',
          description: user.bio || `Servicios profesionales especializados de ${user.full_name}`,
          products_services: user.interests || ['Consultoría', 'Servicios Profesionales'],
          owner_id: user.id,
          contact_email: user.email,
          contact_phone: '+34 600 000 000',
          website: null,
          location: user.location,
          avatar_url: user.avatar_url,
          created_at: new Date().toISOString(),
          subscription_tier: 'premium',
          is_featured: true
        };
      }
      
      console.log('🛍️ ABRIENDO PERFIL COMERCIAL:', userBusiness.name);
      setExpandedBusiness(userBusiness);
    }, 500);
  };

  const handleSectionChange = React.useCallback((section: ActiveSection) => {
    setActiveSection(section);
    setShowLandingPage(false);
    setSearchResults({ users: [], businesses: [] });
    setIsSearchActive(false);
  }, []);

  // Exponer función de navegación WB globalmente
  React.useEffect(() => {
    const handleWBNavigationEvent = (event: CustomEvent) => {
      const { user } = event.detail;
      if (user) {
        handleWBNavigation(user);
      }
    };

    const handleAgoraRegistrationEvent = () => {
      setShowAgoraRegistration(true);
    };

    const handleBoulevardRegistrationEvent = () => {
      setShowBoulevardRegistration(true);
    };

    const handleUniverseSectionEvent = () => {
      setShowUniverseSection(true);
    };

    const handleFunderNavigation = (event: CustomEvent) => {
      const { funder, user } = event.detail;

      if (funder.is_wb_business) {
        setActiveSection('boulevard');
        setShowLandingPage(false);
        setShowUniverseSection(false);

        setTimeout(() => {
          const funderBusiness = businesses.find(b => b.id === funder.wb_business_id) || {
            id: funder.wb_business_id || `wb-${user.id}`,
            name: `${user.profession} - ${user.full_name}`,
            category: user.profession || 'Servicios Profesionales',
            description: `${user.bio} • Financiador activo en HUMANBIBLIO`,
            products_services: user.interests || ['Consultoría', 'Financiación de Proyectos'],
            owner_id: user.id,
            contact_email: user.email,
            contact_phone: '+34 600 000 000',
            website: null,
            location: user.location,
            avatar_url: user.avatar_url,
            created_at: new Date().toISOString(),
            subscription_tier: 'premium',
            is_featured: true
          };

          setExpandedBusiness(funderBusiness);
        }, 300);
      } else {
        setActiveSection('agora');
        setShowLandingPage(false);
        setShowUniverseSection(false);
      }
    };

    window.addEventListener('navigateToWBProfile', handleWBNavigationEvent as EventListener);
    window.addEventListener('openAgoraRegistration', handleAgoraRegistrationEvent);
    window.addEventListener('openBoulevardRegistration', handleBoulevardRegistrationEvent);
    window.addEventListener('openUniverseSection', handleUniverseSectionEvent);
    window.addEventListener('navigateToFunderBusiness', handleFunderNavigation as EventListener);
    window.addEventListener('navigateToFunderProfile', handleFunderNavigation as EventListener);

    return () => {
      window.removeEventListener('navigateToWBProfile', handleWBNavigationEvent as EventListener);
      window.removeEventListener('openAgoraRegistration', handleAgoraRegistrationEvent);
      window.removeEventListener('openBoulevardRegistration', handleBoulevardRegistrationEvent);
      window.removeEventListener('openUniverseSection', handleUniverseSectionEvent);
      window.removeEventListener('navigateToFunderBusiness', handleFunderNavigation as EventListener);
      window.removeEventListener('navigateToFunderProfile', handleFunderNavigation as EventListener);
    };
  }, [businesses, users]); // Dependencias vacías para evitar re-renders

  return (
    <ScrollableSection className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Landing Page */}
      {showLandingPage && (
        <div className="min-h-screen overflow-y-auto">
          {/* Header for Landing Page */}
          <div className="absolute top-0 right-0 z-50 p-4 flex items-center space-x-3">
            <LanguageToggle />
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-700 rounded-xl hover:bg-white transition-all duration-300 font-medium text-base shadow-lg"
              title={t('nav.help')}
            >
              <span className="text-xl">💡</span>
              <span>{t('nav.help')}</span>
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
            >
              {t('nav.login')}
            </button>
          </div>

          <HeroSection
            onJoinAgora={() => handleSectionChange('agora')}
            onExploreBoulevard={() => handleSectionChange('boulevard')}
          />
          <FeatureShowcase />
          <ImpactMetrics />
          <CallToActionSection
            onJoinAgora={() => handleSectionChange('agora')}
            onExploreBoulevard={() => handleSectionChange('boulevard')}
            onOpenDashboard={() => handleSectionChange('dashboard')}
          />
          
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSectionChange('agora')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium text-sm shadow-lg"
                >
                  🏛️ Ágora
                </button>
                <button
                  onClick={() => handleSectionChange('boulevard')}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-medium text-sm shadow-lg"
                >
                  🛍️ Boulevard
                </button>
                <button
                  onClick={() => handleSectionChange('dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all duration-300 font-medium text-sm shadow-lg"
                >
                  📊 Dashboard
                </button>
              </div>
            </div>
          </div>
          
          <PWAInstallPrompt />
          <MobileWhatsAppDetector />
        </div>
      )}

      {!showLandingPage && (
        <>
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex items-center justify-between h-28">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowLandingPage(true)}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                    title="Volver al inicio"
                  >
                    <LogoComponent
                      size="medium"
                    />
                  </button>
                </div>

                <nav className="flex items-center space-x-4">
                  <button
                    onClick={() => handleSectionChange('agora')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeSection === 'agora'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                    }`}
                  >
                    <span>{t('nav.agora')}</span>
                  </button>
                  <button
                    onClick={() => handleSectionChange('boulevard')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeSection === 'boulevard'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                    }`}
                  >
                    <span>{t('nav.boulevard')}</span>
                  </button>
                  <button
                    onClick={() => handleSectionChange('dashboard')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeSection === 'dashboard'
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                    }`}
                  >
                    <span>{t('nav.dashboard')}</span>
                  </button>
                </nav>

                <div className="flex items-center space-x-3">
                  {/* Language Toggle */}
                  <LanguageToggle />

                  <button
                    onClick={() => setShowHelp(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-300 font-medium text-base"
                    title={t('nav.help')}
                  >
                    <span className="text-xl">💡</span>
                    <span>{t('nav.help')}</span>
                  </button>

                  {canInstall && (
                    <button
                      onClick={installApp}
                      className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium text-sm shadow-lg"
                    >
                      {t('nav.install')}
                    </button>
                  )}

                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
                  >
                    {t('nav.login')}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
            {activeSection === 'dashboard' ? (
              <ScrollableSection className="min-h-[600px]">
                <Dashboard />
              </ScrollableSection>
            ) : (
              <>
                {/* Advanced Search Bar */}
                <div className="mb-8">
                  <AdvancedSearchBar
                    users={users}
                    businesses={businesses}
                    activeSection={activeSection}
                    onSearchResults={handleSearchResults}
                    className="max-w-4xl mx-auto"
                  />
                </div>

                <div className="text-center mb-12">
                  {activeSection === 'agora' ? (
                    <div>
                      <div className="mb-12">
                        <div className="flex justify-center mb-8">
                          <LogoComponent 
                            size="medium"
                            className="mx-auto"
                          />
                        </div>
                      </div>
                      
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {t('agora.title')}
                      </h2>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        {t('agora.description')}
                      </p>

                      {/* Botón de Registro Ágora */}
                      <div className="mb-8">
                        <button
                          onClick={() => setShowAgoraRegistration(true)}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                          {t('agora.join')}
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                          {t('agora.join.subtitle')}
                        </p>
                      </div>

                      {/* Carrusel Intercultural */}
                      <AgoraCarousel />

                      {/* Botones Estratégicos */}
                      <AgoraActionButtons
                        onWBActivation={(userName) => {
                          const user = users.find(u => u.full_name === userName);
                          if (user) {
                            setActivatedWBUsers(prev => new Set([...prev, user.id]));
                            // Cambiar automáticamente a World Boulevard para ver el resultado
                            setTimeout(() => {
                              setActiveSection('boulevard');
                            }, 1000);
                          }
                        }}
                        availableUsers={users.map(u => ({
                          id: u.id,
                          full_name: u.full_name,
                          is_wb_seller: u.is_wb_seller || false
                        }))}
                      />

                      {/* Nota: YANA (No Estamos Solos) se activará en Año 2, Q1 */}
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {t('boulevard.title')}
                      </h2>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                        {t('boulevard.description')}
                      </p>

                      {/* Botón de Registro Boulevard */}
                      <div className="mb-8">
                        <button
                          onClick={() => setShowBoulevardRegistration(true)}
                          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                          {t('boulevard.register')}
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                          {t('boulevard.register.subtitle')}
                        </p>
                      </div>
                      
                      {/* Carrusel Publicitario */}
                      <BoulevardTabs
                        businesses={businesses}
                        sponsors={mockSponsors}
                        onBusinessClick={handleContact}
                        onSponsorClick={(sponsor) => {
                          console.log('🏆 Click en financiador desde Boulevard:', sponsor.funder_name);
                          
                          // Buscar el usuario financiador
                          const funderUser = users.find(u => u.id === sponsor.funder_user_id);
                          
                          if (funderUser) {
                            if (sponsor.is_wb_business) {
                              // Si tiene negocio en WB, mostrar su perfil comercial
                              const funderBusiness = businesses.find(b => b.id === sponsor.wb_business_id) || {
                                id: sponsor.wb_business_id || `wb-${funderUser.id}`,
                                name: `${funderUser.profession} - ${funderUser.full_name}`,
                                category: funderUser.profession || 'Servicios Profesionales',
                                description: `${funderUser.bio} • Financiador activo en HUMANBIBLIO`,
                                products_services: funderUser.interests || ['Consultoría', 'Financiación de Proyectos'],
                                owner_id: funderUser.id,
                                contact_email: funderUser.email,
                                contact_phone: '+34 600 000 000',
                                website: null,
                                location: funderUser.location,
                                avatar_url: funderUser.avatar_url,
                                created_at: new Date().toISOString(),
                                subscription_tier: 'premium',
                                is_featured: true
                              };
                              
                              setExpandedBusiness(funderBusiness);
                            } else {
                              // Si no tiene negocio, ir al Ágora
                              setActiveSection('agora');
                              alert(`👤 Mostrando perfil de ${sponsor.funder_name} en el Ágora...`);
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Content Grid */}
                {activeSection === 'agora' && (
                  <SearchResultsDisplay
                    users={displayUsers}
                    businesses={displayBusinesses}
                    activeSection={activeSection}
                    searchTerm={isSearchActive ? 'búsqueda activa' : ''}
                    onMessage={handleMessage}
                    onCall={handleCall}
                    onVideoCall={handleVideoCall}
                    onContact={handleContact}
                    loading={usersLoading || businessesLoading}
                  />
                )}

                {activeSection === 'boulevard' && (
                  <SearchResultsDisplay
                    users={displayUsers}
                    businesses={displayBusinesses}
                    activeSection={activeSection}
                    searchTerm={isSearchActive ? 'búsqueda activa' : ''}
                    onMessage={handleMessage}
                    onCall={handleCall}
                    onVideoCall={handleVideoCall}
                    onContact={handleContact}
                    loading={usersLoading || businessesLoading}
                  />
                )}

                {(usersLoading || businessesLoading) && (
                  <div className="text-center py-16">
                    <div className="animate-spin text-6xl mb-6">🧠</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Cargando {activeSection === 'agora' ? 'mentes brillantes' : 'negocios únicos'}...
                    </h3>
                    <p className="text-gray-600">
                      Preparando la mejor experiencia para ti
                    </p>
                  </div>
                )}

                {/* Mostrar usuarios activados en WB */}
                {activeSection === 'boulevard' && (
                  <div className="mt-12">
                    {displayUsers
                      .filter(user => user.is_wb_seller || activatedWBUsers.has(user.id))
                      .map((user) => {
                        const userBusiness: Business = {
                          id: `wb-${user.id}`,
                          name: `${user.profession} - ${user.full_name}`,
                          category: user.profession || 'Servicios Profesionales',
                          description: user.bio || `Servicios profesionales especializados de ${user.full_name}`,
                          products_services: user.interests || ['Consultoría', 'Servicios Profesionales'],
                          owner_id: user.id,
                          contact_email: user.email,
                          contact_phone: '+34 600 000 000',
                          website: null,
                          location: user.location,
                          avatar_url: user.avatar_url,
                          created_at: new Date().toISOString(),
                          subscription_tier: 'premium',
                          is_featured: true
                        };
                        
                        return (
                          <div 
                            key={`wb-${user.id}`} 
                            className="relative cursor-pointer mb-6"
                            onClick={() => setExpandedBusiness(userBusiness)}
                          >
                            <BusinessCard
                              business={userBusiness}
                              onContact={handleContact}
                            />
                            {activatedWBUsers.has(user.id) && (
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                🆕 NUEVO
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </>
            )}
          </main>

          {/* YANA (UniverseSection) desactivado hasta Año 2, Q1 */}
        </>
      )}

      {/* Manifesto Modal */}
      {showManifesto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🧠 La Inteligencia Natural
                </h2>
                <button
                  onClick={() => setShowManifesto(false)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              <NaturalIntelligenceManifesto />
            </div>
          </div>
        </div>
      )}

      {/* Universe Section Modal */}
      {showUniverseSection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  🌌 No Estamos Solos en el Universo
                </h2>
                <button
                  onClick={() => setShowUniverseSection(false)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              <UniverseSection />
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Agora Registration Form */}
      {showAgoraRegistration && (
        <AgoraRegistrationForm
          isOpen={showAgoraRegistration}
          onClose={() => setShowAgoraRegistration(false)}
        />
      )}

      {/* Boulevard Registration Form */}
      {showBoulevardRegistration && (
        <BoulevardRegistrationForm
          isOpen={showBoulevardRegistration}
          onClose={() => setShowBoulevardRegistration(false)}
          onSuccess={() => {
            refetchBusinesses();
            setActiveSection('boulevard');
          }}
        />
      )}

      {/* Expanded Business Profile */}
      {expandedBusiness && (
        <ExpandedBusinessProfile
          business={expandedBusiness}
          onClose={() => setExpandedBusiness(null)}
        />
      )}

      {/* Communication Hub */}
      {showCommunicationHub.show && showCommunicationHub.recipient && (
        <CommunicationHub
          recipient={showCommunicationHub.recipient}
          onMessage={() => {
            setShowCommunicationHub({ recipient: null, show: false });
            setShowMessaging({
              recipient: showCommunicationHub.recipient,
              conversationId: `conv-${Date.now()}`,
              show: true
            });
          }}
          onVoiceCall={() => {
            setShowCommunicationHub({ recipient: null, show: false });
            if ('full_name' in showCommunicationHub.recipient!) {
              handleCall(showCommunicationHub.recipient as User);
            }
          }}
          onVideoCall={() => {
            setShowCommunicationHub({ recipient: null, show: false });
            if ('full_name' in showCommunicationHub.recipient!) {
              handleVideoCall(showCommunicationHub.recipient as User);
            }
          }}
          onVoiceMessage={() => {
            setShowCommunicationHub({ recipient: null, show: false });
            if ('full_name' in showCommunicationHub.recipient!) {
              setShowVoiceRecorder({ 
                recipient: showCommunicationHub.recipient as User, 
                show: true 
              });
            }
          }}
          onClose={() => setShowCommunicationHub({ recipient: null, show: false })}
        />
      )}

      {/* Voice Message Recorder */}
      {showVoiceRecorder.show && showVoiceRecorder.recipient && (
        <VoiceMessageRecorder
          onSendVoiceMessage={(audioBlob) => {
            alert(`🎤 Mensaje de voz enviado a ${showVoiceRecorder.recipient?.full_name}!`);
            setShowVoiceRecorder({ recipient: null, show: false });
          }}
          onCancel={() => setShowVoiceRecorder({ recipient: null, show: false })}
        />
      )}

      {/* Intelligent Messaging System */}
      {showMessaging.show && showMessaging.recipient && (
        <IntelligentMessagingSystem
          recipient={showMessaging.recipient}
          conversationId={showMessaging.conversationId}
          onClose={() => setShowMessaging({ recipient: null, conversationId: null, show: false })}
        />
      )}

      <PWAInstallPrompt />
      <MobileWhatsAppDetector />

      {/* Onboarding Tooltip */}
      {showOnboarding && !hasCompletedOnboarding && (
        <OnboardingTooltip
          steps={[
            {
              id: 'welcome',
              target: 'header',
              title: '¡Bienvenido a HUMANBIBLIO! 🎉',
              description: 'Estás en el Ágora, donde conectas con personas brillantes. Déjame mostrarte las funcionalidades principales.',
              position: 'bottom'
            },
            {
              id: 'search',
              target: '[placeholder*="Busca"]',
              title: 'Búsqueda Inteligente 🔍',
              description: 'Encuentra personas por nombre, profesión, intereses o ubicación. La búsqueda es instantánea y usa filtros avanzados.',
              position: 'bottom'
            },
            {
              id: 'nav-boulevard',
              target: '[class*="from-emerald-500"]',
              title: 'World Boulevard 🛍️',
              description: 'Cambia a World Boulevard para explorar negocios locales y servicios profesionales de la comunidad.',
              position: 'bottom',
              action: {
                label: 'Ver World Boulevard',
                onClick: () => handleSectionChange('boulevard')
              }
            },
            {
              id: 'nav-dashboard',
              target: '[class*="from-purple-500"]',
              title: 'Tu Dashboard 📊',
              description: 'Accede a tu panel personal para gestionar tu perfil, ver estadísticas y configurar tu presencia.',
              position: 'bottom'
            },
            {
              id: 'user-cards',
              target: '[class*="grid"][class*="gap-6"]',
              title: 'Perfiles de Usuarios 👥',
              description: 'Cada tarjeta muestra información clave. Puedes iniciar conversaciones, llamadas o explorar perfiles en World Boulevard.',
              position: 'top'
            }
          ]}
          onComplete={() => {
            completeOnboarding();
            setShowOnboarding(false);
          }}
          onSkip={() => {
            skipOnboarding();
            setShowOnboarding(false);
          }}
        />
      )}

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* New Onboarding Flow */}
      {showNewOnboarding && user && (
        <OnboardingFlow
          userId={user.id}
          onComplete={() => {
            completeOnboarding();
            setShowNewOnboarding(false);
          }}
          onSkip={() => {
            skipOnboarding();
            setShowNewOnboarding(false);
          }}
        />
      )}

      {/* Survey Modal */}
      {showSurveyModal && currentSurvey && user && (
        <SurveyModal
          surveyId={currentSurvey.id}
          userId={user.id}
          title={currentSurvey.title}
          questions={currentSurvey.questions}
          onComplete={() => {
            setShowSurveyModal(false);
            setCurrentSurvey(null);
          }}
          onDismiss={() => {
            setShowSurveyModal(false);
            setCurrentSurvey(null);
          }}
        />
      )}

      {/* Feedback Button */}
      <FeedbackButton />
    </ScrollableSection>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}