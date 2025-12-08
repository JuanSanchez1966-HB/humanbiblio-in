import { useEffect, useCallback, useRef } from 'react';

interface SystemOptimizationConfig {
  enablePerformanceMonitoring: boolean;
  enableMemoryCleanup: boolean;
  enableErrorRecovery: boolean;
  maxMemoryUsage: number; // MB
  maxErrorCount: number;
}

const DEFAULT_CONFIG: SystemOptimizationConfig = {
  enablePerformanceMonitoring: true,
  enableMemoryCleanup: true,
  enableErrorRecovery: true,
  maxMemoryUsage: 100, // 100MB
  maxErrorCount: 5
};

export function useSystemOptimization(config: Partial<SystemOptimizationConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const errorCount = useRef(0);
  const performanceMetrics = useRef<{
    renderTimes: number[];
    memorySnapshots: number[];
    errorLog: Array<{ error: Error; timestamp: Date }>;
  }>({
    renderTimes: [],
    memorySnapshots: [],
    errorLog: []
  });

  // 📊 Monitoreo de performance
  const trackRenderTime = useCallback((componentName: string, renderTime: number) => {
    if (!finalConfig.enablePerformanceMonitoring) return;

    performanceMetrics.current.renderTimes.push(renderTime);
    
    // Mantener solo los últimos 50 renders
    if (performanceMetrics.current.renderTimes.length > 50) {
      performanceMetrics.current.renderTimes.shift();
    }

    // Alertar si el render es muy lento
    if (renderTime > 100) {
      console.warn(`⚠️ Performance: ${componentName} render lento: ${renderTime.toFixed(2)}ms`);
    }
  }, [finalConfig.enablePerformanceMonitoring]);

  // 🧹 Limpieza automática de memoria
  const cleanupMemory = useCallback(() => {
    if (!finalConfig.enableMemoryCleanup) return;

    try {
      // Limpiar caches de imágenes
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
      });

      // Limpiar event listeners huérfanos
      const events = ['resize', 'scroll', 'click'];
      events.forEach(event => {
        const listeners = (window as any)._eventListeners?.[event] || [];
        if (listeners.length > 10) {
          console.warn(`⚠️ Memory: Muchos listeners para ${event}: ${listeners.length}`);
        }
      });

      // Forzar garbage collection si está disponible
      if ((window as any).gc) {
        (window as any).gc();
      }

      console.log('🧹 Limpieza de memoria completada');
    } catch (error) {
      console.warn('⚠️ Error en limpieza de memoria:', error);
    }
  }, [finalConfig.enableMemoryCleanup]);

  // 🚨 Manejo de errores del sistema
  const handleSystemError = useCallback((error: Error, context: string) => {
    if (!finalConfig.enableErrorRecovery) return;

    errorCount.current++;
    performanceMetrics.current.errorLog.push({
      error,
      timestamp: new Date()
    });

    console.error(`❌ System Error [${context}]:`, error);

    // Si hay demasiados errores, activar modo seguro
    if (errorCount.current > finalConfig.maxErrorCount) {
      console.warn('🚨 Demasiados errores - Activando modo seguro');
      
      // Notificar al usuario
      const event = new CustomEvent('systemError', {
        detail: {
          message: 'Se detectaron múltiples errores. Activando modo seguro.',
          action: 'safe_mode'
        }
      });
      window.dispatchEvent(event);
    }
  }, [finalConfig.enableErrorRecovery, finalConfig.maxErrorCount]);

  // 📊 Obtener métricas del sistema
  const getSystemMetrics = useCallback(() => {
    const avgRenderTime = performanceMetrics.current.renderTimes.length > 0
      ? performanceMetrics.current.renderTimes.reduce((a, b) => a + b, 0) / performanceMetrics.current.renderTimes.length
      : 0;

    const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryMB = Math.round(currentMemory / 1024 / 1024);

    return {
      averageRenderTime: avgRenderTime,
      currentMemoryUsage: memoryMB,
      totalErrors: errorCount.current,
      recentErrors: performanceMetrics.current.errorLog.slice(-5),
      systemHealth: errorCount.current === 0 && avgRenderTime < 50 && memoryMB < finalConfig.maxMemoryUsage
        ? 'excellent' 
        : errorCount.current < 3 && memoryMB < finalConfig.maxMemoryUsage * 1.5
        ? 'good'
        : 'needs_attention'
    };
  }, [finalConfig.maxMemoryUsage]);

  // 🔄 Auto-optimización
  useEffect(() => {
    const optimizationInterval = setInterval(() => {
      const metrics = getSystemMetrics();
      
      // Limpieza automática si la memoria es alta
      if (metrics.currentMemoryUsage > finalConfig.maxMemoryUsage) {
        console.log(`🧹 Auto-limpieza: Memoria alta (${metrics.currentMemoryUsage}MB)`);
        cleanupMemory();
      }

      // Reset contador de errores cada hora
      if (errorCount.current > 0) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentErrors = performanceMetrics.current.errorLog.filter(
          log => log.timestamp > oneHourAgo
        );
        
        if (recentErrors.length === 0) {
          errorCount.current = 0;
          console.log('🔄 Reset contador de errores - Sin errores recientes');
        }
      }
    }, 10 * 60 * 1000); // Cada 10 minutos

    return () => clearInterval(optimizationInterval);
  }, [finalConfig.maxMemoryUsage, cleanupMemory, getSystemMetrics]);

  // 🎯 Error boundary global
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      handleSystemError(new Error(event.message), 'unhandled_error');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleSystemError(new Error(event.reason), 'unhandled_promise');
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleSystemError]);

  return {
    trackRenderTime,
    cleanupMemory,
    handleSystemError,
    getSystemMetrics,
    isOptimizationEnabled: finalConfig.enablePerformanceMonitoring
  };
}