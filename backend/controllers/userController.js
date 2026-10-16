const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get user public profile + authored recipes
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const recipes = await Recipe.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar bio');

    // Calculate total likes received across all recipes
    const totalLikes = recipes.reduce(
      (acc, r) => acc + (r.likes ? r.likes.length : 0),
      0
    );

    res.status(200).json({
      success: true,
      user,
      recipes,
      stats: {
        recipesCount: recipes.length,
        totalLikes
      }
    });
  } catch (error) {
    console.error('[Get User Profile Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

// @desc    Update current user profile (name, bio, avatar)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, bio, avatar } = req.body;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        savedRecipes: updatedUser.savedRecipes
      }
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile
};
