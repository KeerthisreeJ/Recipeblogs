const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Helper to safely parse JSON arrays or strings
const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // If it's a newline or comma separated string
      return value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// @desc    Get all recipes (paginated, with search & category filter)
// @route   GET /api/recipes
// @access  Public (optional auth for isLiked/isSaved)
const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';
    const category = req.query.category ? req.query.category.trim() : '';

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const totalCount = await Recipe.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar bio');

    // Attach user-specific flags if authenticated
    const currentUserId = req.user ? req.user._id.toString() : null;
    const enhancedRecipes = recipes.map((recipe) => {
      const r = recipe.toObject();
      return {
        ...r,
        likesCount: r.likes ? r.likes.length : 0,
        savesCount: r.savedBy ? r.savedBy.length : 0,
        isLiked: currentUserId
          ? (r.likes || []).some((id) => id.toString() === currentUserId)
          : false,
        isSaved: currentUserId
          ? (r.savedBy || []).some((id) => id.toString() === currentUserId)
          : false
      };
    });

    res.status(200).json({
      success: true,
      count: recipes.length,
      totalCount,
      totalPages,
      currentPage: page,
      recipes: enhancedRecipes
    });
  } catch (error) {
    console.error('[Get Recipes Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes',
      error: error.message
    });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public (optional auth for isLiked/isSaved)
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      'author',
      'name avatar bio'
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    const r = recipe.toObject();

    const enhancedRecipe = {
      ...r,
      likesCount: r.likes ? r.likes.length : 0,
      savesCount: r.savedBy ? r.savedBy.length : 0,
      isLiked: currentUserId
        ? (r.likes || []).some((id) => id.toString() === currentUserId)
        : false,
      isSaved: currentUserId
        ? (r.savedBy || []).some((id) => id.toString() === currentUserId)
        : false
    };

    res.status(200).json({
      success: true,
      recipe: enhancedRecipe
    });
  } catch (error) {
    console.error('[Get Recipe Error]:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Invalid Recipe ID' });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipe',
      error: error.message
    });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const { title, description, cookingTime, servings, category } = req.body;

    const ingredients = parseArray(req.body.ingredients);
    const steps = parseArray(req.body.steps);

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient'
      });
    }

    if (!steps || steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one cooking step'
      });
    }

    // Determine image: file upload > body image > default aesthetic food image
    let image =
      req.uploadedImageUrl ||
      req.body.image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      cookingTime: Number(cookingTime) || 30,
      servings: Number(servings) || 2,
      category: category || 'Other',
      image,
      author: req.user._id,
      likes: [],
      savedBy: []
    });

    const populatedRecipe = await Recipe.findById(recipe._id).populate(
      'author',
      'name avatar bio'
    );

    res.status(201).json({
      success: true,
      recipe: populatedRecipe
    });
  } catch (error) {
    console.error('[Create Recipe Error]:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create recipe'
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (Author only)
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Ensure logged in user is recipe author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }

    const { title, description, cookingTime, servings, category } = req.body;

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (cookingTime) recipe.cookingTime = Number(cookingTime);
    if (servings) recipe.servings = Number(servings);
    if (category) recipe.category = category;

    if (req.body.ingredients) {
      const parsedIngredients = parseArray(req.body.ingredients);
      if (parsedIngredients.length > 0) {
        recipe.ingredients = parsedIngredients;
      }
    }

    if (req.body.steps) {
      const parsedSteps = parseArray(req.body.steps);
      if (parsedSteps.length > 0) {
        recipe.steps = parsedSteps;
      }
    }

    if (req.uploadedImageUrl) {
      recipe.image = req.uploadedImageUrl;
    } else if (req.body.image) {
      recipe.image = req.body.image;
    }

    const updatedRecipe = await recipe.save();
    const populated = await Recipe.findById(updatedRecipe._id).populate(
      'author',
      'name avatar bio'
    );

    res.status(200).json({
      success: true,
      recipe: populated
    });
  } catch (error) {
    console.error('[Update Recipe Error]:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update recipe'
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Author only)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Ensure logged in user is recipe author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    // Clean up references from users' savedRecipes
    await User.updateMany(
      { savedRecipes: req.params.id },
      { $pull: { savedRecipes: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('[Delete Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipe',
      error: error.message
    });
  }
};

// @desc    Like / Unlike recipe
// @route   POST /api/recipes/:id/like
// @access  Private
const toggleLikeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const userId = req.user._id;
    const isLiked = recipe.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (isLiked) {
      // Unlike
      recipe.likes = recipe.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      // Like
      recipe.likes.push(userId);
    }

    await recipe.save();

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      likesCount: recipe.likes.length
    });
  } catch (error) {
    console.error('[Like Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message
    });
  }
};

// @desc    Save / Unsave recipe (Bookmark)
// @route   POST /api/recipes/:id/save
// @access  Private
const toggleSaveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    const isSaved = recipe.savedBy.some(
      (saveId) => saveId.toString() === userId.toString()
    );

    if (isSaved) {
      // Unsave
      recipe.savedBy = recipe.savedBy.filter(
        (saveId) => saveId.toString() !== userId.toString()
      );
      user.savedRecipes = user.savedRecipes.filter(
        (recId) => recId.toString() !== recipe._id.toString()
      );
    } else {
      // Save
      recipe.savedBy.push(userId);
      if (!user.savedRecipes.some((recId) => recId.toString() === recipe._id.toString())) {
        user.savedRecipes.push(recipe._id);
      }
    }

    await recipe.save();
    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
      savesCount: recipe.savedBy.length
    });
  } catch (error) {
    console.error('[Save Recipe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle save',
      error: error.message
    });
  }
};

// @desc    Get recipes authored by specific user
// @route   GET /api/recipes/author/:authorId
// @access  Public
const getRecipesByAuthor = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.authorId })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar bio');

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes
    });
  } catch (error) {
    console.error('[Author Recipes Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch author recipes',
      error: error.message
    });
  }
};

// @desc    Get recipes saved by currently logged in user
// @route   GET /api/recipes/user/saved
// @access  Private
const getMySavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedRecipes',
      populate: { path: 'author', select: 'name avatar bio' }
    });

    res.status(200).json({
      success: true,
      count: user.savedRecipes ? user.savedRecipes.length : 0,
      recipes: user.savedRecipes || []
    });
  } catch (error) {
    console.error('[My Saved Recipes Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved recipes',
      error: error.message
    });
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
