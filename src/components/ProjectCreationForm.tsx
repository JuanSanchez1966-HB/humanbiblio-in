import React, { useState } from 'react';
import type { Project } from '../types';

interface ProjectCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
}

const PROJECT_CATEGORIES = [
  'Tecnología e Innovación',
  'Salud y Bienestar',
  'Educación y Formación',
  'Arte y Cultura',
  'Emprendimiento Social',
  'Gastronomía y Alimentación',
  'Música y Audio',
  'Diseño y Creatividad',
  'Ciencia e Investigación',
  'Sostenibilidad y Medio Ambiente',
  'Deportes y Fitness',
  'Viajes y Turismo'
];

export default function ProjectCreationForm({ isOpen, onClose, onSubmit }: ProjectCreationFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    funding_goal: '',
    tags: '',
    why_important: '',
    target_audience: '',
    timeline: '',
    resources_needed: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Título es requerido';
    if (!formData.description.trim()) newErrors.description = 'Descripción es requerida';
    if (formData.description.length < 100) newErrors.description = 'Mínimo 100 caracteres';
    if (!formData.category) newErrors.category = 'Categoría es requerida';
    if (!formData.funding_goal || Number(formData.funding_goal) < 1000) {
      newErrors.funding_goal = 'Meta mínima: $1,000';
    }
    if (!formData.why_important.trim()) newErrors.why_important = 'Explica por qué es importante';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const project: Partial<Project> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      funding_goal: Number(formData.funding_goal),
      current_funding: 0,
      likes_count: 0,
      comments_count: 0,
      status: 'active',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      media_urls: [],
      is_public_conversation: true,
      funding_threshold: Math.max(100, Math.floor(Number(formData.funding_goal) / 100)), // 1 like por cada $100
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onSubmit(project);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">💡</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Crear Mi Proyecto
            </h2>
            <p className="text-gray-600">
              Comparte tu idea y obtén financiación basada en conversaciones auténticas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: App de Meditación para Desarrolladores"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  {PROJECT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Proyecto * (Mínimo 100 caracteres)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe tu proyecto en detalle: qué problema resuelve, cómo funciona, qué lo hace único..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                <p className="text-gray-500 text-sm">{formData.description.length}/100 caracteres</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta de Financiación (USD) *
                </label>
                <input
                  type="number"
                  min="1000"
                  step="100"
                  value={formData.funding_goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, funding_goal: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.funding_goal ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="25000"
                />
                {errors.funding_goal && <p className="text-red-500 text-sm mt-1">{errors.funding_goal}</p>}
                <p className="text-gray-500 text-xs mt-1">
                  Necesitarás {Math.max(100, Math.floor(Number(formData.funding_goal) / 100))} likes para activar financiación
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (separados por comas)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="tecnología, innovación, salud, app móvil"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Por qué es importante este proyecto? *
              </label>
              <textarea
                value={formData.why_important}
                onChange={(e) => setFormData(prev => ({ ...prev, why_important: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.why_important ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Explica el impacto que tendrá, qué problema resuelve, por qué la gente debería apoyarlo..."
              />
              {errors.why_important && <p className="text-red-500 text-sm mt-1">{errors.why_important}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Para quién es este proyecto?
                </label>
                <input
                  type="text"
                  value={formData.target_audience}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Desarrolladores, estudiantes, familias, empresas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline estimado
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Seleccionar timeline</option>
                  <option value="1-3 meses">1-3 meses</option>
                  <option value="3-6 meses">3-6 meses</option>
                  <option value="6-12 meses">6-12 meses</option>
                  <option value="1-2 años">1-2 años</option>
                  <option value="2+ años">2+ años</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                <span className="mr-2">🌟</span>
                Financiación Conversacional - Cómo Funciona
              </h4>
              <div className="space-y-2 text-sm text-purple-800">
                <p>• <strong>Conversaciones auténticas</strong> generan likes orgánicos</p>
                <p>• <strong>Threshold de likes</strong> activa financiación automática</p>
                <p>• <strong>Comunidad decide</strong> qué proyectos merecen apoyo</p>
                <p>• <strong>Sin marketing manipulativo</strong> - Solo mérito real</p>
                <p>• <strong>Transparencia total</strong> en el proceso de financiación</p>
              </div>
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-semibold shadow-lg"
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