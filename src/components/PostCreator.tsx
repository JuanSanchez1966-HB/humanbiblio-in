import React, { useState } from 'react';
import { X, Image as ImageIcon, Film, Send, Hash } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import ImageUploader from './ImageUploader';

interface PostCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export default function PostCreator({
  isOpen,
  onClose,
  onPostCreated
}: PostCreatorProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contentType, setContentType] = useState<'image' | 'video' | 'text'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen || !user) return null;

  const handlePost = async () => {
    if (contentType !== 'text' && !mediaUrl) {
      setError('Por favor sube una imagen o video');
      return;
    }

    if (!caption.trim()) {
      setError('Por favor agrega una descripción');
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const postData = {
        user_id: user.id,
        content_type: contentType,
        media_url: mediaUrl || null,
        caption: caption.trim(),
        tags: tagsArray,
        is_public: isPublic
      };

      const { error: insertError } = await supabase
        .from('user_posts')
        .insert(postData);

      if (insertError) {
        throw insertError;
      }

      setCaption('');
      setTags('');
      setMediaUrl('');
      setIsPublic(true);

      onPostCreated();
      onClose();

    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'Error al crear la publicación');
    } finally {
      setIsPosting(false);
    }
  };

  const handleMediaUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setMediaUrl(urls[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{t('post.create.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Content Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('post.create.type')}
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setContentType('image')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  contentType === 'image'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <ImageIcon className="w-5 h-5 mx-auto mb-1" />
                {t('post.type.image')}
              </button>
              <button
                onClick={() => setContentType('video')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  contentType === 'video'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Film className="w-5 h-5 mx-auto mb-1" />
                {t('post.type.video')}
                <span className="block text-xs text-gray-500 mt-1">(Próximamente)</span>
              </button>
            </div>
          </div>

          {/* Media Upload */}
          {contentType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('post.create.upload.image')}
              </label>
              {mediaUrl && (
                <div className="mb-4 relative">
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    onClick={() => setMediaUrl('')}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {!mediaUrl && (
                <ImageUploader
                  uploadType="profile"
                  maxFiles={1}
                  maxSizeMB={10}
                  onUploadComplete={handleMediaUpload}
                  onUploadError={(err) => setError(err)}
                  currentImages={[]}
                />
              )}
            </div>
          )}

          {contentType === 'video' && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <Film className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <p className="text-purple-700 font-medium mb-2">
                {t('post.video.coming.soon')}
              </p>
              <p className="text-sm text-purple-600">
                {t('post.video.description')}
              </p>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('post.create.caption')} *
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder={t('post.caption.placeholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {caption.length}/500
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              {t('post.create.tags')}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tecnología, arte, viajes"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('post.tags.help')}
            </p>
          </div>

          {/* Visibility */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">
                  {t('post.visibility.public')}
                </span>
                <p className="text-sm text-gray-600">
                  {t('post.visibility.public.description')}
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isPosting}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              {t('post.form.cancel')}
            </button>
            <button
              onClick={handlePost}
              disabled={isPosting || (contentType !== 'text' && !mediaUrl) || !caption.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {isPosting ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">{t('post.creating')}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {t('post.publish')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
