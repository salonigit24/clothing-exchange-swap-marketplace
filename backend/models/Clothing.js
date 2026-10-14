const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a clothing title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'T-Shirts',
        'Shirts',
        'Jeans',
        'Trousers',
        'Dresses',
        'Jackets',
        'Hoodies',
        'Skirts',
        'Sarees',
        'Kurtis',
        'Ethnic Wear',
        'Shoes',
        'Accessories',
        'Other'
      ]
    },
    type: {
      type: String,
      default: 'Casual',
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Please specify the brand'],
      trim: true
    },
    size: {
      type: String,
      required: [true, 'Please specify the size'],
      trim: true
    },
    gender: {
      type: String,
      required: [true, 'Please specify target gender'],
      enum: ['Men', 'Women', 'Unisex', 'Kids'],
      default: 'Unisex'
    },
    color: {
      type: String,
      required: [true, 'Please specify the color'],
      trim: true
    },
    condition: {
      type: String,
      required: [true, 'Please specify the item condition'],
      enum: ['Like New', 'Excellent', 'Good', 'Fair']
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [1500, 'Description cannot exceed 1500 characters']
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please provide estimated original price in INR'],
      min: [0, 'Original price cannot be negative']
    },
    estimatedSwapValue: {
      type: Number,
      required: [true, 'Please specify estimated swap value'],
      min: [0, 'Swap value cannot be negative']
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one clothing image'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one image is required'
      }
    },
    city: {
      type: String,
      required: [true, 'Please specify city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please specify state'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Available', 'Swap Pending', 'Swapped', 'Unavailable'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

// Indexing for search performance
clothingSchema.index({ title: 'text', brand: 'text', category: 'text', description: 'text' });
clothingSchema.index({ city: 1, state: 1, status: 1 });

module.exports = mongoose.model('Clothing', clothingSchema);
