const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('../models/Recipe');

dotenv.config();

const updates = [
  {
    title: 'Velvety Burrata with Charred Strawberries & Basil Oil',
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Handcrafted Truffle Cacio e Pepe Tagliolini',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Rosewater & Pistachio French Macarons with White Chocolate Ganache',
    image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Pan-Seared Duck Breast with Spiced Cherry Reduction',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
  }
];

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kittyeats';
    await mongoose.connect(mongoUri);

    for (const item of updates) {
      const res = await Recipe.updateOne({ title: item.title }, { $set: { image: item.image } });
      console.log(`Updated: "${item.title}" -> Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
    }

    console.log('Successfully updated all recipe images in MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
