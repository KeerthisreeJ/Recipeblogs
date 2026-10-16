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

router.route('/')
  .get(optionalAuth, getRecipes)
  .post(protect, upload.single('image'), handleImageUpload, createRecipe);

router.get('/user/saved', protect, getMySavedRecipes);
router.get('/author/:authorId', getRecipesByAuthor);

router.route('/:id')
  .get(optionalAuth, getRecipeById)
  .put(protect, upload.single('image'), handleImageUpload, updateRecipe)
  .delete(protect, deleteRecipe);

router.post('/:id/like', protect, toggleLikeRecipe);
router.post('/:id/save', protect, toggleSaveRecipe);

module.exports = router;
