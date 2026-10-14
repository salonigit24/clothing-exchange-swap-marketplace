const mongoose = require('mongoose');

const savedItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clothing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clothing',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate saved entries for the same user and clothing item
savedItemSchema.index({ user: 1, clothing: 1 }, { unique: true });

module.exports = mongoose.model('SavedItem', savedItemSchema);
