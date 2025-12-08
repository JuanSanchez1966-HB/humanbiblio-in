import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Business } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ImageUploader from './ImageUploader';

interface BusinessProfileEditorProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function BusinessProfileEditor({
  business,
  isOpen,
  onClose,
  onSaveSuccess
}: BusinessProfileEditorProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: business.name || '',
    category: business.category || '',
    description: business.description || '',
    products: business.products_services?.join(', ') || '',
    contactEmail: business.contact_email || '',
    contactPhone: business.contact_phone || '',
    website: business.website || '',
    location: business.location || ''
  });

  const [avatarUrl, setAvatarUrl] = useState(business.avatar_url || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(business.is_featured ? business.avatar_url : '');

  useEffect(() => {
    if (business.media_gallery && Array.isArray(business.media_gallery)) {
      const urls = business.media_gallery
        .filter((item: any) => item && item.url)
        .map((item: any) => item.url);
      setGalleryUrls(urls);
    }
  }, [business]);

  if (!isOpen || !user || user.id !== business.owner_id) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const productsArray = formData.products
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const mediaGallery = galleryUrls.map((url, index) => ({
        url,
        type: 'image' as const,
        order: index
      }));

      const updates: any = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        products_services: productsArray,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        website: formData.website || null,
        location: formData.location,
        avatar_url: avatarUrl || null,
        media_gallery: mediaGallery,
        featured_image_url: featuredImageUrl || avatarUrl || null
      };

      const { error: updateError } = await supabase
        .from('wb_businesses')
        .update(updates)
        .eq('id', business.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('Error updating business:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setAvatarUrl(urls[0]);
      if (!featuredImageUrl) {
        setFeaturedImageUrl(urls[0]);
      }
    }
  };

  const handleGalleryUpload = (urls: string[]) => {
    setGalleryUrls(prev => [...prev, ...urls]);
  };

  const removeGalleryImage = (url: string) => {
    setGalleryUrls(prev => prev.filter(u => u !== url));
    if (featuredImageUrl === url) {
      setFeaturedImageUrl('');
    }
  };

  const setAsFeatured = (url: string) => {
    setFeaturedImageUrl(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{t('wb.edit.title')}</h2>
            <p className="text-emerald-100">{business.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
              {t('wb.edit.success')}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Avatar Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('wb.edit.avatar.title')}
            </h3>
            {avatarUrl && (
              <div className="mb-4">
                <img
                  src={avatarUrl}
                  alt="Avatar actual"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                />
              </div>
            )}
            <ImageUploader
              uploadType="business"
              entityId={business.id}
              maxFiles={1}
              maxSizeMB={10}
              onUploadComplete={handleAvatarUpload}
              onUploadError={(err) => setError(err)}
              currentImages={avatarUrl ? [avatarUrl] : []}
            />
          </div>

          {/* Gallery Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('wb.edit.gallery.title')}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t('wb.edit.gallery.description')}
            </p>

            {/* Current Gallery */}
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {galleryUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Galería ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    {/* Featured Badge */}
                    {featuredImageUrl === url && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Destacada
                      </div>
                    )}
                    {/* Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      {featuredImageUrl !== url && (
                        <button
                          onClick={() => setAsFeatured(url)}
                          className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          title="Usar en carrusel"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeGalleryImage(url)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ImageUploader
              uploadType="business"
              entityId={business.id}
              maxFiles={10}
              maxSizeMB={10}
              onUploadComplete={handleGalleryUpload}
              onUploadError={(err) => setError(err)}
              currentImages={galleryUrls}
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('business.form.name')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('business.form.category')} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Salud y Bienestar">Salud y Bienestar</option>
                <option value="Educación">Educación</option>
                <option value="Arte y Cultura">Arte y Cultura</option>
                <option value="Servicios Profesionales">Servicios Profesionales</option>
                <option value="Música y Audio">Música y Audio</option>
                <option value="Diseño y Creatividad">Diseño y Creatividad</option>
                <option value="Retail y Comercio">Retail y Comercio</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('business.form.description')} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('business.form.products')} *
            </label>
            <textarea
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              rows={3}
              placeholder="Separados por comas"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('business.form.contact.email')} *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('business.form.contact.phone')} *
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('business.form.website')}
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('boulevard.form.location')} *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              {t('boulevard.form.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">{t('wb.edit.saving')}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {t('wb.edit.save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
