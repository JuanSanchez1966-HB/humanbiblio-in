import React, { useState, useEffect } from 'react';
import { Edit, Plus, Image as ImageIcon, Grid, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import PersonalProfileEditor from './PersonalProfileEditor';
import PostCreator from './PostCreator';
import UserPostsFeed from './UserPostsFeed';

export default function UserProfile() {
  const { user, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const [showEditor, setShowEditor] = useState(false);
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [activeView, setActiveView] = useState<'feed' | 'gallery'>('feed');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadMediaData();
    }
  }, [user]);

  const loadMediaData = async () => {
    if (!user) return;

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

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
            {/* Avatar and Name */}
            <div className="flex items-end space-x-6">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {user.full_name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-xl text-blue-600">{user.profession}</p>
                <p className="text-gray-600">{user.location || user.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowEditor(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>{t('wb.edit.button')}</span>
              </button>
              <button
                onClick={() => setShowPostCreator(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Publicación</span>
              </button>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mt-6">
              <p className="text-gray-700 text-lg leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {galleryUrls.length}
              </div>
              <div className="text-sm text-gray-600">Fotos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Conexiones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.8 ⭐</div>
              <div className="text-sm text-gray-600">Valoración</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('feed')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
              activeView === 'feed'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="w-5 h-5" />
            <span>Publicaciones</span>
          </button>
          <button
            onClick={() => setActiveView('gallery')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
              activeView === 'gallery'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span>Galería</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {activeView === 'feed' && (
          <UserPostsFeed userId={user.id} showOnlyUserPosts={true} />
        )}

        {activeView === 'gallery' && (
          <div>
            {galleryUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryUrls.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={`Galería ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay fotos en tu galería
                </h3>
                <p className="text-gray-600 mb-4">
                  Sube fotos de tus momentos favoritos
                </p>
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
                >
                  Subir Fotos
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Editor Modal */}
      <PersonalProfileEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSaveSuccess={() => {
          refreshProfile();
          loadMediaData();
          setShowEditor(false);
        }}
      />

      {/* Post Creator Modal */}
      <PostCreator
        isOpen={showPostCreator}
        onClose={() => setShowPostCreator(false)}
        onPostCreated={() => {
          setShowPostCreator(false);
          setActiveView('feed');
        }}
      />
    </div>
  );
}
