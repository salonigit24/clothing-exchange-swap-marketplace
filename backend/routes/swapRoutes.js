const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  getSentSwaps,
  getReceivedSwaps,
  getSwapById,
  acceptSwap,
  rejectSwap,
  cancelSwap,
  confirmSwap,
  completeSwap,
  getSwapHistory
} = require('../controllers/swapController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createSwapRequest);
router.get('/sent', getSentSwaps);
router.get('/received', getReceivedSwaps);
router.get('/history', getSwapHistory);
router.get('/:id', getSwapById);
router.put('/:id/accept', acceptSwap);
router.put('/:id/reject', rejectSwap);
router.put('/:id/cancel', cancelSwap);
router.put('/:id/confirm', confirmSwap);
router.put('/:id/complete', completeSwap);

module.exports = router;
