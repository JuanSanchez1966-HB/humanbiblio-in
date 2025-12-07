import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CommercialSpaceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommercialSpaceForm({ isOpen, onClose }: CommercialSpaceFormProps) {
  const { t } = useLanguage();
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
    alert(t('commercial.form.success'));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('commercial.form.title')}</h2>
            <p className="text-gray-600 mt-2">{t('commercial.form.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('commercial.form.business.name')}
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
                  {t('commercial.form.category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('commercial.form.category.select')}</option>
                  <option value="gastronomia">{t('commercial.form.category.gastronomy')}</option>
                  <option value="tecnologia">{t('commercial.form.category.technology')}</option>
                  <option value="salud">{t('commercial.form.category.health')}</option>
                  <option value="educacion">{t('commercial.form.category.education')}</option>
                  <option value="arte">{t('commercial.form.category.art')}</option>
                  <option value="servicios">{t('commercial.form.category.services')}</option>
                  <option value="retail">{t('commercial.form.category.retail')}</option>
                  <option value="otros">{t('commercial.form.category.other')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('commercial.form.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder={t('commercial.form.description.placeholder')}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('commercial.form.email')}
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
                  {t('commercial.form.phone')}
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
                  {t('commercial.form.website')}
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('commercial.form.website.placeholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('commercial.form.location')}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('commercial.form.location.placeholder')}
                />
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h4 className="font-semibold text-emerald-900 mb-3">🎯 {t('commercial.form.includes.title')}</h4>
              <div className="space-y-2 text-sm text-emerald-800">
                <p>• {t('commercial.form.includes.1')}</p>
                <p>• {t('commercial.form.includes.2')}</p>
                <p>• {t('commercial.form.includes.3')}</p>
                <p>• {t('commercial.form.includes.4')}</p>
                <p>• {t('commercial.form.includes.5')}</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold"
            >
              {t('commercial.form.submit')}
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