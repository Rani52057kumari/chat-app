/**
 * Chat Routes
 * Handles chat-related endpoints
 */

const express = require('express');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRequest,
  createChatSchema,
  createGroupChatSchema,
  updateGroupSchema,
  groupUserSchema
} = require('../middleware/validationMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Chat routes
router.get('/', fetchChats);
router.post('/', validateRequest(createChatSchema), accessChat);

router.post('/group', validateRequest(createGroupChatSchema), createGroupChat);
router.put('/group/rename', validateRequest(updateGroupSchema), renameGroup);
router.put('/group/add', validateRequest(groupUserSchema), addToGroup);
router.put('/group/remove', validateRequest(groupUserSchema), removeFromGroup);

module.exports = router;
