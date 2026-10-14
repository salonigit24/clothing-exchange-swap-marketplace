const User = require('../models/User');
const Clothing = require('../models/Clothing');
const SwapRequest = require('../models/SwapRequest');
const SavedItem = require('../models/SavedItem');

// @desc    Get user profile with statistics
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Calculate user dashboard stats
    const listedCount = await Clothing.countDocuments({ owner: req.user._id });
    const availableCount = await Clothing.countDocuments({ owner: req.user._id, status: 'Available' });

    const pendingRequestsCount = await SwapRequest.countDocuments({
      $or: [
        { owner: req.user._id, status: 'Pending' },
        { requester: req.user._id, status: 'Pending' }
      ]
    });

    const acceptedSwapsCount = await SwapRequest.countDocuments({
      $or: [{ owner: req.user._id }, { requester: req.user._id }],
      status: { $in: ['Accepted', 'Negotiating', 'Confirmed'] }
    });

    const completedSwapsCount = await SwapRequest.countDocuments({
      $or: [{ owner: req.user._id }, { requester: req.user._id }],
      status: 'Completed'
    });

    const savedItemsCount = await SavedItem.countDocuments({ user: req.user._id });

    // Recent activity - last 5 swap actions
    const recentSwaps = await SwapRequest.find({
      $or: [{ owner: req.user._id }, { requester: req.user._id }]
    })
      .populate('offeredItem', 'title images estimatedSwapValue')
      .populate('requestedItem', 'title images estimatedSwapValue')
      .populate('requester', 'name city state')
      .populate('owner', 'name city state')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      user,
      stats: {
        listedCount,
        availableCount,
        pendingRequestsCount,
        acceptedSwapsCount,
        completedSwapsCount,
        savedItemsCount
      },
      recentSwaps
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, state, profileImage } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name.trim();
    if (phone) fieldsToUpdate.phone = phone.trim();
    if (city) fieldsToUpdate.city = city.trim();
    if (state) fieldsToUpdate.state = state.trim();
    if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
