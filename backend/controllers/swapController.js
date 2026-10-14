const SwapRequest = require('../models/SwapRequest');
const Clothing = require('../models/Clothing');
const Message = require('../models/Message');

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
exports.createSwapRequest = async (req, res, next) => {
  try {
    const { offeredItemId, requestedItemId, message } = req.body;

    if (!offeredItemId || !requestedItemId) {
      return res.status(400).json({
        success: false,
        message: 'Both offered item and requested item are required.'
      });
    }

    if (offeredItemId === requestedItemId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot swap an item with itself.'
      });
    }

    // Fetch both clothing items
    const [offeredItem, requestedItem] = await Promise.all([
      Clothing.findById(offeredItemId),
      Clothing.findById(requestedItemId)
    ]);

    if (!offeredItem) {
      return res.status(404).json({
        success: false,
        message: 'Your offered item could not be found.'
      });
    }

    if (!requestedItem) {
      return res.status(404).json({
        success: false,
        message: 'The requested item could not be found.'
      });
    }

    // Rule: User cannot swap their own clothing
    if (requestedItem.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request a swap for your own clothing item.'
      });
    }

    // Rule: Offered clothing must belong to current user
    if (offeredItem.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only offer items that you own.'
      });
    }

    // Rule: Both items must be Available
    if (offeredItem.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `Your offered item "${offeredItem.title}" is currently ${offeredItem.status}. Only available items can be offered.`
      });
    }

    if (requestedItem.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `The item "${requestedItem.title}" is no longer available for swapping.`
      });
    }

    // Rule: Duplicate active request check
    const existingActiveRequest = await SwapRequest.findOne({
      offeredItem: offeredItemId,
      requestedItem: requestedItemId,
      status: { $in: ['Pending', 'Accepted', 'Negotiating', 'Confirmed'] }
    });

    if (existingActiveRequest) {
      return res.status(400).json({
        success: false,
        message: 'An active swap request already exists for these items.'
      });
    }

    // Create Swap Request
    const swap = await SwapRequest.create({
      requester: req.user._id,
      owner: requestedItem.owner,
      offeredItem: offeredItemId,
      requestedItem: requestedItemId,
      offeredValue: offeredItem.estimatedSwapValue,
      requestedValue: requestedItem.estimatedSwapValue,
      message: (message && message.trim()) || 'Hi! I would love to swap this item with yours.'
    });

    // Automatically create initial message in chat if message text is provided
    if (message && message.trim()) {
      await Message.create({
        swapRequest: swap._id,
        sender: req.user._id,
        receiver: requestedItem.owner,
        message: message.trim()
      });
    }

    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate('offeredItem')
      .populate('requestedItem')
      .populate('requester', 'name email city state profileImage')
      .populate('owner', 'name email city state profileImage');

    res.status(201).json({
      success: true,
      message: 'Swap request sent successfully!',
      swap: populatedSwap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get swap requests sent by logged in user
// @route   GET /api/swaps/sent
// @access  Private
exports.getSentSwaps = async (req, res, next) => {
  try {
    const swaps = await SwapRequest.find({ requester: req.user._id })
      .populate('offeredItem')
      .populate('requestedItem')
      .populate('owner', 'name email phone city state profileImage')
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

// @desc    Get swap requests received by logged in user
// @route   GET /api/swaps/received
// @access  Private
exports.getReceivedSwaps = async (req, res, next) => {
  try {
    const swaps = await SwapRequest.find({ owner: req.user._id })
      .populate('offeredItem')
      .populate('requestedItem')
      .populate('requester', 'name email phone city state profileImage')
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

// @desc    Get single swap request by ID
// @route   GET /api/swaps/:id
// @access  Private (Participant or Admin)
exports.getSwapById = async (req, res, next) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate('offeredItem')
      .populate('requestedItem')
      .populate('requester', 'name email phone city state profileImage')
      .populate('owner', 'name email phone city state profileImage');

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    const isRequester = swap.requester._id.toString() === req.user._id.toString();
    const isOwner = swap.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isRequester && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this swap request.'
      });
    }

    res.status(200).json({
      success: true,
      swap,
      userRole: isRequester ? 'requester' : isOwner ? 'owner' : 'admin'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept swap request (Item owner only)
// @route   PUT /api/swaps/:id/accept
// @access  Private
exports.acceptSwap = async (req, res, next) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate('offeredItem')
      .populate('requestedItem');

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    // Only owner of requested item can accept
    if (swap.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient of this swap request can accept it.'
      });
    }

    if (swap.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a swap request that is already ${swap.status}.`
      });
    }

    swap.status = 'Accepted';
    await swap.save();

    // System announcement message in chat
    await Message.create({
      swapRequest: swap._id,
      sender: req.user._id,
      receiver: swap.requester,
      message: 'I have accepted your swap request! Let\'s coordinate the exchange details here.'
    });

    res.status(200).json({
      success: true,
      message: 'Your swap request has been accepted!',
      swap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject swap request (Item owner only)
// @route   PUT /api/swaps/:id/reject
// @access  Private
exports.rejectSwap = async (req, res, next) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    // Only owner can reject
    if (swap.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient of this swap request can reject it.'
      });
    }

    if (['Confirmed', 'Completed', 'Rejected', 'Cancelled'].includes(swap.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a swap request that is currently ${swap.status}.`
      });
    }

    swap.status = 'Rejected';
    await swap.save();

    res.status(200).json({
      success: true,
      message: 'Swap request rejected.',
      swap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel swap request (Either participant)
// @route   PUT /api/swaps/:id/cancel
// @access  Private
exports.cancelSwap = async (req, res, next) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const isRequester = swap.requester.toString() === req.user._id.toString();
    const isOwner = swap.owner.toString() === req.user._id.toString();

    if (!isRequester && !isOwner && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this swap.'
      });
    }

    if (swap.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed swap.'
      });
    }

    // If it was confirmed, restore clothing availability
    if (swap.status === 'Confirmed') {
      await Clothing.findByIdAndUpdate(swap.offeredItem, { status: 'Available' });
      await Clothing.findByIdAndUpdate(swap.requestedItem, { status: 'Available' });
    }

    swap.status = 'Cancelled';
    await swap.save();

    res.status(200).json({
      success: true,
      message: 'Swap request cancelled successfully.',
      swap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Propose / Confirm final swap agreement (Both must confirm)
// @route   PUT /api/swaps/:id/confirm
// @access  Private
exports.confirmSwap = async (req, res, next) => {
  try {
    const { exchangeMethod } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const isRequester = swap.requester.toString() === req.user._id.toString();
    const isOwner = swap.owner.toString() === req.user._id.toString();

    if (!isRequester && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only participants of this swap can confirm.'
      });
    }

    if (!['Accepted', 'Negotiating', 'Confirmed'].includes(swap.status)) {
      return res.status(400).json({
        success: false,
        message: 'Swap must be accepted before it can be confirmed.'
      });
    }

    if (exchangeMethod) {
      swap.exchangeMethod = exchangeMethod;
    }

    // Update confirmation flag
    if (isRequester) {
      swap.requesterConfirmed = true;
    }
    if (isOwner) {
      swap.ownerConfirmed = true;
    }

    let message = 'You have confirmed the swap terms.';

    // Check if BOTH participants have confirmed
    if (swap.requesterConfirmed && swap.ownerConfirmed) {
      swap.status = 'Confirmed';
      message = 'Both parties have confirmed! Swap is now locked in. Proceed with exchange.';

      // Lock both items to Swap Pending / Unavailable so they cannot be taken by others
      await Clothing.findByIdAndUpdate(swap.offeredItem, { status: 'Swap Pending' });
      await Clothing.findByIdAndUpdate(swap.requestedItem, { status: 'Swap Pending' });

      // Post confirmation note to chat
      await Message.create({
        swapRequest: swap._id,
        sender: req.user._id,
        receiver: isRequester ? swap.owner : swap.requester,
        message: `🎉 Agreement confirmed by both sides! Exchange method chosen: ${swap.exchangeMethod || 'Local Exchange'}.`
      });
    } else {
      swap.status = 'Negotiating';
      message = 'Confirmation recorded. Awaiting the other member\'s confirmation.';
    }

    await swap.save();

    const updatedSwap = await SwapRequest.findById(swap._id)
      .populate('offeredItem')
      .populate('requestedItem')
      .populate('requester', 'name email phone city state profileImage')
      .populate('owner', 'name email phone city state profileImage');

    res.status(200).json({
      success: true,
      message,
      swap: updatedSwap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark swap as completed
// @route   PUT /api/swaps/:id/complete
// @access  Private
exports.completeSwap = async (req, res, next) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }

    const isRequester = swap.requester.toString() === req.user._id.toString();
    const isOwner = swap.owner.toString() === req.user._id.toString();

    if (!isRequester && !isOwner && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only participants can mark this swap as completed.'
      });
    }

    if (swap.status !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed swaps can be marked as completed.'
      });
    }

    // Mark completion flag
    if (isRequester) swap.requesterCompleted = true;
    if (isOwner) swap.ownerCompleted = true;

    // When either or both mark completed: move swap status to Completed and items to Swapped!
    swap.status = 'Completed';
    await swap.save();

    // Crucial business rule: Move both clothing items to "Swapped" status!
    await Clothing.findByIdAndUpdate(swap.offeredItem, { status: 'Swapped' });
    await Clothing.findByIdAndUpdate(swap.requestedItem, { status: 'Swapped' });

    // Cancel any other pending requests involving either of these items
    await SwapRequest.updateMany(
      {
        _id: { $ne: swap._id },
        $or: [
          { offeredItem: swap.offeredItem },
          { requestedItem: swap.offeredItem },
          { offeredItem: swap.requestedItem },
          { requestedItem: swap.requestedItem }
        ],
        status: { $in: ['Pending', 'Negotiating'] }
      },
      { status: 'Cancelled' }
    );

    const updatedSwap = await SwapRequest.findById(swap._id)
      .populate('offeredItem')
      .populate('requestedItem')
      .populate('requester', 'name email phone city state profileImage')
      .populate('owner', 'name email phone city state profileImage');

    res.status(200).json({
      success: true,
      message: 'Swap marked as completed! Both items are now marked as Swapped.',
      swap: updatedSwap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's swap history (categorized)
// @route   GET /api/swaps/history
// @access  Private
exports.getSwapHistory = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {
      $or: [{ requester: req.user._id }, { owner: req.user._id }]
    };

    if (status) {
      if (status === 'active') {
        filter.status = { $in: ['Pending', 'Accepted', 'Negotiating', 'Confirmed'] };
      } else if (status === 'completed') {
        filter.status = 'Completed';
      } else if (status === 'rejected') {
        filter.status = { $in: ['Rejected', 'Cancelled'] };
      }
    }

    const history = await SwapRequest.find(filter)
      .populate('offeredItem')
      .populate('requestedItem')
      .populate('requester', 'name email phone city state profileImage')
      .populate('owner', 'name email phone city state profileImage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};
