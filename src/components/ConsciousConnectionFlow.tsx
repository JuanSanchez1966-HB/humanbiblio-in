import React, { useState } from 'react';
import type { User, Business } from '../types';

interface ConsciousConnectionFlowProps {
  recipient: User | Business;
  onConnect: () => void;
  onCancel: () => void;
}

export default function ConsciousConnectionFlow({ recipient, onConnect, onCancel }: ConsciousConnectionFlowProps) {
  const [intention, setIntention] = useState('');
  const [connectionType, setConnectionType] = useState<'professional' | 'learning' | 'collaboration' | 'friendship'>('professional');
  const [step, setStep] = useState(1);

  const recipientName = 'full_name' in recipient ? recipient.full_name : recipient.name;
  const isUser = 'full_name' in recipient;

  const connectionTypes = [
    {
      id: 'professional',
      title: 'Conexión Profesional',
      description: 'Intercambio de conocimientos y networking',
      emoji: '💼'
    },
    {
      id: 'learning',
      title: 'Aprendizaje Mutuo',
      description: 'Compartir experiencias y aprender juntos',
      emoji: '📚'
    },
    {
      id: 'collaboration',
      title: 'Colaboración Creativa',
      description: 'Proyectos conjuntos y sinergia',
      emoji: '🤝'
    },
    {
      id: 'friendship',
      title: 'Amistad Intelectual',
      description: 'Conexión humana auténtica',
      emoji: '🌟'
    }
  ];

  const handleConnect = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Procesar conexión consciente
      console.log('Conexión consciente establecida:', {
        recipient: recipientName,
        intention,
        connectionType,
        timestamp: new Date().toISOString()
      });
      onConnect();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Conexión Consciente
            </h2>
            <p className="text-gray-600">
              En HUMANBIBLIO, cada conexión es intencional y auténtica
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {recipientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{recipientName}</h3>
                    <p className="text-sm text-gray-600">
                      {isUser ? (recipient as User).profession : (recipient as Business).category}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ¿Qué tipo de conexión buscas?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {connectionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setConnectionType(type.id as any)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        connectionType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{type.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{type.title}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  {connectionTypes.find(t => t.id === connectionType)?.emoji} {connectionTypes.find(t => t.id === connectionType)?.title}
                </h3>
                <p className="text-sm text-green-700">
                  con <strong>{recipientName}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Comparte tu intención (opcional pero recomendado):
                </label>
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="Ej: Me interesa aprender sobre tu experiencia en... / Creo que podríamos colaborar en... / Me gustaría intercambiar ideas sobre..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
                  <span className="mr-2">🧠</span>
                  Inteligencia Natural en Acción
                </h4>
                <div className="space-y-2 text-sm text-indigo-800">
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>Tu intención guía la conversación</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>Sin algoritmos que manipulen el contenido</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>Comunicación directa y auténtica</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 mt-8">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {step === 1 ? 'Cancelar' : '← Atrás'}
            </button>
            <button
              onClick={step === 1 ? () => setStep(2) : handleConnect}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold"
            >
              {step === 1 ? 'Continuar →' : '🌱 Conectar Conscientemente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}