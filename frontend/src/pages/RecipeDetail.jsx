import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  Users, 
  ArrowLeft, 
  ChefHat, 
  Edit3, 
  Trash2, 
  Check, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { recipeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SkeletonDetail from '../components/SkeletonDetail';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await recipeService.getById(id);
        if (res.data?.success) {
          const r = res.data.recipe;
          setRecipe(r);
          setIsLiked(r.isLiked);
          setLikesCount(r.likesCount || (r.likes ? r.likes.length : 0));
          setIsSaved(r.isSaved);
        }
      } catch (err) {
        console.error('Failed to load recipe:', err);
        setError(err.response?.data?.message || 'Could not find this recipe.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to like this recipe');
      navigate('/login');
      return;
    }

    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 400);

    try {
      const res = await recipeService.toggleLike(id);
      if (res.data?.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error('Failed to toggle like');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to bookmark this recipe');
      navigate('/login');
      return;
    }

    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    try {
      const res = await recipeService.toggleSave(id);
      if (res.data?.success) {
        setIsSaved(res.data.isSaved);
        toast.success(res.data.isSaved ? 'Saved to your recipe box!' : 'Removed from bookmarks');
      }
    } catch (err) {
      setIsSaved(prevSaved);
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Recipe link copied to clipboard!');
    } else {
      toast.info(window.location.href);
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDeleteRecipe = async () => {
    setDeleting(true);
    try {
      const res = await recipeService.delete(id);
      if (res.data?.success) {
        toast.success('Recipe successfully deleted');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete recipe');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) return <SkeletonDetail />;

  if (error || !recipe) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-brand-800 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Recipe Not Found</h2>
        <p className="text-stone-600 mb-6">{error || 'This recipe may have been removed.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-800 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-brand-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Discover</span>
        </Link>
      </div>
    );
  }

  const isAuthor = user && recipe.author && (recipe.author._id === user._id || recipe.author === user._id);
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>

      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          {recipe.category && (
            <span className="bg-blush-100 text-brand-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              {recipe.category}
            </span>
          )}
          <span className="text-xs text-stone-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15] mb-6">
          {recipe.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-stone-200 mb-8">
          <Link
            to={`/profile/${recipe.author?._id || recipe.author}`}
            className="flex items-center gap-3.5 group"
          >
            <img
              src={recipe.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={recipe.author?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-100 shadow-sm"
            />
            <div>
              <p className="font-medium text-stone-900 group-hover:text-brand-800 transition-colors text-sm">
                By {recipe.author?.name || 'Kittyeats Food Stylist'}
              </p>
              <p className="text-xs text-stone-500 line-clamp-1 max-w-xs sm:max-w-sm">
                {recipe.author?.bio || 'Passionate recipe creator'}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all active:scale-95 ${
                isLiked
                  ? 'bg-blush-100 border-brand-200 text-brand-800'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-brand-200 hover:text-brand-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-brand-800' : ''} ${isLikeAnimating ? 'animate-heart' : ''}`} />
              <span>{likesCount} Likes</span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all active:scale-95 ${
                isSaved
                  ? 'bg-brand-800 border-brand-800 text-white'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-brand-200 hover:text-brand-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-brand-800 hover:border-brand-200 flex items-center justify-center transition-colors shadow-sm"
              title="Share Recipe"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {isAuthor && (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200 ml-1">
                <Link
                  to={`/edit/${recipe._id}`}
                  className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-colors"
                  title="Edit Recipe"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-brand-700 transition-colors"
                  title="Delete Recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-card border border-stone-200/80 mb-10">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-3xl border border-stone-200/80 shadow-soft mb-12">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-blush-100 text-brand-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Time</p>
              <p className="text-base font-bold text-stone-800">{recipe.cookingTime || 30} Minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-blush-100 text-brand-800 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Servings</p>
              <p className="text-base font-bold text-stone-800">{recipe.servings || 2} People</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-blush-100 text-brand-800 flex items-center justify-center shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Ingredients</p>
              <p className="text-base font-bold text-stone-800">{recipe.ingredients?.length || 0} Items</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-2xl bg-blush-100 text-brand-800 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Community</p>
              <p className="text-base font-bold text-stone-800">{likesCount} Applauds</p>
            </div>
          </div>
        </div>

        <section className="mb-14">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-3">
            The Story Behind the Dish
          </h2>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-sans font-normal whitespace-pre-line bg-cream-50/70 p-6 rounded-2xl border border-stone-200/50">
            {recipe.description}
          </p>
        </section>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-soft">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Ingredients
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Click items as you prep in your kitchen
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-800 bg-blush-50 px-2.5 py-1 rounded-full">
                  {Object.values(checkedIngredients).filter(Boolean).length} / {recipe.ingredients?.length}
                </span>
              </div>

              <ul className="space-y-3">
                {recipe.ingredients?.map((item, index) => {
                  const isChecked = !!checkedIngredients[index];
                  return (
                    <li
                      key={index}
                      onClick={() => toggleIngredient(index)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-stone-50 text-stone-400 line-through'
                          : 'hover:bg-blush-50/50 text-stone-800'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-brand-800 border-brand-800 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium leading-relaxed select-none">
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <section className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft">
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                Step-by-Step Instructions
              </h3>

              <div className="space-y-8">
                {recipe.steps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 sm:gap-5 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-800 text-white font-serif font-bold text-base flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {idx + 1}
                    </div>

                    <div className="flex-1 pt-1">
                      <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans whitespace-pre-line">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-5 rounded-2xl bg-blush-50 border border-brand-100 flex items-start gap-3.5">
                <span className="text-xl">👩‍🍳</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-1">
                    Kittyeats Culinary Tip
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Plate hot dishes in warmed bowls and desserts on chilled marble for a true fine-dining sensation. Tag your creation with #Kittyeats to get featured on our journal.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-14 bg-gradient-to-r from-cream-50 via-blush-50 to-white p-8 rounded-3xl border border-stone-200 shadow-soft flex flex-col sm:flex-row items-center gap-6">
          <img
            src={recipe.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={recipe.author?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
          />
          <div className="text-center sm:text-left flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
              Recipe Creator
            </span>
            <h4 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
              {recipe.author?.name}
            </h4>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              {recipe.author?.bio || 'Culinary enthusiast sharing love through wholesome cooking & aesthetics.'}
            </p>
          </div>
          <Link
            to={`/profile/${recipe.author?._id || recipe.author}`}
            className="shrink-0 bg-stone-900 hover:bg-brand-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            View Profile & Recipes
          </Link>
        </div>
      </main>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-hover animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-brand-800 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Delete This Recipe?
            </h3>
            <p className="text-sm text-stone-600 mb-6">
              Are you sure you want to delete <strong className="text-stone-900">"{recipe.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRecipe}
                disabled={deleting}
                className="px-5 py-2 text-sm font-semibold text-white bg-brand-800 hover:bg-brand-900 rounded-full shadow-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default RecipeDetail;
