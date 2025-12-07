import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface Post {
  id: string;
  user_id: string;
  content_type: 'image' | 'video' | 'text';
  media_url: string | null;
  caption: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_public: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

interface UserPostsFeedProps {
  userId?: string;
  showOnlyUserPosts?: boolean;
}

export default function UserPostsFeed({ userId, showOnlyUserPosts = false }: UserPostsFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [userId, showOnlyUserPosts]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('user_posts')
        .select(`
          *,
          profiles:profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (showOnlyUserPosts && userId) {
        query = query.eq('user_id', userId);
      } else if (showOnlyUserPosts && user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err: any) {
      console.error('Error loading posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('¿Eliminar esta publicación?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('user_posts')
        .delete()
        .eq('id', postId);

      if (deleteError) throw deleteError;

      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err: any) {
      console.error('Error deleting post:', err);
      alert('Error al eliminar la publicación');
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        });

      if (likeError) {
        if (likeError.code === '23505') {
          const { error: unlikeError } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (unlikeError) throw unlikeError;
        } else {
          throw likeError;
        }
      }

      await loadPosts();
    } catch (err: any) {
      console.error('Error liking post:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
        Error al cargar publicaciones: {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay publicaciones aún
        </h3>
        <p className="text-gray-600">
          {showOnlyUserPosts
            ? 'Crea tu primera publicación para compartir con la comunidad'
            : 'Sé el primero en crear una publicación'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles.full_name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  post.profiles?.full_name?.charAt(0) || '?'
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.profiles?.full_name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            {user && user.id === post.user_id && (
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Post Media */}
          {post.media_url && post.content_type === 'image' && (
            <div className="w-full">
              <img
                src={post.media_url}
                alt={post.caption}
                className="w-full object-cover max-h-[600px]"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="p-4">
            {/* Stats */}
            <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-1 hover:text-red-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>{post.likes_count}</span>
              </button>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-5 h-5" />
                <span>{post.views_count}</span>
              </div>
            </div>

            {/* Caption */}
            <p className="text-gray-900 mb-3">{post.caption}</p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
