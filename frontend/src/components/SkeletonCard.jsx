import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft animate-pulse flex flex-col justify-between">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-stone-200/80 w-full"></div>

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Author avatar & name skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-stone-200"></div>
            <div className="w-24 h-3 bg-stone-200 rounded"></div>
          </div>

          {/* Title skeleton */}
          <div className="h-5 bg-stone-200 rounded w-5/6 mb-2"></div>
          <div className="h-5 bg-stone-200 rounded w-3/4 mb-3"></div>

          {/* Intro lines skeleton */}
          <div className="h-3 bg-stone-100 rounded w-full mb-1.5"></div>
          <div className="h-3 bg-stone-100 rounded w-2/3"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
          <div className="w-16 h-4 bg-stone-200 rounded-full"></div>
          <div className="w-20 h-4 bg-stone-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
