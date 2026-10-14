const User = require('../models/User');
const Clothing = require('../models/Clothing');
const SwapRequest = require('../models/SwapRequest');
const Report = require('../models/Report');

// @desc    Get Admin Dashboard Overview Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalListings = await Clothing.countDocuments();
    const activeListings = await Clothing.countDocuments({ status: 'Available' });
    const swappedListings = await Clothing.countDocuments({ status: 'Swapped' });
    const totalSwaps = await SwapRequest.countDocuments();
    const successfulSwaps = await SwapRequest.countDocuments({ status: 'Completed' });
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    // Category distribution for sustainable analytics
    const categoryStats = await Clothing.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Swap status distribution
    const swapStatusStats = await SwapRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent 5 users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 swaps
    const recentSwaps = await SwapRequest.find()
      .populate('requester', 'name email')
      .populate('owner', 'name email')
      .populate('offeredItem', 'title estimatedSwapValue')
      .populate('requestedItem', 'title estimatedSwapValue')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalListings,
        activeListings,
        swappedListings,
        totalSwaps,
        successfulSwaps,
        pendingReports
      },
      categoryStats,
      swapStatusStats,
      recentUsers,
      recentSwaps
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (with search and status filters)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ name: reg }, { email: reg }, { city: reg }, { phone: reg }];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status && status !== 'All') {
      query.isActive = status === 'active';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/disabled status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from disabling themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot disable your own administrator account.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own administrator account.'
      });
    }

    // Remove user's listings and pending swaps
    await Clothing.deleteMany({ owner: user._id });
    await SwapRequest.deleteMany({
      $or: [{ requester: user._id }, { owner: user._id }],
      status: { $in: ['Pending', 'Negotiating'] }
    });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User account and associated items removed.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all listings for admin management
// @route   GET /api/admin/clothing
// @access  Private/Admin
exports.getAllClothing = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ title: reg }, { brand: reg }, { city: reg }];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const clothes = await Clothing.find(query)
      .populate('owner', 'name email city state')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clothes.length,
      clothes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing status (e.g. mark unavailable / remove inappropriate listing)
// @route   PUT /api/admin/clothing/:id/status
// @access  Private/Admin
exports.updateClothingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const clothing = await Clothing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!clothing) {
      return res.status(404).json({ success: false, message: 'Clothing item not found' });
    }

    res.status(200).json({
      success: true,
      message: `Listing status updated to ${status}`,
      clothing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin monitor all swap requests
// @route   GET /api/admin/swaps
// @access  Private/Admin
exports.getAllSwaps = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('requester', 'name email city state')
      .populate('owner', 'name email city state')
      .populate('offeredItem', 'title brand estimatedSwapValue images')
      .populate('requestedItem', 'title brand estimatedSwapValue images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: swaps.length,
      swaps
    });
  } catch (error) {
    next(error);
  }
};
