import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Clock, 
  Users, 
  ChefHat, 
  ArrowLeft,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { recipeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'Breakfast',
  'Pasta',
  'Dessert',
  'Dinner',
  'Baking',
  'Salad',
  'Drinks',
  'Other',
  'Hostel'
];

const CreateEditRecipe = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [imageType, setImageType] = useState('url'); // 'url' or 'file'
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [ingredients, setIngredients] = useState(['', '', '']);
  const [steps, setSteps] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  // If edit mode, fetch existing recipe data
  useEffect(() => {
    if (isEditMode) {
      const fetchExisting = async () => {
        try {
          const res = await recipeService.getById(id);
          if (res.data?.success) {
            const r = res.data.recipe;
            // Check authorization
            if (user && r.author?._id !== user._id && r.author !== user._id) {
              toast.error('You are not authorized to edit this recipe.');
              navigate('/');
              return;
            }
            setTitle(r.title || '');
            setDescription(r.description || '');
            setCategory(r.category || 'Dinner');
            setCookingTime(r.cookingTime || 30);
            setServings(r.servings || 2);
            setImageUrl(r.image || '');
            setImagePreview(r.image || '');
            setIngredients(r.ingredients && r.ingredients.length > 0 ? r.ingredients : ['']);
            setSteps(r.steps && r.steps.length > 0 ? r.steps : ['']);
          }
        } catch (err) {
          toast.error('Failed to load recipe details for editing.');
          navigate('/');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchExisting();
    }
  }, [id, isEditMode, navigate, toast, user]);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle URL change
  const handleUrlChange = (val) => {
    setImageUrl(val);
    setImagePreview(val);
  };

  // Dynamic ingredient handlers
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Dynamic step handlers
  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStepField = () => {
    setSteps([...steps, '']);
  };

  const removeStepField = (index) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!title.trim()) {
      toast.error('Please enter a recipe title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please share the story or description of your recipe');
      return;
    }

    const filteredIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    if (filteredIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    const filteredSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (filteredSteps.length === 0) {
      toast.error('Please add at least one instruction step');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('cookingTime', cookingTime.toString());
      formData.append('servings', servings.toString());
      formData.append('ingredients', JSON.stringify(filteredIngredients));
      formData.append('steps', JSON.stringify(filteredSteps));

      if (imageType === 'file' && imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl.trim()) {
        formData.append('image', imageUrl.trim());
      }

      let res;
      if (isEditMode) {
        res = await recipeService.update(id, formData);
      } else {
        res = await recipeService.create(formData);
      }

      if (res.data?.success) {
        toast.success(isEditMode ? 'Recipe updated flawlessly!' : 'Recipe published to Kittyeats journal!');
        navigate(`/recipe/${res.data.recipe._id}`);
      }
    } catch (err) {
      console.error('Save recipe error:', err);
      toast.error(err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-stone-500 font-serif italic">Loading recipe details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Exit</span>
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blush-100 text-brand-800">
          {isEditMode ? 'Editing Recipe' : 'New Culinary Entry'}
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-soft">
        <div className="border-b border-stone-100 pb-6 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            {isEditMode ? 'Revise Your Creation' : 'Publish a New Recipe'}
          </h1>
          <p className="mt-2 text-stone-600 text-sm">
            Share your culinary stories, secret ingredients, and styling instructions with food lovers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Recipe Title <span className="text-brand-700">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Saffron Risotto with Caramelized Scallops"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] text-stone-900 px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-base font-medium transition-all"
            />
          </div>

          {/* Category, Cooking Time & Servings Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAF7F2] text-stone-900 px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm font-medium transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Cooking Time (Minutes)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-stone-900 pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Servings (People)
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-stone-900 pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description / Story */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Story / Intro Description <span className="text-brand-700">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Tell the story behind this dish... what makes the flavors unforgettable, what wine pairs well, or what memories it sparks."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] text-stone-900 p-4 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm leading-relaxed transition-all"
            />
          </div>

          {/* Recipe Photography / Image */}
          <div className="p-6 bg-cream-50 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                Recipe Photography
              </label>
              {/* Toggle upload vs URL */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    imageType === 'url' ? 'bg-brand-800 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('file')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    imageType === 'file' ? 'bg-brand-800 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {imageType === 'url' ? (
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-white text-stone-900 pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-brand-800 text-sm"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center bg-white hover:border-brand-400 transition-colors">
                <Upload className="w-8 h-8 text-brand-700 mx-auto mb-2" />
                <label className="cursor-pointer text-xs font-bold text-brand-800 hover:underline">
                  <span>Click to select an image from your device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-stone-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                {imageFile && (
                  <p className="text-xs text-stone-700 font-medium mt-2 bg-blush-50 py-1 px-3 rounded-lg inline-block">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
            )}

            {/* Preview Box */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-stone-500 mb-2">Live Photo Preview:</p>
                <div className="aspect-[16/9] w-full max-w-sm rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Ingredients List <span className="text-brand-700">*</span>
                </h3>
                <p className="text-xs text-stone-400">List precise quantities & preparations</p>
              </div>
              <button
                type="button"
                onClick={addIngredientField}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 bg-blush-50 hover:bg-blush-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400 w-6 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. 250g fresh Pugliese burrata cheese"
                    value={ing}
                    onChange={(e) => handleIngredientChange(idx, e.target.value)}
                    className="flex-1 bg-[#FAF7F2] text-stone-900 px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientField(idx)}
                    disabled={ingredients.length <= 1}
                    className="p-2 text-stone-400 hover:text-brand-800 disabled:opacity-20 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Steps Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Step-by-Step Instructions <span className="text-brand-700">*</span>
                </h3>
                <p className="text-xs text-stone-400">Clear culinary directions in sequential order</p>
              </div>
              <button
                type="button"
                onClick={addStepField}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 bg-blush-50 hover:bg-blush-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-800 text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    {idx + 1}
                  </div>
                  <textarea
                    rows={2}
                    placeholder={`Step ${idx + 1}: Describe the action, temperature, and visual cues...`}
                    value={st}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    className="flex-1 bg-[#FAF7F2] text-stone-900 p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => removeStepField(idx)}
                    disabled={steps.length <= 1}
                    className="p-2 text-stone-400 hover:text-brand-800 disabled:opacity-20 transition-colors mt-2"
                    title="Remove step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-4">
            <Link
              to="/"
              className="px-5 py-2.5 text-sm font-semibold text-stone-600 hover:text-stone-900 rounded-full"
            >
              Discard Changes
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-800 hover:bg-brand-900 text-white font-medium text-sm px-7 py-3 rounded-full shadow-md hover:shadow-hover transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>}
              <span>{isEditMode ? 'Update Recipe' : 'Publish Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditRecipe;
