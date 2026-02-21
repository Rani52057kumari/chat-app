/**
 * Socket.IO Configuration
 * Handles real-time communication features
 */

const User = require('../models/User');

/**
 * Initialize Socket.IO with the server
 * @param {Object} io - Socket.IO instance
 */
const initializeSocket = (io) => {
  // Store connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`✅ New socket connection: ${socket.id}`);

    /**
     * User setup - Join user to their room
     */
    socket.on('setup', async (userId) => {
      try {
        socket.join(userId);
        connectedUsers.set(userId, socket.id);
        
        // Update user online status
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          socketId: socket.id,
          lastSeen: Date.now()
        });

        socket.emit('connected');
        
        // Broadcast online status to all users
        socket.broadcast.emit('user-online', userId);
        
        console.log(`User ${userId} connected`);
      } catch (error) {
        console.error('Setup error:', error);
      }
    });

    /**
     * Join chat room
     */
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    /**
     * Leave chat room
     */
    socket.on('leave-chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User left chat: ${chatId}`);
    });

    /**
     * Send new message
     */
    socket.on('new-message', (message) => {
      const chat = message.chat;

      if (!chat.users) {
        return console.log('Chat.users not defined');
      }

      // Send message to all users in the chat except sender
      chat.users.forEach((user) => {
        if (user._id === message.sender._id) return;
        
        socket.in(user._id).emit('message-received', message);
      });
    });

    /**
     * Typing indicator
     */
    socket.on('typing', (data) => {
      const { chatId, userId } = data;
      socket.in(chatId).emit('typing', { chatId, userId });
    });

    socket.on('stop-typing', (data) => {
      const { chatId, userId } = data;
      socket.in(chatId).emit('stop-typing', { chatId, userId });
    });

    /**
     * Message read receipt
     */
    socket.on('message-read', (data) => {
      const { messageId, chatId, userId } = data;
      socket.in(chatId).emit('message-read-update', { messageId, userId });
    });

    /**
     * Video call signals
     */
    socket.on('call-user', (data) => {
      const { to, signalData, from, name } = data;
      io.to(to).emit('call-incoming', { signal: signalData, from, name });
    });

    socket.on('answer-call', (data) => {
      io.to(data.to).emit('call-accepted', data.signal);
    });

    socket.on('end-call', (data) => {
      io.to(data.to).emit('call-ended');
    });

    /**
     * User disconnect
     */
    socket.on('disconnect', async () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
      
      // Find and update user offline status
      for (let [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          try {
            await User.findByIdAndUpdate(userId, {
              isOnline: false,
              socketId: null,
              lastSeen: Date.now()
            });

            // Broadcast offline status
            socket.broadcast.emit('user-offline', userId);
            
            connectedUsers.delete(userId);
            console.log(`User ${userId} disconnected`);
          } catch (error) {
            console.error('Disconnect error:', error);
          }
          break;
        }
      }
    });

    /**
     * Error handling
     */
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

module.exports = initializeSocket;
