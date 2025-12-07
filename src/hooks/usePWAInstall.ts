import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isInstalledApp = isStandalone || isInWebAppiOS;
      setIsInstalled(isInstalledApp);
      
      // Si ya está instalado, no mostrar prompt
      if (isInstalledApp) {
        setShowPrompt(false);
        return;
      }
      
      // En desarrollo, mostrar prompt después de 3 segundos
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed && !isInstalledApp) {
          setShowPrompt(true);
          setIsInstallable(true);
        }
      }, 3000);
    };

    checkIfInstalled();

    // Escuchar evento personalizado para mostrar prompt
    const handleShowPWAPrompt = () => {
      setShowPrompt(true);
      setIsInstallable(true);
    };

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🚀 PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Mostrar prompt automáticamente después de 3 segundos si no está instalado
      if (!isInstalled) {
        setTimeout(() => {
          const dismissed = localStorage.getItem('pwa-install-dismissed');
          if (!dismissed) {
            setShowPrompt(true);
          }
        }, 2000);
      }
    };

    // Escuchar cuando se instala la app
    const handleAppInstalled = () => {
      console.log('✅ PWA: App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      // Limpiar localStorage
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('showPWAPrompt', handleShowPWAPrompt);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('showPWAPrompt', handleShowPWAPrompt);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const installApp = async () => {
    // Si no hay prompt nativo, simular instalación para demo
    if (!deferredPrompt) {
      console.log('🔧 PWA: Simulando instalación para demo');
      
      // Mostrar instrucciones manuales
      const userAgent = navigator.userAgent.toLowerCase();
      let instructions = '';
      
      if (userAgent.includes('chrome')) {
        instructions = 'En Chrome:\n1. Haz clic en los 3 puntos (⋮) en la esquina superior derecha\n2. Selecciona "Instalar HUMANBIBLIO..."\n3. Confirma la instalación';
      } else if (userAgent.includes('firefox')) {
        instructions = 'En Firefox:\n1. Haz clic en el ícono de casa con un + en la barra de direcciones\n2. Selecciona "Instalar"\n3. Confirma la instalación';
      } else if (userAgent.includes('safari')) {
        instructions = 'En Safari (iOS):\n1. Toca el botón de compartir (□↗)\n2. Selecciona "Agregar a pantalla de inicio"\n3. Toca "Agregar"';
      } else {
        instructions = 'Para instalar:\n1. Busca la opción "Instalar app" en el menú de tu navegador\n2. O busca el ícono de instalación en la barra de direcciones';
      }
      
      alert(`📱 ¡HUMANBIBLIO es una PWA instalable!\n\n${instructions}\n\n✨ Una vez instalada, funcionará como una app nativa con acceso offline.`);
      setShowPrompt(false);
      return true;
    }

    try {
      console.log('🚀 PWA: Showing install prompt');
      await deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`✅ PWA: User choice: ${outcome}`);
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ PWA: Error during installation:', error);
      return false;
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Volver a mostrar después de 24 horas
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 24 * 60 * 60 * 1000);
  };

  const resetPrompt = () => {
    localStorage.removeItem('pwa-install-dismissed');
    setShowPrompt(true);
    setIsInstallable(true);
  };

  return {
    isInstallable,
    isInstalled,
    showPrompt,
    installApp,
    dismissPrompt,
    resetPrompt,
    canInstall: !isInstalled // Siempre permitir intento de instalación
  };
}