import React from 'react';

const SkeletonDetail = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="w-24 h-6 bg-stone-200 rounded-full mb-6"></div>

      <div className="w-28 h-6 bg-stone-200 rounded-full mb-4"></div>

      <div className="h-10 bg-stone-200 rounded w-4/5 mb-3"></div>
      <div className="h-10 bg-stone-200 rounded w-2/3 mb-6"></div>

      <div className="flex items-center gap-3 pb-6 border-b border-stone-200 mb-8">
        <div className="w-12 h-12 rounded-full bg-stone-200"></div>
        <div className="space-y-2">
          <div className="w-32 h-4 bg-stone-200 rounded"></div>
          <div className="w-20 h-3 bg-stone-100 rounded"></div>
        </div>
      </div>

      <div className="aspect-[16/9] w-full bg-stone-200 rounded-3xl mb-8"></div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="h-16 bg-stone-100 rounded-2xl"></div>
        <div className="h-16 bg-stone-100 rounded-2xl"></div>
        <div className="h-16 bg-stone-100 rounded-2xl"></div>
      </div>

      <div className="space-y-3 mb-12">
        <div className="h-4 bg-stone-200 rounded w-full"></div>
        <div className="h-4 bg-stone-200 rounded w-5/6"></div>
        <div className="h-4 bg-stone-200 rounded w-4/6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="h-64 bg-stone-100 rounded-3xl"></div>
        <div className="md:col-span-2 h-80 bg-stone-100 rounded-3xl"></div>
      </div>
    </div>
  );
};

export default SkeletonDetail;
