const Report = require('../models/Report');
const Clothing = require('../models/Clothing');
const User = require('../models/User');

// @desc    Create a report for clothing or user
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    const { clothingId, reportedUserId, reason, description } = req.body;

    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a reason and a description for your report.'
      });
    }

    if (!clothingId && !reportedUserId) {
      return res.status(400).json({
        success: false,
        message: 'A report must reference either a clothing listing or a user.'
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      clothing: clothingId || undefined,
      reportedUser: reportedUserId || undefined,
      reason,
      description: description.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our safety team will review it.',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email isActive')
      .populate({
        path: 'clothing',
        populate: { path: 'owner', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status and admin resolution (Admin only)
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
exports.updateReport = async (req, res, next) => {
  try {
    const { status, adminResponse, actionOnItem, actionOnUser } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (status) report.status = status;
    if (adminResponse !== undefined) report.adminResponse = adminResponse;

    // Optional admin actions
    if (actionOnItem === 'hide' && report.clothing) {
      await Clothing.findByIdAndUpdate(report.clothing, { status: 'Unavailable' });
    }
    if (actionOnUser === 'deactivate' && report.reportedUser) {
      await User.findByIdAndUpdate(report.reportedUser, { isActive: false });
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report status updated successfully',
      report
    });
  } catch (error) {
    next(error);
  }
};
