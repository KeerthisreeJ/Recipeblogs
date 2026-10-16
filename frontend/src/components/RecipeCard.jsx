import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Clock, Users } from 'lucide-react';
import { recipeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RecipeCard = ({ recipe, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(
    recipe.isLiked || (recipe.likes && user ? recipe.likes.includes(user._id) : false)
  );
  const [likesCount, setLikesCount] = useState(
    recipe.likesCount !== undefined ? recipe.likesCount : (recipe.likes ? recipe.likes.length : 0)
  );
  const [isSaved, setIsSaved] = useState(
    recipe.isSaved || (recipe.savedBy && user ? recipe.savedBy.includes(user._id) : false)
  );
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to like this recipe');
      navigate('/login');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 400);

    try {
      const res = await recipeService.toggleLike(recipe._id);
      if (res.data?.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
        if (onUpdate) onUpdate({ ...recipe, isLiked: res.data.isLiked, likesCount: res.data.likesCount });
      }
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to save this recipe');
      navigate('/login');
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    try {
      const res = await recipeService.toggleSave(recipe._id);
      if (res.data?.success) {
        setIsSaved(res.data.isSaved);
        toast.success(res.data.isSaved ? 'Recipe saved to bookmarks!' : 'Recipe removed from bookmarks');
        if (onUpdate) onUpdate({ ...recipe, isSaved: res.data.isSaved });
      }
    } catch (err) {
      setIsSaved(prevSaved);
      toast.error('Failed to update bookmark');
    } finally {
      setIsSaving(false);
    }
  };

  const authorName = recipe.author?.name || 'Kittyeats Chef';
  const authorAvatar =
    recipe.author?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const authorId = recipe.author?._id || recipe.author;

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Link to={`/recipe/${recipe._id}`} className="block w-full h-full">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </Link>

        {recipe.category && (
          <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
            <span className="bg-white/95 backdrop-blur-md text-brand-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-brand-100/60 uppercase tracking-wider">
              {recipe.category}
            </span>
          </div>
        )}

        <div className="absolute top-3.5 right-3.5 z-10">
          <button
            onClick={handleSave}
            title={isSaved ? 'Remove from bookmarks' : 'Save to bookmarks'}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm active:scale-90 ${
              isSaved
                ? 'bg-brand-800 text-white'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-brand-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3.5 right-3.5 z-10 pointer-events-none flex items-center justify-between text-xs font-medium text-stone-800">
          <div className="flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-stone-100">
              <Clock className="w-3.5 h-3.5 text-brand-700" />
              <span>{recipe.cookingTime || 30}m</span>
            </span>
            <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-stone-100">
              <Users className="w-3.5 h-3.5 text-brand-700" />
              <span>{recipe.servings || 2} serv</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Link
              to={`/profile/${authorId}`}
              className="flex items-center gap-2 group/author text-xs text-stone-500 hover:text-brand-800 transition-colors"
            >
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-5 h-5 rounded-full object-cover border border-stone-200"
              />
              <span className="font-medium group-hover/author:underline truncate max-w-[150px]">
                {authorName}
              </span>
            </Link>
          </div>

          <Link to={`/recipe/${recipe._id}`} className="block group-hover:text-brand-800 transition-colors">
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug line-clamp-2">
              {recipe.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
            {recipe.description}
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-800 transition-colors group/btn"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isLiked
                  ? 'bg-blush-100 text-brand-800'
                  : 'bg-stone-50 text-stone-400 group-hover/btn:text-brand-800 group-hover/btn:bg-blush-50'
              } ${isLikeAnimating ? 'animate-heart' : ''}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-brand-800' : ''}`} />
            </div>
            <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          </button>

          <Link
            to={`/recipe/${recipe._id}`}
            className="text-xs font-semibold text-brand-800 hover:text-brand-900 uppercase tracking-wider flex items-center gap-1 hover:translate-x-0.5 transition-transform"
          >
            Read Story →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
