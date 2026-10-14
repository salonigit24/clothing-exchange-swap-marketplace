const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    clothing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clothing'
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for the report'],
      enum: [
        'Fake listing',
        'Inappropriate content',
        'Wrong information',
        'Damaged item',
        'Spam',
        'Other'
      ]
    },
    description: {
      type: String,
      required: [true, 'Please provide details explaining the report'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewing', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    adminResponse: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
