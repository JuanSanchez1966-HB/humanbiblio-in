import React, { useState } from 'react';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193

interface CommercialSpaceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommercialSpaceForm({ isOpen, onClose }: CommercialSpaceFormProps) {
<<<<<<< HEAD
  const { t } = useLanguage();
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    location: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    alert(t('commercial.form.success'));
=======
    alert('¡Solicitud enviada! Te contactaremos pronto para configurar tu espacio comercial.');
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
<<<<<<< HEAD
            <h2 className="text-3xl font-bold text-gray-900">{t('commercial.form.title')}</h2>
            <p className="text-gray-600 mt-2">{t('commercial.form.subtitle')}</p>
=======
            <h2 className="text-3xl font-bold text-gray-900">💼 Espacios Comerciales</h2>
            <p className="text-gray-600 mt-2">Solicita tu espacio en World Boulevard</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('commercial.form.business.name')}
=======
                  Nombre del Negocio
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('commercial.form.category')}
=======
                  Categoría
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
<<<<<<< HEAD
                  <option value="">{t('commercial.form.category.select')}</option>
                  <option value="gastronomia">{t('commercial.form.category.gastronomy')}</option>
                  <option value="tecnologia">{t('commercial.form.category.technology')}</option>
                  <option value="salud">{t('commercial.form.category.health')}</option>
                  <option value="educacion">{t('commercial.form.category.education')}</option>
                  <option value="arte">{t('commercial.form.category.art')}</option>
                  <option value="servicios">{t('commercial.form.category.services')}</option>
                  <option value="retail">{t('commercial.form.category.retail')}</option>
                  <option value="otros">{t('commercial.form.category.other')}</option>
=======
                  <option value="">Seleccionar categoría</option>
                  <option value="gastronomia">Gastronomía</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="salud">Salud y Bienestar</option>
                  <option value="educacion">Educación</option>
                  <option value="arte">Arte y Cultura</option>
                  <option value="servicios">Servicios Profesionales</option>
                  <option value="retail">Retail y Comercio</option>
                  <option value="otros">Otros</option>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                {t('commercial.form.description')}
=======
                Descripción del Negocio
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
<<<<<<< HEAD
                placeholder={t('commercial.form.description.placeholder')}
=======
                placeholder="Describe tu negocio, productos o servicios..."
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('commercial.form.email')}
=======
                  Email de Contacto
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('commercial.form.phone')}
=======
                  Teléfono
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('commercial.form.website')}
=======
                  Sitio Web
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
<<<<<<< HEAD
                  placeholder={t('commercial.form.website.placeholder')}
=======
                  placeholder="https://..."
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('commercial.form.location')}
=======
                  Ubicación
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
<<<<<<< HEAD
                  placeholder={t('commercial.form.location.placeholder')}
=======
                  placeholder="Ciudad, País"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
<<<<<<< HEAD
              <h4 className="font-semibold text-emerald-900 mb-3">🎯 {t('commercial.form.includes.title')}</h4>
              <div className="space-y-2 text-sm text-emerald-800">
                <p>• {t('commercial.form.includes.1')}</p>
                <p>• {t('commercial.form.includes.2')}</p>
                <p>• {t('commercial.form.includes.3')}</p>
                <p>• {t('commercial.form.includes.4')}</p>
                <p>• {t('commercial.form.includes.5')}</p>
=======
              <h4 className="font-semibold text-emerald-900 mb-3">🎯 ¿Qué incluye tu espacio comercial?</h4>
              <div className="space-y-2 text-sm text-emerald-800">
                <p>• <strong>Perfil destacado</strong> en World Boulevard</p>
                <p>• <strong>Chat directo</strong> con clientes potenciales</p>
                <p>• <strong>Geolocalización</strong> para clientes cercanos</p>
                <p>• <strong>Analytics</strong> de interacciones y visitas</p>
                <p>• <strong>Soporte personalizado</strong> para optimizar tu presencia</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold"
            >
<<<<<<< HEAD
              {t('commercial.form.submit')}
=======
              Solicitar Espacio Comercial
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </button>
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