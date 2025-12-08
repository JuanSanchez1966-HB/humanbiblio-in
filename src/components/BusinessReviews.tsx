import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  user_review_count: number;
}

interface RatingSummary {
  business_id: string;
  total_reviews: number;
  average_rating: number;
  rating_5_count: number;
  rating_4_count: number;
  rating_3_count: number;
  rating_2_count: number;
  rating_1_count: number;
}

interface BusinessReviewsProps {
  businessId: string;
  currentUserId?: string;
}

export default function BusinessReviews({ businessId, currentUserId }: BusinessReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating_high' | 'helpful'>('recent');

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    loadSummary();
  }, [businessId, sortBy]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_business_reviews', {
        p_business_id: businessId,
        p_sort_by: sortBy,
        p_limit: 20,
        p_offset: 0
      });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('business_rating_summary')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;
      setSummary(data);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUserId || !newComment.trim()) return;

    try {
      setSubmitting(true);

      const { error } = await supabase.from('business_reviews').insert({
        business_id: businessId,
        rating: newRating,
        title: newTitle.trim() || null,
        comment: newComment.trim()
      });

      if (error) throw error;

      // Reset form
      setNewRating(5);
      setNewTitle('');
      setNewComment('');
      setShowReviewForm(false);

      // Reload reviews
      loadReviews();
      loadSummary();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Error al enviar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId: string, isHelpful: boolean) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase.from('review_helpfulness').insert({
        review_id: reviewId,
        is_helpful: isHelpful
      });

      if (error) {
        if (error.code === '23505') {
          alert('Ya has votado en esta reseña');
        } else {
          throw error;
        }
      } else {
        loadReviews();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const renderStars = (rating: number, size: 'small' | 'large' = 'small') => {
    const sizeClass = size === 'large' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center space-x-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    );
  };

  if (loading && !summary) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {summary && summary.total_reviews > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {summary.average_rating.toFixed(1)}
                </span>
                {renderStars(Math.round(summary.average_rating), 'large')}
              </div>
              <p className="text-gray-600">
                {summary.total_reviews} {summary.total_reviews === 1 ? 'reseña' : 'reseñas'}
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              disabled={!currentUserId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Escribir reseña</span>
            </button>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-16">{star} estrellas</span>
                {renderRatingBar(
                  summary[`rating_${star}_count` as keyof RatingSummary] as number,
                  summary.total_reviews
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && currentUserId && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Escribe tu reseña</h3>

          {/* Rating selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= newRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título (opcional)
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Resume tu experiencia"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {newComment.length}/500 caracteres
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => setShowReviewForm(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Enviando...' : 'Publicar reseña'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sort options */}
      {reviews.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              sortBy === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Más recientes
          </button>
          <button
            onClick={() => setSortBy('rating_high')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              sortBy === 'rating_high'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mejor valoradas
          </button>
          <button
            onClick={() => setSortBy('helpful')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              sortBy === 'helpful'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Más útiles
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">{review.user_name}</span>
                  <span className="text-xs text-gray-500">
                    • {review.user_review_count} {review.user_review_count === 1 ? 'reseña' : 'reseñas'}
                  </span>
                </div>
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            {review.title && (
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
            )}

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {/* Helpful buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleVoteHelpful(review.id, true)}
                disabled={!currentUserId}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Útil ({review.helpful_count})</span>
              </button>
              <button
                onClick={() => handleVoteHelpful(review.id, false)}
                disabled={!currentUserId}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>({review.not_helpful_count})</span>
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Aún no hay reseñas para este negocio</p>
            {currentUserId && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sé el primero en opinar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
