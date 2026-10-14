const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  deleteUser,
  getAllClothing,
  updateClothingStatus,
  getAllSwaps
} = require('../controllers/adminController');
const { getReports, updateReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/auth');

// All admin routes require authentication and Admin role
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Clothing
router.get('/clothing', getAllClothing);
router.put('/clothing/:id/status', updateClothingStatus);

// Swaps
router.get('/swaps', getAllSwaps);

// Reports
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);

module.exports = router;
