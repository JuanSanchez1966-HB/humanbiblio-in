import React, { useState, useEffect } from 'react';
import type { User, Business } from '../types';

interface InteractiveMapProps {
  users: User[];
  businesses: Business[];
  userLocation: { latitude: number; longitude: number } | null;
  onMarkerClick: (item: User | Business) => void;
  radius: number;
}

interface MapMarker {
  id: string;
  type: 'user' | 'business' | 'current';
  latitude: number;
  longitude: number;
  name: string;
  data: User | Business | null;
  distance?: number;
}

export default function InteractiveMap({ 
  users, 
  businesses, 
  userLocation, 
  onMarkerClick,
  radius 
}: InteractiveMapProps) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Simular ubicaciones para demo
  const generateMockLocation = (baseLatitude: number, baseLongitude: number, index: number) => {
    const radiusInDegrees = radius / 111; // Aproximadamente 111 km por grado
    const angle = (index * 137.5) % 360; // Distribución en espiral dorada
    const distance = Math.random() * radiusInDegrees;
    
    return {
      latitude: baseLatitude + distance * Math.cos(angle * Math.PI / 180),
      longitude: baseLongitude + distance * Math.sin(angle * Math.PI / 180)
    };
  };

  // Calcular distancia usando fórmula de Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (!userLocation) {
      setMarkers([]);
      return;
    }

    const newMarkers: MapMarker[] = [];

    // Marcador de ubicación actual
    newMarkers.push({
      id: 'current-location',
      type: 'current',
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      name: 'Tu ubicación',
      data: null
    });

    // Marcadores de usuarios
    users.forEach((user, index) => {
      const location = generateMockLocation(userLocation.latitude, userLocation.longitude, index);
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        location.latitude,
        location.longitude
      );

      if (distance <= radius) {
        newMarkers.push({
          id: `user-${user.id}`,
          type: 'user',
          latitude: location.latitude,
          longitude: location.longitude,
          name: user.full_name,
          data: user,
          distance
        });
      }
    });

    // Marcadores de negocios
    businesses.forEach((business, index) => {
      const location = generateMockLocation(
        userLocation.latitude, 
        userLocation.longitude, 
        index + users.length
      );
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        location.latitude,
        location.longitude
      );

      if (distance <= radius) {
        newMarkers.push({
          id: `business-${business.id}`,
          type: 'business',
          latitude: location.latitude,
          longitude: location.longitude,
          name: business.name,
          data: business,
          distance
        });
      }
    });

    setMarkers(newMarkers);
  }, [users, businesses, userLocation, radius]);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    if (marker.data) {
      onMarkerClick(marker.data);
    }
  };

  if (!userLocation) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Mapa Interactivo
        </h3>
        <p className="text-gray-600">
          Activa la geolocalización para ver personas y negocios cercanos en el mapa.
        </p>
      </div>
    );
  }

  // Calcular bounds del mapa
  const bounds = {
    minLat: userLocation.latitude - (radius / 111),
    maxLat: userLocation.latitude + (radius / 111),
    minLng: userLocation.longitude - (radius / 111),
    maxLng: userLocation.longitude + (radius / 111)
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🗺️</span>
          Mapa Interactivo - Radio: {radius}km
        </h3>
        <p className="text-sm opacity-90">
          {markers.length - 1} elementos encontrados cerca de ti
        </p>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
        {/* Simulación de mapa */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-gray-400">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Círculo de radio */}
        <div 
          className="absolute border-2 border-blue-400 border-dashed rounded-full opacity-30"
          style={{
            width: '60%',
            height: '60%',
            top: '20%',
            left: '20%'
          }}
        />

        {/* Marcadores */}
        {markers.map((marker) => {
          // Convertir coordenadas a posición en el mapa
          const x = ((marker.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
          const y = ((bounds.maxLat - marker.latitude) / (bounds.maxLat - bounds.minLat)) * 100;

          return (
            <div
              key={marker.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                selectedMarker?.id === marker.id ? 'scale-125 z-10' : 'z-5'
              }`}
              style={{
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`
              }}
              onClick={() => handleMarkerClick(marker)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                marker.type === 'current' 
                  ? 'bg-red-500 animate-pulse' 
                  : marker.type === 'user'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}>
                {marker.type === 'current' ? '📍' : marker.type === 'user' ? '👤' : '🏢'}
              </div>
              
              {/* Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap transition-opacity duration-300 ${
                selectedMarker?.id === marker.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'
              }`}>
                {marker.name}
                {marker.distance && (
                  <span className="block text-gray-300">
                    {marker.distance.toFixed(1)} km
                  </span>
                )}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Tu ubicación</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Personas ({markers.filter(m => m.type === 'user').length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Negocios ({markers.filter(m => m.type === 'business').length})</span>
            </div>
          </div>
          <div className="text-gray-500">
            Haz clic en los marcadores para más información
          </div>
        </div>
      </div>
    </div>
  );
}