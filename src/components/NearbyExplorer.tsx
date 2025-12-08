import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { supabase, isDemoMode } from '../lib/supabase';
import GeolocationPermissionRequest from './GeolocationPermissionRequest';
import InteractiveMap from './InteractiveMap';
import UserCard from './UserCard';
import BusinessCard from './BusinessCard';
import type { User, Business } from '../types';

interface NearbyUser extends User {
  distance: number;
  latitude?: number;
  longitude?: number;
}

interface NearbyBusiness extends Business {
  distance: number;
  latitude?: number;
  longitude?: number;
}

interface NearbyExplorerProps {
  users: User[];
  businesses: Business[];
  onMessage: (recipient: User | Business) => void;
  onCall?: (user: User) => void;
  onVideoCall?: (user: User) => void;
  onContact?: (business: Business) => void;
}

export default function NearbyExplorer({
  users,
  businesses,
  onMessage,
  onCall,
  onVideoCall,
  onContact
}: NearbyExplorerProps) {
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [radius, setRadius] = useState(10); // km
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedItem, setSelectedItem] = useState<User | Business | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<NearbyBusiness[]>([]);
  const [searching, setSearching] = useState(false);

  const {
    latitude,
    longitude,
    loading,
    error,
    permission,
    hasLocation,
    requestPermission
  } = useGeolocation();

  // Search nearby using Supabase functions
  useEffect(() => {
    if (!hasLocation || !latitude || !longitude) return;

    const searchNearby = async () => {
      setSearching(true);

      try {
        if (isDemoMode) {
          // Demo mode: simulate nearby locations
          const usersWithLocation = users.slice(0, 5).map((user, index) => {
            const radiusInDegrees = radius / 111;
            const angle = (index * 137.5) % 360;
            const distance = Math.random() * radiusInDegrees;
            const distanceKm = Math.random() * radius;

            return {
              ...user,
              latitude: latitude + distance * Math.cos(angle * Math.PI / 180),
              longitude: longitude + distance * Math.sin(angle * Math.PI / 180),
              distance: distanceKm
            };
          });

          const businessesWithLocation = businesses.slice(0, 4).map((business, index) => {
            const radiusInDegrees = radius / 111;
            const angle = ((index + users.length) * 137.5) % 360;
            const distance = Math.random() * radiusInDegrees;
            const distanceKm = Math.random() * radius;

            return {
              ...business,
              latitude: latitude + distance * Math.cos(angle * Math.PI / 180),
              longitude: longitude + distance * Math.sin(angle * Math.PI / 180),
              distance: distanceKm
            };
          });

          setNearbyUsers(usersWithLocation);
          setNearbyBusinesses(businessesWithLocation);
        } else {
          // Production mode: use Supabase functions
          const [usersResult, businessesResult] = await Promise.all([
            supabase.rpc('search_nearby_users', {
              search_lat: latitude,
              search_lon: longitude,
              radius_km: radius,
              limit_count: 20
            }),
            supabase.rpc('search_nearby_businesses', {
              search_lat: latitude,
              search_lon: longitude,
              radius_km: radius,
              category_filter: null,
              limit_count: 20
            })
          ]);

          if (usersResult.data) {
            setNearbyUsers(usersResult.data.map((user: any) => ({
              id: user.user_id,
              full_name: user.full_name,
              profession: user.profession,
              bio: user.bio,
              avatar_url: user.avatar_url,
              interests: [],
              email: '',
              distance: user.distance_km,
              latitude: user.latitude,
              longitude: user.longitude
            })));
          }

          if (businessesResult.data) {
            setNearbyBusinesses(businessesResult.data.map((business: any) => ({
              id: business.business_id,
              name: business.business_name,
              category: business.category,
              description: business.description,
              products_services: [],
              owner_id: '',
              contact_phone: business.contact_phone,
              location: business.address,
              distance: business.distance_km,
              latitude: business.latitude,
              longitude: business.longitude
            })));
          }
        }
      } catch (error) {
        console.error('Error searching nearby:', error);
      } finally {
        setSearching(false);
      }
    };

    searchNearby();
  }, [hasLocation, latitude, longitude, radius, users, businesses]);

  const handleRequestPermission = async () => {
    setShowPermissionRequest(false);
    await requestPermission();
  };

  const handleMarkerClick = (item: User | Business) => {
    setSelectedItem(item);
    setViewMode('list');
  };

  const handleMessage = (recipient: User | Business) => {
    onMessage(recipient);
  };

  const handleCall = (user: User) => {
    if (onCall) onCall(user);
  };

  const handleVideoCall = (user: User) => {
    if (onVideoCall) onVideoCall(user);
  };

  const handleContact = (business: Business) => {
    if (onContact) onContact(business);
  };

  // Si no hay permisos, mostrar solicitud
  if (permission === 'denied') {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🚫</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Permisos de ubicación denegados
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Para usar la función "Cerca de mí", necesitamos acceso a tu ubicación. 
          Puedes habilitarlo en la configuración de tu navegador.
        </p>
        <button
          onClick={() => setShowPermissionRequest(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Si no tiene ubicación, mostrar botón para activar
  if (!hasLocation && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🌍</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Descubre lo que está cerca
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Activa la geolocalización para encontrar personas y negocios increíbles cerca de ti.
        </p>
        <button
          onClick={() => setShowPermissionRequest(true)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🌍 Activar Geolocalización
        </button>
        
        {showPermissionRequest && (
          <GeolocationPermissionRequest
            onRequestPermission={handleRequestPermission}
            onCancel={() => setShowPermissionRequest(false)}
            loading={loading}
          />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin text-6xl mb-6">🌍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Obteniendo tu ubicación...
        </h3>
        <p className="text-gray-600">
          Esto puede tomar unos segundos
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Error de geolocalización
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => requestPermission()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🌍 Cerca de Mí
            </h2>
            <p className="text-gray-600">
              {searching ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">🔄</span>
                  Buscando en {radius}km...
                </span>
              ) : (
                <span>
                  {nearbyUsers.length + nearbyBusinesses.length} elementos encontrados en {radius}km
                  {!isDemoMode && ' (búsqueda en tiempo real)'}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Selector de radio */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Radio:</label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>

            {/* Selector de vista */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🗺️ Mapa
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Lista
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vista de mapa */}
      {viewMode === 'map' && hasLocation && (
        <InteractiveMap
          users={nearbyUsers}
          businesses={nearbyBusinesses}
          userLocation={{ latitude: latitude!, longitude: longitude! }}
          onMarkerClick={handleMarkerClick}
          radius={radius}
        />
      )}

      {/* Vista de lista */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Personas cercanas */}
          {nearbyUsers.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👥</span>
                Personas Cercanas ({nearbyUsers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyUsers.map((user) => (
                  <div key={user.id} className="relative">
                    <UserCard
                      user={user}
                      onMessage={handleMessage}
                      onCall={handleCall}
                      onVideoCall={handleVideoCall}
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {user.distance.toFixed(1)} km
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Negocios cercanos */}
          {nearbyBusinesses.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🏢</span>
                Negocios Cercanos ({nearbyBusinesses.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyBusinesses.map((business) => (
                  <div key={business.id} className="relative">
                    <BusinessCard
                      business={business}
                      onContact={handleContact}
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                      {business.distance.toFixed(1)} km
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {nearbyUsers.length === 0 && nearbyBusinesses.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay elementos cerca
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta aumentar el radio de búsqueda o explora otras áreas.
              </p>
              <button
                onClick={() => setRadius(Math.min(50, radius * 2))}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Ampliar búsqueda a {Math.min(50, radius * 2)}km
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de solicitud de permisos */}
      {showPermissionRequest && (
        <GeolocationPermissionRequest
          onRequestPermission={handleRequestPermission}
          onCancel={() => setShowPermissionRequest(false)}
          loading={loading}
        />
      )}
    </div>
  );
}