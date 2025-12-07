import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingButton from './LoadingButton';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'user' | 'business' | 'advertiser';
}

export default function RegistrationForm({ isOpen, onClose, type }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    profession: '',
    bio: '',
    interests: ''
  });
  const { signUp, loading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        profession: formData.profession,
        bio: formData.bio,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean)
      });
      onClose();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'business': return '🏢 Registrar Negocio';
      case 'advertiser': return '📢 Registro Publicitario';
      default: return '👤 Registro de Usuario';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{getTitle()}</h2>
            <p className="text-gray-600 mt-2">Completa tu información para unirte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesión
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Desarrollador, Diseñador, Consultor..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intereses (separados por comas)
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Tecnología, Arte, Música, Deportes..."
              />
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Creando cuenta..."
              variant="success"
              size="lg"
              className="w-full"
            >
              Crear Cuenta
            </LoadingButton>
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