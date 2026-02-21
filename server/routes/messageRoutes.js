/**
 * Message Routes
 * Handles message-related endpoints
 */

const express = require('express');
const {
  sendMessage,
  getMessages,
  markAsRead,
  markChatAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { messageLimiter, uploadLimiter } = require('../middleware/securityMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Message routes
router.post(
  '/',
  messageLimiter,
  uploadLimiter,
  upload.single('file'),
  sendMessage
);

router.get('/:chatId', getMessages);
router.put('/read/:messageId', markAsRead);
router.put('/read/chat/:chatId', markChatAsRead);

module.exports = router;
