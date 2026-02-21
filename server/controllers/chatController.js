/**
 * Chat Controller
 * Handles chat creation and management for one-to-one and group chats
 */

const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');

/**
 * @desc    Access or create one-to-one chat
 * @route   POST /api/chats
 * @access  Private
 */
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'UserId parameter is required'
      });
    }

    // Check if chat already exists
    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } }
      ]
    })
      .populate('users', '-password')
      .populate('latestMessage');

    // Populate sender in latest message
    chat = await User.populate(chat, {
      path: 'latestMessage.sender',
      select: 'name avatar email'
    });

    if (chat.length > 0) {
      res.json({
        success: true,
        data: chat[0]
      });
    } else {
      // Create new chat
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId]
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate('users', '-password');

      res.status(201).json({
        success: true,
        data: fullChat
      });
    }
  } catch (error) {
    console.error('Access chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accessing chat'
    });
  }
};

/**
 * @desc    Get all chats for logged in user
 * @route   GET /api/chats
 * @access  Private
 */
const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } }
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    // Populate sender in latest message
    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name avatar email'
    });

    res.json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    console.error('Fetch chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching chats'
    });
  }
};

/**
 * @desc    Create group chat
 * @route   POST /api/chats/group
 * @access  Private
 */
const createGroupChat = async (req, res) => {
  try {
    const { users, name } = req.body;

    if (!users || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide group name and users'
      });
    }

    // Parse users if it's a string
    let usersArray = typeof users === 'string' ? JSON.parse(users) : users;

    if (usersArray.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'More than 2 users are required to form a group chat'
      });
    }

    // Add current user to the group
    usersArray.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: name,
      users: usersArray,
      isGroupChat: true,
      groupAdmin: req.user._id
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json({
      success: true,
      message: 'Group chat created successfully',
      data: fullGroupChat
    });
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating group chat'
    });
  }
};

/**
 * @desc    Rename group chat
 * @route   PUT /api/chats/group/rename
 * @access  Private
 */
const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide chat ID and new name'
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      message: 'Group renamed successfully',
      data: updatedChat
    });
  } catch (error) {
    console.error('Rename group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error renaming group'
    });
  }
};

/**
 * @desc    Add user to group
 * @route   PUT /api/chats/group/add
 * @access  Private
 */
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide chat ID and user ID'
      });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      message: 'User added to group successfully',
      data: added
    });
  } catch (error) {
    console.error('Add to group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding user to group'
    });
  }
};

/**
 * @desc    Remove user from group
 * @route   PUT /api/chats/group/remove
 * @access  Private
 */
const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide chat ID and user ID'
      });
    }

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      message: 'User removed from group successfully',
      data: removed
    });
  } catch (error) {
    console.error('Remove from group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing user from group'
    });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
};
