import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { recipeService } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Pasta',
  'Dessert',
  'Dinner',
  'Baking',
  'Salad',
  'Drinks',
  'Hostel'
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'All';
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
      };

      if (currentSearch) params.search = currentSearch;
      if (currentCategory && currentCategory !== 'All') params.category = currentCategory;

      const res = await recipeService.getAll(params);
      if (res.data?.success) {
        setRecipes(res.data.recipes);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  }, [currentSearch, currentCategory, currentPage]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-50 via-cream-50 to-[#FAF7F2] py-16 sm:py-20 border-b border-stone-200/60">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blush-200/30 rounded-full blur-2xl pointer-events-none -z-0"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-100 text-brand-800 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
            <span>Blog with recipes</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
            Cooking and sharing recipes <br className="hidden sm:inline" />
            <span className="italic font-normal text-brand-800">Recipes</span>.
          </h1>

          <p className="mt-5 text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Explore new ideas.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl mx-auto flex items-center bg-white rounded-full p-2 border border-stone-200 shadow-card focus-within:border-brand-800 transition-all"
          >
            <div className="pl-3 text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search recipes, ingredients (e.g. burrata, truffle, berries)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent px-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full mr-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-brand-800 hover:bg-brand-900 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {currentSearch && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-600">
              <span>Showing results for: <strong className="text-brand-800">"{currentSearch}"</strong></span>
              <button
                onClick={handleClearSearch}
                className="underline hover:text-stone-900"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200/80 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            {CATEGORIES.map((cat) => {
              const active = currentCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-brand-800 text-white shadow-sm scale-105'
                      : 'bg-white text-stone-600 hover:bg-blush-50 hover:text-brand-800 border border-stone-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-xs text-stone-500 shrink-0">
            <span>{totalCount} {totalCount === 1 ? 'recipe' : 'recipes'} discovered</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState
            title="No Culinary Stories Found"
            description={
              currentSearch
                ? `No recipes matched "${currentSearch}". Try a different keyword or explore our categories!`
                : "No recipes available in this category yet. Be the first to share one!"
            }
            actionText={currentSearch ? "Clear Filter" : "Create a Recipe"}
            onActionClick={currentSearch ? handleClearSearch : undefined}
            actionLink={currentSearch ? undefined : "/create"}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-stone-200 bg-white text-stone-700 hover:border-brand-300 hover:text-brand-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-brand-800 text-white shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-blush-50 border border-stone-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-stone-200 bg-white text-stone-700 hover:border-brand-300 hover:text-brand-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
