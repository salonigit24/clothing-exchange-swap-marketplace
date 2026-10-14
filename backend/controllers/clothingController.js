const Clothing = require('../models/Clothing');
const SwapRequest = require('../models/SwapRequest');
const SavedItem = require('../models/SavedItem');
const { calculateEstimatedSwapValue } = require('../utils/swapCalculator');

// @desc    Get all available clothes with search, filters, location matching & sorting
// @route   GET /api/clothing
// @access  Public (Optional auth for nearby matching)
exports.getClothes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      size,
      gender,
      condition,
      minPrice,
      maxPrice,
      city,
      state,
      nearMe,
      sort,
      page = 1,
      limit = 24
    } = req.query;

    const query = { status: 'Available' };

    // Search by title, brand, category, description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Brand filter
    if (brand && brand !== 'All') {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    // Size filter
    if (size && size !== 'All') {
      query.size = size;
    }

    // Gender filter
    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Location filter (explicit)
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }
    if (state && state !== 'All') {
      query.state = new RegExp(`^${state.trim()}$`, 'i');
    }

    // "Near Me" filter based on authenticated user's city
    if (nearMe === 'true' && req.user && req.user.city) {
      query.city = new RegExp(`^${req.user.city.trim()}$`, 'i');
    }

    // Swap value range filter
    if (minPrice || maxPrice) {
      query.estimatedSwapValue = {};
      if (minPrice) query.estimatedSwapValue.$gte = Number(minPrice);
      if (maxPrice) query.estimatedSwapValue.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'price-low') {
      sortOption = { estimatedSwapValue: 1 };
    } else if (sort === 'price-high') {
      sortOption = { estimatedSwapValue: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Clothing.countDocuments(query);
    const rawClothes = await Clothing.find(query)
      .populate('owner', 'name city state profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Annotate items with isNearby flag based on logged in user's city/state
    const userCity = req.user ? req.user.city.toLowerCase() : null;
    const userState = req.user ? req.user.state.toLowerCase() : null;

    const clothes = rawClothes.map((item) => {
      const itemObj = item.toObject();
      itemObj.isNearby = Boolean(
        userCity &&
        itemObj.city &&
        (itemObj.city.toLowerCase() === userCity ||
         (userState && itemObj.state && itemObj.state.toLowerCase() === userState))
      );
      return itemObj;
    });

    res.status(200).json({
      success: true,
      count: clothes.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      clothes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single clothing item by ID
// @route   GET /api/clothing/:id
// @access  Public (Optional auth)
exports.getClothingById = async (req, res, next) => {
  try {
    const clothing = await Clothing.findById(req.params.id).populate(
      'owner',
      'name email phone city state profileImage createdAt'
    );

    if (!clothing) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found'
      });
    }

    const itemObj = clothing.toObject();

    // Check if current user is owner
    if (req.user) {
      itemObj.isOwner = req.user._id.toString() === clothing.owner._id.toString();

      // Check if saved
      const saved = await SavedItem.findOne({
        user: req.user._id,
        clothing: clothing._id
      });
      itemObj.isSaved = Boolean(saved);

      // Check nearby
      itemObj.isNearby = Boolean(
        req.user.city &&
        clothing.city &&
        (clothing.city.toLowerCase() === req.user.city.toLowerCase() ||
         clothing.state.toLowerCase() === req.user.state.toLowerCase())
      );
    } else {
      itemObj.isOwner = false;
      itemObj.isSaved = false;
      itemObj.isNearby = false;
    }

    res.status(200).json({
      success: true,
      clothing: itemObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new clothing listing
// @route   POST /api/clothing
// @access  Private
exports.createClothing = async (req, res, next) => {
  try {
    const {
      title,
      category,
      type,
      brand,
      size,
      gender,
      color,
      condition,
      description,
      originalPrice,
      estimatedSwapValue,
      city,
      state
    } = req.body;

    // Handle images: either uploaded via Multer or passed as URLs
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        images = req.body.images;
      } else if (typeof req.body.images === 'string') {
        images = [req.body.images];
      }
    }

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one clothing photo.'
      });
    }

    // Rule-based swap value calculation fallback if user didn't specify or want suggested value
    const origPriceNum = parseFloat(originalPrice) || 0;
    let finalEstimatedValue = parseFloat(estimatedSwapValue);
    if (!finalEstimatedValue || isNaN(finalEstimatedValue) || finalEstimatedValue <= 0) {
      finalEstimatedValue = calculateEstimatedSwapValue(origPriceNum, condition, brand, category);
    }

    const clothing = await Clothing.create({
      owner: req.user._id,
      title: title.trim(),
      category,
      type: type ? type.trim() : 'Casual',
      brand: brand.trim(),
      size: size.trim(),
      gender: gender || 'Unisex',
      color: color.trim(),
      condition,
      description: description.trim(),
      originalPrice: origPriceNum,
      estimatedSwapValue: finalEstimatedValue,
      images,
      city: (city && city.trim()) || req.user.city,
      state: (state && state.trim()) || req.user.state,
      status: 'Available'
    });

    res.status(201).json({
      success: true,
      message: 'Clothing item listed successfully!',
      clothing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update clothing listing
// @route   PUT /api/clothing/:id
// @access  Private (Owner only)
exports.updateClothing = async (req, res, next) => {
  try {
    let clothing = await Clothing.findById(req.params.id);

    if (!clothing) {
      return res.status(404).json({
        success: false,
        message: 'Clothing listing not found'
      });
    }

    // Check ownership
    if (clothing.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing'
      });
    }

    // Business rule: Cannot edit clothing involved in a confirmed or completed swap
    if (clothing.status === 'Swapped') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit an item that has already been swapped.'
      });
    }

    const activeSwap = await SwapRequest.findOne({
      $or: [{ offeredItem: clothing._id }, { requestedItem: clothing._id }],
      status: { $in: ['Confirmed', 'Completed'] }
    });

    if (activeSwap) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit an item currently locked in a confirmed swap.'
      });
    }

    // Handle image updates if new files provided
    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      // append or replace
      if (req.body.appendImages === 'true') {
        updateData.images = [...clothing.images, ...newImages];
      } else {
        updateData.images = newImages;
      }
    }

    // Recalculate swap value if original price or condition changed and value wasn't explicitly changed
    if (updateData.originalPrice && updateData.condition && !updateData.estimatedSwapValue) {
      updateData.estimatedSwapValue = calculateEstimatedSwapValue(
        updateData.originalPrice,
        updateData.condition,
        updateData.brand || clothing.brand,
        updateData.category || clothing.category
      );
    }

    clothing = await Clothing.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Clothing listing updated successfully',
      clothing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete clothing listing
