import React, { useState } from 'react';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onLike: (projectId: string) => void;
  onComment: (projectId: string, comment: string) => void;
  onContact: (creatorId: string) => void;
}

export default function ProjectCard({ project, onLike, onComment, onContact }: ProjectCardProps) {
<<<<<<< HEAD
  const { t } = useLanguage();
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');
  const [hasLiked, setHasLiked] = useState(false);

  const fundingPercentage = (project.current_funding / project.funding_goal) * 100;
  const likesPercentage = (project.likes_count / project.funding_threshold) * 100;
  const isNearFunding = likesPercentage >= 80;
  const isFunded = project.status === 'funded' || likesPercentage >= 100;

  const handleLike = () => {
    if (!hasLiked) {
      onLike(project.id);
      setHasLiked(true);
    }
  };

  const handleComment = () => {
    if (comment.trim()) {
      onComment(project.id, comment);
      setComment('');
      setShowCommentForm(false);
    }
  };

  const getStatusColor = () => {
    if (isFunded) return 'from-green-500 to-emerald-600';
    if (isNearFunding) return 'from-yellow-500 to-orange-600';
    return 'from-blue-500 to-indigo-600';
  };

  const getStatusText = () => {
    if (isFunded) return '🎉 ¡FINANCIADO!';
    if (isNearFunding) return '🔥 ¡Casi financiado!';
    return '💡 Buscando apoyo';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Status Banner */}
      <div className={`bg-gradient-to-r ${getStatusColor()} text-white p-3 text-center font-bold`}>
        {getStatusText()}
      </div>

      <div className="p-6">
        {/* Creator Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {project.creator_avatar ? (
<<<<<<< HEAD
              <img
                src={project.creator_avatar}
=======
              <img 
                src={project.creator_avatar} 
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                alt={project.creator_name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {project.creator_name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{project.creator_name}</p>
<<<<<<< HEAD
            <p className="text-sm text-gray-600">{t('lang') === 'en' && project.category_en ? project.category_en : project.category}</p>
=======
            <p className="text-sm text-gray-600">{project.category}</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
          </div>
        </div>

        {/* Project Info */}
<<<<<<< HEAD
        <h3 className="text-lg font-bold text-gray-900 mb-3">{t('lang') === 'en' && project.title_en ? project.title_en : project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{t('lang') === 'en' && project.description_en ? project.description_en : project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(t('lang') === 'en' && project.tags_en ? project.tags_en : project.tags).slice(0, 3).map((tag, index) => (
=======
        <h3 className="text-lg font-bold text-gray-900 mb-3">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Financiación</span>
            <span className="font-semibold">${project.current_funding.toLocaleString()} / ${project.funding_goal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getStatusColor()} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(100, fundingPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Likes Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Apoyo Comunitario</span>
            <span className="font-semibold">{project.likes_count} / {project.funding_threshold} likes</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, likesPercentage)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isFunded ? '✅ Threshold alcanzado - Financiación activada' : `${project.funding_threshold - project.likes_count} likes para financiación`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                hasLiked 
                  ? 'bg-pink-100 text-pink-600 cursor-not-allowed'
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
            >
              {hasLiked ? '❤️ Liked' : '👍 Like'}
            </button>
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              💬 {project.comments_count}
            </button>
            <button
              onClick={() => onContact(project.creator_id)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              🤝 Contactar
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Comment Form */}
        {showCommentForm && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu opinión sobre este proyecto..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setShowCommentForm(false)}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleComment}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50"
              >
                💬 Comentar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}