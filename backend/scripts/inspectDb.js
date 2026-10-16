const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

dotenv.config();

const inspect = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kittyeats';
    await mongoose.connect(mongoUri);

    console.log('\n==========================================');
    console.log(`Connected to Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    console.log('==========================================\n');

    const userCount = await User.countDocuments();
    const recipeCount = await Recipe.countDocuments();

    console.log(`Total Users in DB:    ${userCount}`);
    console.log(`Total Recipes in DB:  ${recipeCount}\n`);

    console.log('--- USERS IN DATABASE ---');
    const users = await User.find().select('name email createdAt');
    users.forEach((u, i) => {
      console.log(`${i + 1}. [${u.name}] - Email: ${u.email} (ID: ${u._id})`);
    });

    console.log('\n--- RECIPES IN DATABASE ---');
    const recipes = await Recipe.find().populate('author', 'name').select('title category cookingTime likes savedBy author');
    recipes.forEach((r, i) => {
      console.log(
        `${i + 1}. "${r.title}" | Category: ${r.category} | Time: ${r.cookingTime}m | Likes: ${r.likes.length} | Saves: ${r.savedBy.length} | Author: ${r.author?.name || 'Unknown'}`
      );
    });

    console.log('\n==========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Inspection error:', err.message);
    process.exit(1);
  }
};

inspect();
