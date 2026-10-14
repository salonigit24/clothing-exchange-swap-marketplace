const express = require('express');
const router = express.Router();
const {
  saveItem,
  removeSavedItem,
  getSavedItems
} = require('../controllers/savedController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSavedItems);
router.post('/:clothingId', saveItem);
router.delete('/:clothingId', removeSavedItem);

module.exports = router;
