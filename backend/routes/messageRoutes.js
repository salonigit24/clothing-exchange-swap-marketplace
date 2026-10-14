const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:swapId', getMessages);
router.post('/:swapId', sendMessage);

module.exports = router;
