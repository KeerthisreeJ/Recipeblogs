const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLikeRecipe,
  toggleSaveRecipe,
  getRecipesByAuthor,
  getMySavedRecipes
} = require('../controllers/recipeController');
const { protect, optionalAuth } = require('../middleware/auth');
const { upload, handleImageUpload } = require('../middleware/upload');

// Base recipe routes
router
  .route('/')
  .get(optionalAuth, getRecipes)
  .post(protect, upload.single('image'), handleImageUpload, createRecipe);

// Saved recipes for current authenticated user
router.get('/user/saved', protect, getMySavedRecipes);

// Recipes by specific author
router.get('/author/:authorId', getRecipesByAuthor);

// Single recipe operations
router
  .route('/:id')
  .get(optionalAuth, getRecipeById)
  .put(protect, upload.single('image'), handleImageUpload, updateRecipe)
  .delete(protect, deleteRecipe);

// Like & Save interactions
router.post('/:id/like', protect, toggleLikeRecipe);
router.post('/:id/save', protect, toggleSaveRecipe);

module.exports = router;
