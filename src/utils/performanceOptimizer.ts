// ⚡ OPTIMIZADOR DE PERFORMANCE - HUMANBIBLIO
// Utilidades para mejorar el rendimiento del sistema

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// 🔧 Hook para debounce de búsquedas
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 🧠 Hook para memoización inteligente de cálculos IA
export function useAIResponseMemo() {
  const responseCache = useRef<Map<string, string>>(new Map());

  const getMemoizedResponse = useCallback((
    message: string,
    personality: string,
    context: string
  ): string | null => {
    const key = `${message}-${personality}-${context}`;
    return responseCache.current.get(key) || null;
  }, []);

  const setMemoizedResponse = useCallback((
    message: string,
    personality: string,
    context: string,
    response: string
  ) => {
    const key = `${message}-${personality}-${context}`;
    responseCache.current.set(key, response);
    
    // Limpiar cache si crece mucho (máximo 100 entradas)
    if (responseCache.current.size > 100) {
      const firstKey = responseCache.current.keys().next().value;
      responseCache.current.delete(firstKey);
    }
  }, []);

  return { getMemoizedResponse, setMemoizedResponse };
}

// 📊 Hook para monitoreo de performance
export function usePerformanceMonitor() {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    
    // Log si hay demasiados re-renders
    if (renderCount.current > 10) {
      console.warn(`⚠️ Performance: Componente re-renderizado ${renderCount.current} veces`);
    }
  });

  const measureOperation = useCallback(<T>(
    operation: () => T,
    operationName: string
  ): T => {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    
    const duration = end - start;
    if (duration > 100) {
      console.warn(`⚠️ Performance: ${operationName} tomó ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }, []);

  return { renderCount: renderCount.current, measureOperation };
}

// 🖼️ Hook para lazy loading de imágenes
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isInView, src]);

  return { imageSrc, isLoaded, imgRef };
}

// 🔄 Hook para gestión de estado optimizada
export function useOptimizedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const previousState = useRef(initialState);

  const optimizedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prevState)
        : newState;
      
      // Solo actualizar si realmente cambió
      if (JSON.stringify(nextState) !== JSON.stringify(previousState.current)) {
        previousState.current = nextState;
        return nextState;
      }
      
      return prevState;
    });
  }, []);

  return [state, optimizedSetState] as const;
}

// 📱 Hook para detección de dispositivo optimizada
export function useDeviceDetection() {
  return useMemo(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    return {
      isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
      isTablet: /ipad|android(?!.*mobile)/i.test(userAgent),
      isDesktop: !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
      isIOS: /iphone|ipad|ipod/i.test(userAgent),
      isAndroid: /android/i.test(userAgent),
      supportsWebRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      supportsGeolocation: !!navigator.geolocation,
      supportsPWA: 'serviceWorker' in navigator
    };
  }, []);
}

// 🧹 Hook para limpieza automática de memoria
export function useMemoryCleanup() {
  const cleanupTasks = useRef<(() => void)[]>([]);

  const addCleanupTask = useCallback((task: () => void) => {
    cleanupTasks.current.push(task);
  }, []);

  useEffect(() => {
    return () => {
      // Ejecutar todas las tareas de limpieza
      cleanupTasks.current.forEach(task => {
        try {
          task();
        } catch (error) {
          console.warn('Error en limpieza de memoria:', error);
        }
      });
      cleanupTasks.current = [];
    };
  }, []);

  return { addCleanupTask };
}

// 📊 Utilidades de performance
export const PerformanceUtils = {
  // Medir tiempo de operación
  measureTime: <T>(operation: () => T, name: string): T => {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  // Throttle para eventos frecuentes
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Debounce para búsquedas
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    }) as T;
  },

  // Verificar si un objeto cambió realmente
  hasChanged: (prev: any, next: any): boolean => {
    return JSON.stringify(prev) !== JSON.stringify(next);
  },

  // Limpiar URLs de objetos
  revokeObjectURLs: (urls: string[]) => {
    urls.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Error revocando URL:', error);
      }
    });
  }
};

// 🎯 Hook para optimización de listas grandes
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
}

export default {
  useDebounce,
  useAIResponseMemo,
  usePerformanceMonitor,
  useLazyImage,
  useOptimizedState,
  useDeviceDetection,
  useMemoryCleanup,
  useVirtualizedList,
  PerformanceUtils
};