import React, { useRef, useEffect } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import type { User } from '../types';

interface VideoCallInterfaceProps {
  recipient: User;
  onClose: () => void;
}

export default function VideoCallInterface({ recipient, onClose }: VideoCallInterfaceProps) {
  const { state, startCall, endCall, toggleMute, toggleVideo } = useWebRTC();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && state.localStream) {
      localVideoRef.current.srcObject = state.localStream;
    }
  }, [state.localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && state.remoteStream) {
      remoteVideoRef.current.srcObject = state.remoteStream;
    }
  }, [state.remoteStream]);

  const handleStartCall = () => {
    startCall('video', recipient.id);
  };

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {recipient.avatar_url ? (
              <img 
                src={recipient.avatar_url} 
                alt={recipient.full_name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {recipient.full_name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{recipient.full_name}</h3>
            <p className="text-sm text-gray-300">
              {state.isConnected ? '✅ Conectado' : state.isCallActive ? '📞 Conectando...' : '📹 Video llamada'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-gray-900">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video (Picture in Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!state.isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <span className="text-white text-4xl">📹</span>
            </div>
          )}
        </div>

        {/* Demo Placeholder when no video */}
        {!state.isCallActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {recipient.avatar_url ? (
                  <img 
                    src={recipient.avatar_url} 
                    alt={recipient.full_name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-5xl font-bold">
                    {recipient.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2">{recipient.full_name}</h3>
              <p className="text-gray-300 mb-6">{recipient.profession}</p>
              <p className="text-lg">📹 Listo para videollamada</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6">
        <div className="flex justify-center space-x-6">
          {!state.isCallActive ? (
            <button
              onClick={handleStartCall}
              className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
            >
              📹
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-colors shadow-lg ${
                  state.isMuted 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {state.isMuted ? '🔇' : '🎤'}
              </button>
              
              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-colors shadow-lg ${
                  !state.isVideoEnabled 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {state.isVideoEnabled ? '📹' : '📷'}
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
        <div className="mt-4 bg-blue-900/50 border border-blue-500/30 rounded-xl p-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-200">
            <span>ℹ️</span>
            <span>Modo Demo - En producción usaría WebRTC real con servidor STUN/TURN</span>
          </div>
        </div>
      </div>
    </div>
  );
}