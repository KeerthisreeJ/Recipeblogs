import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Bookmark, 
  Heart, 
  Grid, 
  Edit2, 
  PlusCircle, 
  Settings, 
  ChefHat, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { recipeService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const Profile = () => {
  const { id: paramUserId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser, updateUser } = useAuth();
  const toast = useToast();

  const isOwnProfile = !paramUserId || (currentUser && currentUser._id === paramUserId);
  const targetUserId = paramUserId || currentUser?._id;

  const currentTab = searchParams.get('tab') || 'recipes'; // 'recipes' or 'saved'

  const [profileUser, setProfileUser] = useState(null);
  const [authoredRecipes, setAuthoredRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [stats, setStats] = useState({ recipesCount: 0, totalLikes: 0 });
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!targetUserId) return;
    setLoading(true);

    try {
      const res = await userService.getProfile(targetUserId);
      if (res.data?.success) {
        setProfileUser(res.data.user);
        setAuthoredRecipes(res.data.recipes);
        setStats(res.data.stats || { recipesCount: res.data.recipes.length, totalLikes: 0 });
        setEditName(res.data.user.name || '');
        setEditBio(res.data.user.bio || '');
        setEditAvatar(res.data.user.avatar || '');
      }

      // If viewing own profile, also load saved recipes
      if (isOwnProfile) {
        const savedRes = await recipeService.getSaved();
        if (savedRes.data?.success) {
          setSavedRecipes(savedRes.data.recipes || []);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, isOwnProfile, toast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Tab switch
  const handleTabSwitch = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    setSearchParams(params);
  };

  // Update profile submit
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await userService.updateProfile({
        name: editName.trim(),
        bio: editBio.trim(),
        avatar: editAvatar.trim(),
      });

      if (res.data?.success) {
        setProfileUser(res.data.user);
        updateUser(res.data.user);
        toast.success('Profile updated beautifully!');
        setIsEditModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Profile Header Box */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft mb-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar with decorative ring */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-brand-800 to-blush-300 shadow-md">
              <img
                src={profileUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={profileUser?.name}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-1 right-1 p-2 bg-stone-900 text-white rounded-full shadow-md hover:bg-brand-800 transition-colors"
                title="Edit Profile"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User Details & Bio */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {profileUser?.name || 'Chef Profile'}
                </h1>
                <p className="text-xs text-stone-400 mt-0.5">
                  Member of Kittyeats Culinary Circle
                </p>
              </div>

              {/* Action buttons */}
              {isOwnProfile ? (
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:border-brand-300 hover:text-brand-800 transition-colors bg-white shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Recipe</span>
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Bio */}
            <p className="text-sm text-stone-600 leading-relaxed max-w-2xl font-sans mb-6">
              {profileUser?.bio || 'Passionate about authentic cooking, comforting seasonal bakes, and culinary visual aesthetics.'}
            </p>

            {/* Metrics Bar */}
            <div className="flex items-center justify-center md:justify-start gap-8 text-center pt-4 border-t border-stone-100">
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                  {authoredRecipes.length}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  Recipes Shared
                </span>
              </div>

              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-brand-800 block">
                  {stats.totalLikes}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  Likes Earned
                </span>
              </div>

              {isOwnProfile && (
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 block">
                    {savedRecipes.length}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                    Saved Recipes
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-center border-b border-stone-200 mb-8">
        <button
          onClick={() => handleTabSwitch('recipes')}
          className={`flex items-center gap-2 pb-3.5 px-6 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 ${
            currentTab === 'recipes'
              ? 'border-brand-800 text-brand-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{isOwnProfile ? 'My Recipes' : 'Authored Recipes'} ({authoredRecipes.length})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => handleTabSwitch('saved')}
            className={`flex items-center gap-2 pb-3.5 px-6 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 ${
              currentTab === 'saved'
                ? 'border-brand-800 text-brand-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Bookmarks ({savedRecipes.length})</span>
          </button>
        )}
      </div>

      {/* Grid Content */}
      <main>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : currentTab === 'recipes' ? (
          authoredRecipes.length === 0 ? (
            <EmptyState
              icon={ChefHat}
              title="No Recipes Shared Yet"
              description={
                isOwnProfile
                  ? "Your recipe journal is currently blank. Craft your first signature creation today!"
                  : "This chef hasn't shared any recipes yet."
              }
              actionText={isOwnProfile ? "Create First Recipe" : undefined}
              actionLink={isOwnProfile ? "/create" : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {authoredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={{ ...recipe, author: profileUser }}
                  onUpdate={loadProfile}
                />
              ))}
            </div>
          )
        ) : (
          savedRecipes.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No Saved Bookmarks"
              description="Save recipes by clicking the bookmark icon on any recipe card to build your private collection."
              actionText="Explore Recipes"
              actionLink="/"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onUpdate={loadProfile}
                />
              ))}
            </div>
          )
        )}
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-hover animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Edit Chef Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] text-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-brand-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-brand-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Bio / Culinary Story
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={240}
                  className="w-full bg-[#FAF7F2] text-stone-900 p-3 rounded-xl border border-stone-200 text-sm leading-relaxed focus:outline-none focus:border-brand-800"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-brand-800 hover:bg-brand-900 rounded-full shadow-sm disabled:opacity-60"
                >
                  {isUpdating ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
