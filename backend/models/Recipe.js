const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Recipe description/story is required'],
      trim: true,
      maxlength: [1500, 'Description cannot exceed 1500 characters']
    },
    ingredients: {
      type: [String],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Please provide at least one ingredient'
      }
    },
    steps: {
      type: [String],
      required: [true, 'At least one instruction step is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Please provide at least one step'
      }
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time (in minutes) is required'],
      min: [1, 'Cooking time must be at least 1 minute']
    },
    servings: {
      type: Number,
      default: 2,
      min: [1, 'Servings must be at least 1']
    },
    image: {
      type: String,
      required: [true, 'Recipe photo is required'],
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    category: {
      type: String,
      enum: ['Breakfast', 'Pasta', 'Dessert', 'Dinner', 'Baking', 'Salad', 'Drinks', 'Other','Hostel'],
      default: 'Other'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster text search & sorting
recipeSchema.index({ title: 'text', description: 'text', ingredients: 'text' });
recipeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);
