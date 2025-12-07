import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Star, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import ImageUploader from './ImageUploader';

interface PersonalProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function PersonalProfileEditor({
  isOpen,
  onClose,
  onSaveSuccess
}: PersonalProfileEditorProps) {
  const { t } = useLanguage();
  const { user, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    profession: user?.profession || '',
    bio: user?.bio || '',
    location: user?.location || '',
    interests: user?.interests?.join(', ') || ''
  });

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('cover_image_url, media_gallery')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCoverImageUrl(profile.cover_image_url || '');
          if (profile.media_gallery && Array.isArray(profile.media_gallery)) {
            const urls = profile.media_gallery
              .filter((item: any) => item && item.url)
              .map((item: any) => item.url);
            setGalleryUrls(urls);
          }
        }
      };
      loadProfile();
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const interestsArray = formData.interests
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      const mediaGallery = galleryUrls.map((url, index) => ({
        url,
        type: 'image' as const,
        order: index
      }));

      const updates = {
        full_name: formData.fullName,
        profession: formData.profession,
        bio: formData.bio,
        location: formData.location,
        interests: interestsArray,
        avatar_url: avatarUrl || null,
        cover_image_url: coverImageUrl || null,
        media_gallery: mediaGallery,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      await refreshProfile();

      setSuccess(true);
      setTimeout(() => {
        onSaveSuccess();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setAvatarUrl(urls[0]);
    }
  };

  const handleCoverUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setCoverImageUrl(urls[0]);
    }
  };

  const handleGalleryUpload = (urls: string[]) => {
    setGalleryUrls(prev => [...prev, ...urls]);
  };

  const removeGalleryImage = (url: string) => {
    setGalleryUrls(prev => prev.filter(u => u !== url));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{t('profile.edit.title')}</h2>
            <p className="text-blue-100">{user.email}</p>
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
              {t('profile.edit.success')}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Cover Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('profile.edit.cover.title')}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t('profile.edit.cover.description')}
            </p>
            {coverImageUrl && (
              <div className="mb-4 relative">
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <ImageUploader
              uploadType="profile"
              maxFiles={1}
              maxSizeMB={10}
              onUploadComplete={handleCoverUpload}
              onUploadError={(err) => setError(err)}
              currentImages={coverImageUrl ? [coverImageUrl] : []}
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('profile.edit.avatar.title')}
            </h3>
            {avatarUrl && (
              <div className="mb-4">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                />
              </div>
            )}
            <ImageUploader
              uploadType="profile"
              maxFiles={1}
              maxSizeMB={10}
              onUploadComplete={handleAvatarUpload}
              onUploadError={(err) => setError(err)}
              currentImages={avatarUrl ? [avatarUrl] : []}
            />
          </div>

          {/* Personal Gallery */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('profile.edit.gallery.title')}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t('profile.edit.gallery.description')}
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
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
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
              uploadType="profile"
              maxFiles={20}
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
                {t('profile.form.name')} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.form.profession')} *
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.form.bio')}
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.form.location')}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.form.interests')}
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="Separados por comas"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              {t('profile.form.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">{t('profile.edit.saving')}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {t('profile.edit.save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
