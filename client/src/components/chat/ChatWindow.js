/**
 * Chat Window Component
 * Main chat area with messages and input with glassmorphism design
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import { FiMoreVertical, FiArrowLeft, FiUsers } from 'react-icons/fi';
import Messages from './Messages';
import MessageInput from './MessageInput';

const ChatWindow = ({ onMenuClick }) => {
  const { selectedChat, setSelectedChat, fetchMessages, onlineUsers, typingUsers } = useChat();
  const { user } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socket = getSocket();
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      socket.emit('join-chat', selectedChat._id);

      return () => {
        socket.emit('leave-chat', selectedChat._id);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    const typingUser = typingUsers[selectedChat?._id];
    setIsTyping(!!typingUser && typingUser !== user._id);
  }, [typingUsers, selectedChat, user]);

  const handleTyping = () => {
    if (!socket || !selectedChat) return;

    socket.emit('typing', { chatId: selectedChat._id, userId: user._id });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit('stop-typing', { chatId: selectedChat._id, userId: user._id });
    }, 2000);
  };

  const handleBack = () => {
    setSelectedChat(null);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const getChatName = () => {
    if (selectedChat.isGroupChat) {
      return selectedChat.chatName;
    }
    const otherUser = selectedChat.users.find(u => u._id !== user._id);
    return otherUser?.name || 'Unknown';
  };

  const getChatAvatar = () => {
    if (selectedChat.isGroupChat) {
      return selectedChat.groupAvatar || 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(selectedChat.chatName);
    }
    const otherUser = selectedChat.users.find(u => u._id !== user._id);
    return otherUser?.avatar || 'https://ui-avatars.com/api/?background=random';
  };

  const isOnline = () => {
    if (selectedChat.isGroupChat) return false;
    const otherUser = selectedChat.users.find(u => u._id !== user._id);
    return onlineUsers.includes(otherUser?._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col"
    >
      {/* Header */}
      <div className="glass-light dark:glass-dark border-b border-white/10 px-3 sm:px-4 py-3 sm:py-3.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Back Button (mobile) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="lg:hidden btn-icon p-2 flex-shrink-0"
            >
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={getChatAvatar()}
                alt={getChatName()}
                loading="lazy"
                width="44"
                height="44"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-white/10"
              />
              {isOnline() && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"
                />
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                {getChatName()}
              </h3>
              <AnimatePresence mode="wait">
                {isTyping ? (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      typing...
                    </span>
                  </motion.div>
                ) : (
                  <motion.p
                    key="status"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5"
                  >
                    {selectedChat.isGroupChat ? (
                      <>
                        <FiUsers size={12} />
                        <span>{selectedChat.users.length} members</span>
                      </> 
                    ) : isOnline() ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
                        <span>Offline</span>
                      </>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* More Options */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo(!showInfo)}
            className="btn-icon ml-2"
          >
            <FiMoreVertical size={20} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <Messages onTyping={handleTyping} />

      {/* Message Input */}
      <MessageInput onTyping={handleTyping} />
    </motion.div>
  );
};

export default ChatWindow;
