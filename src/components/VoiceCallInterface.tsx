import React from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import type { User } from '../types';

interface VoiceCallInterfaceProps {
  recipient: User;
  onClose: () => void;
}

export default function VoiceCallInterface({ recipient, onClose }: VoiceCallInterfaceProps) {
  const { state, startCall, endCall, toggleMute } = useWebRTC();

  const handleStartCall = () => {
    startCall('voice', recipient.id);
  };

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {recipient.avatar_url ? (
              <img 
                src={recipient.avatar_url} 
                alt={recipient.full_name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-3xl font-bold">
                {recipient.full_name.charAt(0)}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {recipient.full_name}
          </h3>
          <p className="text-gray-600">{recipient.profession}</p>
        </div>

        {/* Call Status */}
        <div className="text-center mb-8">
          {!state.isCallActive ? (
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-700">
                📞 Listo para llamar
              </div>
              <div className="text-sm text-gray-500">
                Llamada de voz con {recipient.full_name}
              </div>
            </div>
          ) : state.isConnected ? (
            <div className="space-y-2">
              <div className="text-lg font-medium text-green-600">
                ✅ Conectado
              </div>
              <div className="text-sm text-gray-500">
                Llamada en curso...
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-medium text-blue-600">
                📞 Conectando...
              </div>
              <div className="text-sm text-gray-500">
                Estableciendo conexión
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {!state.isCallActive ? (
            <button
              onClick={handleStartCall}
              className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
            >
              📞
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-colors shadow-lg ${
                  state.isMuted 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {state.isMuted ? '🔇' : '🎤'}
              </button>
              
              <button
                onClick={handleEndCall}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
              >
                📞
              </button>
            </>
          )}
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 text-lg">ℹ️</span>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Modo Demo</p>
              <p>Esta es una simulación de llamada de voz. En producción se conectaría con WebRTC real.</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}