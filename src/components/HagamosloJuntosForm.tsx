import React, { useState } from 'react';

interface HagamosloJuntosFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function HagamosloJuntosForm({ isOpen, onClose, onSubmit }: HagamosloJuntosFormProps) {
  const [formData, setFormData] = useState({
    topic: '',
    projectTitle: '',
    description: '',
    lookingFor: 'collaboration',
    contactPreference: 'chat',
    timeline: '',
    budget: '',
    skills: '',
    commitment: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hagámoslo Juntos
            </h2>
            <p className="text-gray-600">
              Comparte tu proyecto y encuentra colaboradores, socios o financiadores
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema o Área de tu Proyecto *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: Inteligencia Artificial, Sostenibilidad, Salud Mental..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Proyecto (Opcional)
              </label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: App de Meditación para Desarrolladores"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de tu Idea/Proyecto *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe tu idea, qué problema resuelve, por qué es importante, qué necesitas para hacerla realidad..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué buscas?
                </label>
                <select
                  value={formData.lookingFor}
                  onChange={(e) => setFormData(prev => ({ ...prev, lookingFor: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="discussion">💬 Discusión y Feedback</option>
                  <option value="collaboration">👥 Colaboradores</option>
                  <option value="partnership">🤝 Socios Estratégicos</option>
                  <option value="funding">💰 Financiación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferencia de Contacto
                </label>
                <select
                  value={formData.contactPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPreference: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="chat">💬 Chat en HUMANBIBLIO</option>
                  <option value="email">📧 Email directo</option>
                  <option value="call">📞 Llamada telefónica</option>
                  <option value="any">🌟 Cualquier método</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h4 className="font-semibold text-emerald-900 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Al publicar tu proyecto obtienes:
              </h4>
              <div className="space-y-2 text-sm text-emerald-800">
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                  <span><strong>Distintivo HJ</strong> en tu perfil del Ágora</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                  <span><strong>Visibilidad</strong> en "Hagámoslo Juntos"</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                  <span><strong>Aparición en Actualidades</strong> si recibes likes</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                  <span><strong>Contacto directo</strong> de colaboradores interesados</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                <span className="mr-2">🌟</span>
                Filosofía "Hagámoslo Juntos"
              </h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                En HUMANBIBLIO creemos que las mejores ideas nacen de la <strong>colaboración auténtica</strong>. 
                No importa si tu proyecto es grande o pequeño - lo que importa es la <strong>pasión genuina</strong> 
                y la <strong>voluntad de crear algo significativo</strong> junto a otros.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg"
              >
                🚀 Publicar Proyecto
              </button>
            </div>
          </form>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}