// @route   DELETE /api/clothing/:id
// @access  Private (Owner or Admin)
exports.deleteClothing = async (req, res, next) => {
  try {
    const clothing = await Clothing.findById(req.params.id);

    if (!clothing) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found'
      });
    }

    // Check ownership
    if (clothing.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing'
      });
    }

    // Business rule: Prevent deletion if involved in finalized or confirmed swap
    if (clothing.status === 'Swapped') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an item that has already been swapped.'
      });
    }

    const lockedSwap = await SwapRequest.findOne({
      $or: [{ offeredItem: clothing._id }, { requestedItem: clothing._id }],
      status: { $in: ['Confirmed'] }
    });

    if (lockedSwap) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an item currently locked in an active confirmed swap.'
      });
    }

    // Remove any saved item references and pending swap requests
    await SavedItem.deleteMany({ clothing: clothing._id });
    await SwapRequest.updateMany(
      {
        $or: [{ offeredItem: clothing._id }, { requestedItem: clothing._id }],
        status: { $in: ['Pending', 'Negotiating'] }
      },
      { status: 'Cancelled' }
    );

    await clothing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Clothing listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings belonging to logged-in user
// @route   GET /api/clothing/my-listings
// @access  Private
exports.getMyListings = async (req, res, next) => {
  try {
    const clothes = await Clothing.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clothes.length,
      clothes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle availability (Available <-> Unavailable)
// @route   PUT /api/clothing/:id/toggle-status
// @access  Private (Owner only)
exports.toggleAvailability = async (req, res, next) => {
  try {
    const clothing = await Clothing.findById(req.params.id);

    if (!clothing) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found'
      });
    }

    if (clothing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change status of this item'
      });
    }

    if (clothing.status === 'Swapped' || clothing.status === 'Swap Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot manually change status while item is in ${clothing.status} status`
      });
    }

    clothing.status = clothing.status === 'Available' ? 'Unavailable' : 'Available';
    await clothing.save();

    res.status(200).json({
      success: true,
      message: `Item marked as ${clothing.status}`,
      clothing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate swap value helper endpoint
// @route   POST /api/clothing/calculate-value
// @access  Public
exports.calculateValue = (req, res) => {
  const { originalPrice, condition, brand, category } = req.body;
  const estimatedSwapValue = calculateEstimatedSwapValue(
    originalPrice,
    condition,
    brand,
    category
  );
  res.status(200).json({
    success: true,
    estimatedSwapValue,
    disclaimer: 'Swap values are estimates and are intended only to help users compare items.'
  });
};
