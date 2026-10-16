const User = require('../models/User');
const Recipe = require('../models/Recipe');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const recipes = await Recipe.find({ author: user._id }).sort({ createdAt: -1 });
    const totalLikes = recipes.reduce((sum, r) => sum + r.likes.length, 0);

    res.json({
      success: true,
      user,
      recipes,
      stats: { recipesCount: recipes.length, totalLikes }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, bio, avatar } = req.body;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUserProfile, updateProfile };
