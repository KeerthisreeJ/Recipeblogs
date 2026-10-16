const Recipe = require('../models/Recipe');
const User = require('../models/User');

const parseList = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return val.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const totalCount = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar bio');

    const userId = req.user ? req.user._id.toString() : null;
    const formatted = recipes.map(r => ({
      ...r.toObject(),
      likesCount: r.likes.length,
      savesCount: r.savedBy.length,
      isLiked: userId ? r.likes.some(id => id.toString() === userId) : false,
      isSaved: userId ? r.savedBy.some(id => id.toString() === userId) : false
    }));

    res.json({ success: true, recipes: formatted, totalPages, totalCount, currentPage: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name avatar bio');
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const userId = req.user ? req.user._id.toString() : null;
    const data = {
      ...recipe.toObject(),
      likesCount: recipe.likes.length,
      savesCount: recipe.savedBy.length,
      isLiked: userId ? recipe.likes.some(id => id.toString() === userId) : false,
      isSaved: userId ? recipe.savedBy.some(id => id.toString() === userId) : false
    };

    res.json({ success: true, recipe: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const { title, description, cookingTime, servings, category } = req.body;
    const ingredients = parseList(req.body.ingredients);
    const steps = parseList(req.body.steps);
    const image = req.uploadedImageUrl || req.body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      cookingTime: Number(cookingTime) || 30,
      servings: Number(servings) || 2,
      category: category || 'Other',
      image,
      author: req.user._id
    });

    res.status(201).json({ success: true, recipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, description, cookingTime, servings, category } = req.body;
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (cookingTime) recipe.cookingTime = Number(cookingTime);
    if (servings) recipe.servings = Number(servings);
    if (category) recipe.category = category;
    if (req.body.ingredients) recipe.ingredients = parseList(req.body.ingredients);
    if (req.body.steps) recipe.steps = parseList(req.body.steps);
    if (req.uploadedImageUrl) recipe.image = req.uploadedImageUrl;
    else if (req.body.image) recipe.image = req.body.image;

    await recipe.save();
    res.json({ success: true, recipe });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleLikeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });

    const userId = req.user._id;
    const index = recipe.likes.indexOf(userId);

    if (index === -1) {
      recipe.likes.push(userId);
    } else {
      recipe.likes.splice(index, 1);
    }

    await recipe.save();
    res.json({ success: true, isLiked: index === -1, likesCount: recipe.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleSaveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!recipe || !user) return res.status(404).json({ success: false, message: 'Not found' });

    const recipeIndex = recipe.savedBy.indexOf(user._id);
    const userIndex = user.savedRecipes.indexOf(recipe._id);

    if (recipeIndex === -1) {
      recipe.savedBy.push(user._id);
      if (userIndex === -1) user.savedRecipes.push(recipe._id);
    } else {
      recipe.savedBy.splice(recipeIndex, 1);
      if (userIndex !== -1) user.savedRecipes.splice(userIndex, 1);
    }

    await recipe.save();
    await user.save();

    res.json({ success: true, isSaved: recipeIndex === -1, savesCount: recipe.savedBy.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecipesByAuthor = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.authorId }).sort({ createdAt: -1 });
    res.json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMySavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedRecipes',
      populate: { path: 'author', select: 'name avatar bio' }
    });
    res.json({ success: true, recipes: user.savedRecipes || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLikeRecipe,
  toggleSaveRecipe,
  getRecipesByAuthor,
  getMySavedRecipes
};
