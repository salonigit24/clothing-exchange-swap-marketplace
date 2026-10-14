const Message = require('../models/Message');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get all chat messages for a specific swap request
// @route   GET /api/messages/:swapId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { swapId } = req.params;

    const swap = await SwapRequest.findById(swapId);
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Access control: Only participants or Admin can view messages
    const isRequester = swap.requester.toString() === req.user._id.toString();
    const isOwner = swap.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isRequester && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view messages for this swap.'
      });
    }

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      { swapRequest: swapId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    const messages = await Message.find({ swapRequest: swapId })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in swap negotiation chat
// @route   POST /api/messages/:swapId
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { swapId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      });
    }

    const swap = await SwapRequest.findById(swapId);
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    const isRequester = swap.requester.toString() === req.user._id.toString();
    const isOwner = swap.owner.toString() === req.user._id.toString();

    if (!isRequester && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only swap participants can send messages.'
      });
    }

    // Recipient is the other user
    const receiverId = isRequester ? swap.owner : swap.requester;

    const newMessage = await Message.create({
      swapRequest: swapId,
      sender: req.user._id,
      receiver: receiverId,
      message: message.trim()
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    // If Socket.IO is attached to the app, emit event to the swap room
    const io = req.app.get('io');
    if (io) {
      io.to(swapId.toString()).emit('receive_message', populatedMessage);
    }

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};
