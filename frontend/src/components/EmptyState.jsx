import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, PlusCircle, RefreshCw } from 'lucide-react';

const EmptyState = ({
  icon: Icon = UtensilsCrossed,
  title = 'No Recipes Found',
  description = 'We couldn\'t find any culinary creations matching your criteria.',
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-lg mx-auto shadow-soft my-12">
      <div className="w-16 h-16 rounded-2xl bg-blush-100 text-brand-800 flex items-center justify-center mx-auto mb-5">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-stone-600 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
