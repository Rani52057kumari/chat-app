/**
 * Message Controller
 * Handles sending, receiving, and managing messages
 */

const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

/**
 * @desc    Send message
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID is required'
      });
    }

    if (!content && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide message content or file'
      });
    }

    // Prepare message data
    let messageData = {
      sender: req.user._id,
      chat: chatId
    };

    // Handle text content
    if (content) {
      messageData.content = content;
    }

    // Handle file upload
    if (req.file) {
      messageData.fileUrl = `/uploads/${req.file.filename}`;
      messageData.fileName = req.file.originalname;
      
      // Determine file type
      const fileExt = req.file.mimetype;
      if (fileExt.startsWith('image/')) {
        messageData.fileType = 'image';
      } else if (fileExt === 'application/pdf') {
        messageData.fileType = 'pdf';
      }
    }

    // Create message
    let message = await Message.create(messageData);

    // Populate message
    message = await message.populate('sender', 'name avatar email');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name avatar email'
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending message'
    });
  }
};

/**
 * @desc    Get all messages for a chat
 * @route   GET /api/messages/:chatId
 * @access  Private
 */
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar email')
      .populate('chat')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching messages'
    });
  }
};

/**
 * @desc    Mark message as read
 * @route   PUT /api/messages/read/:messageId
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user already read the message
    const alreadyRead = message.readBy.some(
      read => read.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: req.user._id,
        readAt: Date.now()
      });
      await message.save();
    }

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking message as read'
    });
  }
};

/**
 * @desc    Mark all messages in chat as read
 * @route   PUT /api/messages/read/chat/:chatId
 * @access  Private
 */
const markChatAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      chat: chatId,
      sender: { $ne: req.user._id }
    });

    // Mark all messages as read
    for (let message of messages) {
      const alreadyRead = message.readBy.some(
        read => read.user.toString() === req.user._id.toString()
      );

      if (!alreadyRead) {
        message.readBy.push({
          user: req.user._id,
          readAt: Date.now()
        });
        await message.save();
      }
    }

    res.json({
      success: true,
      message: 'All messages marked as read'
    });
  } catch (error) {
    console.error('Mark chat as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking chat as read'
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  markChatAsRead
};
