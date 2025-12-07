import React from 'react';

interface LoadingCardProps {
  count?: number;
  type?: 'user' | 'business' | 'project';
}

export default function LoadingCard({ count = 1, type = 'user' }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
        >
          {type === 'user' && (
            <>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-8 bg-gray-200 rounded-full w-20" />
                <div className="h-8 bg-gray-200 rounded-full w-24" />
              </div>
            </>
          )}

          {type === 'business' && (
            <>
              <div className="mb-4">
                <div className="w-full h-40 bg-gray-200 rounded-xl" />
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-9 bg-gray-200 rounded-xl w-32" />
                <div className="h-9 bg-gray-200 rounded-xl w-28" />
              </div>
            </>
          )}

          {type === 'project' && (
            <>
              <div className="mb-4">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded-full w-24" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
}
