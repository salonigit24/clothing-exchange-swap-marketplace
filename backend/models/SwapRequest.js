const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clothing',
      required: true
    },
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clothing',
      required: true
    },
    offeredValue: {
      type: Number,
      required: true
    },
    requestedValue: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Initial message cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Rejected',
        'Cancelled',
        'Negotiating',
        'Confirmed',
        'Completed'
      ],
      default: 'Pending'
    },
    exchangeMethod: {
      type: String,
      enum: ['Local Exchange', 'Courier/Shipping', 'Undecided'],
      default: 'Undecided'
    },
    requesterConfirmed: {
      type: Boolean,
      default: false
    },
    ownerConfirmed: {
      type: Boolean,
      default: false
    },
    requesterCompleted: {
      type: Boolean,
      default: false
    },
    ownerCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index to help query active swaps between users/items
swapRequestSchema.index({ requester: 1, owner: 1, status: 1 });
swapRequestSchema.index({ offeredItem: 1, requestedItem: 1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
