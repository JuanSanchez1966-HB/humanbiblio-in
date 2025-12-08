import React from 'react';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface VoiceMessageRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export default function VoiceMessageRecorder({ onSendVoiceMessage, onCancel }: VoiceMessageRecorderProps) {
  const {
    isRecording,
    isPlaying,
    audioBlob,
    audioUrl,
    duration,
    error,
    startRecording,
    stopRecording,
    playRecording,
    clearRecording,
    formatDuration
  } = useVoiceRecording();

  const handleSend = () => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob);
      clearRecording();
    }
  };

  const handleCancel = () => {
    clearRecording();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🎤 Mensaje de Voz
          </h3>
          <p className="text-gray-600">
            Graba tu mensaje de voz para enviar
          </p>
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-800">
              <span>⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Recording Visualization */}
        <div className="text-center mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
              : audioUrl 
              ? 'bg-green-500' 
              : 'bg-gray-200'
          }`}>
            <span className="text-4xl text-white">
              {isRecording ? '🎤' : audioUrl ? '🔊' : '🎙️'}
            </span>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatDuration(duration)}
          </div>
          
          <div className="text-sm text-gray-600">
            {isRecording ? 'Grabando...' : audioUrl ? 'Grabación lista' : 'Presiona para grabar'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {!audioUrl ? (
            // Recording controls
            <>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
                >
                  🎤
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
                >
                  ⏹️
                </button>
              )}
            </>
          ) : (
            // Playback controls
            <>
              <button
                onClick={playRecording}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-colors shadow-lg ${
                  isPlaying 
                    ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <button
                onClick={clearRecording}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg transition-colors shadow-lg"
              >
                🗑️
              </button>
              
              <button
                onClick={handleSend}
                className="w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
              >
                📤
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">💡 Instrucciones:</p>
            <div className="space-y-1">
              <p>• Presiona 🎤 para comenzar a grabar</p>
              <p>• Presiona ⏹️ para detener la grabación</p>
              <p>• Usa ▶️ para escuchar tu grabación</p>
              <p>• Presiona 📤 para enviar el mensaje</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors font-medium"
          >
            ❌ Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}