import React from 'react';
import type { Project } from '../types';

interface TrendingProjectsProps {
  projects: Project[];
  onLike: (projectId: string) => void;
}

export default function TrendingProjects({ projects, onLike }: TrendingProjectsProps) {
  if (projects.length === 0) return null;

  const topProject = projects.sort((a, b) => b.likes_count - a.likes_count)[0];

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🔥</div>
        <h3 className="text-2xl font-bold mb-2">Proyecto Más Popular</h3>
        <p className="text-yellow-100">El proyecto que más conversaciones está generando</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {topProject.creator_avatar ? (
              <img 
                src={topProject.creator_avatar} 
                alt={topProject.creator_name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white font-bold">
                {topProject.creator_name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xl font-bold">{topProject.title}</h4>
            <p className="text-yellow-100">por {topProject.creator_name}</p>
          </div>
        </div>

        <p className="text-white/90 mb-6 leading-relaxed">
          {topProject.description.substring(0, 200)}...
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{topProject.likes_count}</div>
            <div className="text-yellow-200 text-sm">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{topProject.comments_count}</div>
            <div className="text-yellow-200 text-sm">Comentarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${(topProject.current_funding / 1000).toFixed(0)}K</div>
            <div className="text-yellow-200 text-sm">Financiado</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {topProject.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => onLike(topProject.id)}
            className="px-6 py-2 bg-white text-orange-600 rounded-xl hover:bg-yellow-50 transition-colors font-semibold"
          >
            👍 Apoyar
          </button>
        </div>
      </div>
    </div>
  );
}