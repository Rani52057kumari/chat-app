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
import ProfileModal from '../ProfileModal';
import GroupInfoModal from './GroupInfoModal';

const ChatWindow = ({ onMenuClick }) => {
  const { selectedChat, setSelectedChat, fetchMessages, onlineUsers, typingUsers } = useChat();
  const { user } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
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

  const getOtherUserId = () => {
    if (selectedChat.isGroupChat) return null;
    const otherUser = selectedChat.users.find(u => u._id !== user._id);
    return otherUser?._id;
  };

  const handleAvatarClick = () => {
    if (selectedChat.isGroupChat) {
      // Show group info for group chats
      setShowGroupInfo(true);
    } else {
      // Show profile for private chats
      const userId = getOtherUserId();
      if (userId) {
        setProfileUserId(userId);
        setShowProfile(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col"
    >
      {/* Header - Fully Responsive */}
      <div className="glass-light dark:glass-dark border-b border-white/10 px-3 md:px-4 lg:px-5 py-3 md:py-3.5 shadow-md">
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Back Button (mobile/tablet) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="lg:hidden btn-icon p-2 flex-shrink-0"
              aria-label="Back to chats"
            >
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>

            {/* Avatar - Responsive Sizing */}
            <div className="relative flex-shrink-0">
              <img
                src={getChatAvatar()}
                alt={getChatName()}
                loading="lazy"
                width="44"
                height="44"
                onClick={handleAvatarClick}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover object-center ring-2 ring-white/10 cursor-pointer hover:ring-4 hover:ring-primary-500/30 transition-all"
              />
              {isOnline() && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"
                />
              )}
            </div>

            {/* Chat Info - Responsive Text */}
            <div className="flex-1 min-w-0">
              <h3 
                onClick={handleAvatarClick}
                className="font-semibold text-gray-900 dark:text-white truncate text-sm md:text-base cursor-pointer hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
              >
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

          {/* More Options - Responsive */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo(!showInfo)}
            className="btn-icon p-2 md:p-2.5 flex-shrink-0"
            aria-label="More options"
          >
            <FiMoreVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <Messages onTyping={handleTyping} />

      {/* Message Input */}
      <MessageInput onTyping={handleTyping} />

      {/* Profile Modal */}
      {showProfile && profileUserId && (
        <ProfileModal
          userId={profileUserId}
          onClose={() => {
            setShowProfile(false);
            setProfileUserId(null);
          }}
        />
      )}

      {/* Group Info Modal */}
      {showGroupInfo && selectedChat?.isGroupChat && (
        <GroupInfoModal
          group={selectedChat}
          onClose={() => setShowGroupInfo(false)}
        />
      )}
    </motion.div>
  );
};

export default ChatWindow;
