const express = require('express');
const router = express.Router();
const {
  getClothes,
  getClothingById,
  createClothing,
  updateClothing,
  deleteClothing,
  getMyListings,
  toggleAvailability,
  calculateValue
} = require('../controllers/clothingController');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', optionalAuth, getClothes);
router.post('/calculate-value', calculateValue);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', optionalAuth, getClothingById);

router.post('/', protect, upload.array('images', 5), createClothing);
router.put('/:id', protect, upload.array('images', 5), updateClothing);
router.delete('/:id', protect, deleteClothing);
router.put('/:id/toggle-status', protect, toggleAvailability);

module.exports = router;
