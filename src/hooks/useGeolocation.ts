import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
    permission: 'unknown'
  });

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000 // 5 minutos
  } = options;

  // Verificar permisos de geolocalización
  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      setState(prev => ({ ...prev, permission: 'unknown' }));
      return 'unknown';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setState(prev => ({ ...prev, permission: result.state }));
      return result.state;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      setState(prev => ({ ...prev, permission: 'unknown' }));
      return 'unknown';
    }
  }, []);

  // Obtener ubicación actual
  const getCurrentPosition = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalización no soportada por este navegador',
        loading: false
      }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            loading: false,
            error: null
          }));
          resolve(true);
        },
        (error) => {
          let errorMessage = 'Error desconocido';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permisos de ubicación denegados';
              setState(prev => ({ ...prev, permission: 'denied' }));
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
          }

          setState(prev => ({
            ...prev,
            error: errorMessage,
            loading: false
          }));
          resolve(false);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge
        }
      );
    });
  }, [enableHighAccuracy, timeout, maximumAge]);

  // Solicitar permisos de ubicación
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const permission = await checkPermission();
    
    if (permission === 'granted') {
      return await getCurrentPosition();
    }
    
    if (permission === 'denied') {
      setState(prev => ({
        ...prev,
        error: 'Permisos de ubicación denegados. Habilítalos en la configuración del navegador.'
      }));
      return false;
    }

    // Si es 'prompt' o 'unknown', intentar obtener ubicación (esto solicitará permisos)
    return await getCurrentPosition();
  }, [checkPermission, getCurrentPosition]);

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  }, []);

  // Filtrar elementos por proximidad
  const filterByProximity = useCallback(<T extends { latitude?: number; longitude?: number }>(
    items: T[],
    maxDistance: number = 10
  ): (T & { distance: number })[] => {
    if (!state.latitude || !state.longitude) {
      return [];
    }

    return items
      .filter(item => item.latitude && item.longitude)
      .map(item => ({
        ...item,
        distance: calculateDistance(
          state.latitude!,
          state.longitude!,
          item.latitude!,
          item.longitude!
        )
      }))
      .filter(item => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }, [state.latitude, state.longitude, calculateDistance]);

  // Verificar permisos al montar el componente
  useEffect(() => {
    // Solo verificar permisos una vez al montar
    let mounted = true;
    
    const verifyPermissions = async () => {
      if (mounted) {
        await checkPermission();
      }
    };
    
    verifyPermissions();
    
    return () => {
      mounted = false;
    };
  }, [checkPermission]);

  return {
    ...state,
    getCurrentPosition,
    requestPermission,
    calculateDistance,
    filterByProximity,
    hasLocation: state.latitude !== null && state.longitude !== null,
    isSupported: !!navigator.geolocation
  };
}