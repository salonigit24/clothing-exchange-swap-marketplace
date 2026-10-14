const SavedItem = require('../models/SavedItem');
const Clothing = require('../models/Clothing');

// @desc    Save/favorite a clothing item
// @route   POST /api/saved/:clothingId
// @access  Private
exports.saveItem = async (req, res, next) => {
  try {
    const { clothingId } = req.params;

    const clothing = await Clothing.findById(clothingId);
    if (!clothing) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found'
      });
    }

    // Check if already saved
    const existing = await SavedItem.findOne({
      user: req.user._id,
      clothing: clothingId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Item is already in your saved list'
      });
    }

    const saved = await SavedItem.create({
      user: req.user._id,
      clothing: clothingId
    });

    res.status(201).json({
      success: true,
      message: 'Item saved to your favorites!',
      saved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from saved list
// @route   DELETE /api/saved/:clothingId
// @access  Private
exports.removeSavedItem = async (req, res, next) => {
  try {
    const { clothingId } = req.params;

    const result = await SavedItem.findOneAndDelete({
      user: req.user._id,
      clothing: clothingId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Item was not found in your saved list'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from saved list'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved items for the logged-in user
// @route   GET /api/saved
// @access  Private
exports.getSavedItems = async (req, res, next) => {
  try {
    const saved = await SavedItem.find({ user: req.user._id })
      .populate({
        path: 'clothing',
        populate: {
          path: 'owner',
          select: 'name city state profileImage'
        }
      })
      .sort({ createdAt: -1 });

    // Filter out any dangling items if a clothing item was hard-deleted
    const validSaved = saved.filter((item) => item.clothing !== null);

    res.status(200).json({
      success: true,
      count: validSaved.length,
      saved: validSaved
    });
  } catch (error) {
    next(error);
  }
};
