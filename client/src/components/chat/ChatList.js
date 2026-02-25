/**
 * Chat List Component
 * Displays list of all chats with glassmorphism design
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { FiCheck } from 'react-icons/fi';
import { ChatListSkeleton } from '../LoadingSkeletons';
import ProfileModal from '../ProfileModal';

const ChatList = () => {
  const { chats, selectedChat, setSelectedChat, loading, onlineUsers, unreadCounts } = useChat();
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);

  const getChatName = (chat) => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    const otherUser = chat.users.find(u => u._id !== user._id);
    return otherUser?.name || 'Unknown';
  };

  const getChatAvatar = (chat) => {
    if (chat.isGroupChat) {
      return chat.groupAvatar || 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(chat.chatName);
    }
    const otherUser = chat.users.find(u => u._id !== user._id);
    return otherUser?.avatar || 'https://ui-avatars.com/api/?background=random';
  };

  const isOnline = (chat) => {
    if (chat.isGroupChat) return false;
    const otherUser = chat.users.find(u => u._id !== user._id);
    return onlineUsers.includes(otherUser?._id);
  };

  const getUnreadCount = (chat) => {
    return unreadCounts[chat._id] || 0;
  };

  const getReadStatus = (message) => {
    if (!message || !message.readBy) return 'sent';
    const othersRead = message.readBy.some(r => r.user !== user._id);
    return othersRead ? 'seen' : 'delivered';
  };

  const handleAvatarClick = (e, chat) => {
    e.stopPropagation();
    if (!chat.isGroupChat) {
      const otherUser = chat.users.find(u => u._id !== user._id);
      if (otherUser) {
        setProfileUserId(otherUser._id);
        setShowProfile(true);
      }
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const msgDate = new Date(date);
    const today = new Date();
    
    if (msgDate.toDateString() === today.toDateString()) {
      return format(msgDate, 'HH:mm');
    }
    return format(msgDate, 'dd/MM/yyyy');
  };

  const getLatestMessage = (chat) => {
    if (!chat.latestMessage) return 'No messages yet';
    
    const msg = chat.latestMessage;
    const isSender = msg.sender?._id === user._id;
    const prefix = isSender ? 'You: ' : '';
    
    if (msg.fileType !== 'none') {
      return `${prefix}📎 ${msg.fileType === 'image' ? 'Photo' : 'Document'}`;
    }
    
    return `${prefix}${msg.content?.substring(0, 30)}${msg.content?.length > 30 ? '...' : ''}`;
  };

  if (loading) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {chats.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center h-full p-4 md:p-6"
        >
          <div className="text-5xl sm:text-6xl mb-4">💬</div>
          <p className="text-gray-500 dark:text-gray-400 text-center text-base md:text-lg">
            No chats yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-center text-xs md:text-sm mt-2">
            Search for users to start chatting!
          </p>
        </motion.div>
      ) : (
        <div className="p-1.5 md:p-2">
          {chats.map((chat, index) => {
            const unreadCount = getUnreadCount(chat);
            const isSelected = selectedChat?._id === chat._id;

            return (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => setSelectedChat(chat)}
                className={`sidebar-item ${isSelected ? 'active' : ''} mb-1.5 md:mb-2`}
              >
                {/* Avatar with online indicator - Responsive */}
                <div className="relative flex-shrink-0">
                  <img
                    src={getChatAvatar(chat)}
                    alt={getChatName(chat)}
                    loading="lazy"
                    width="48"
                    height="48"
                    onClick={(e) => handleAvatarClick(e, chat)}
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-full object-cover object-center ring-2 ring-white/10 ${
                      !chat.isGroupChat ? 'cursor-pointer hover:ring-4 hover:ring-primary-500/30 transition-all' : ''
                    }`}
                  />
                  {isOnline(chat) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"
                    />
                  )}
                </div>

                {/* Chat Info - Responsive */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm md:text-base">
                      {getChatName(chat)}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatTime(chat.latestMessage?.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs sm:text-sm truncate flex-1 ${
                      unreadCount > 0 
                        ? 'text-gray-900 dark:text-white font-medium' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {getLatestMessage(chat)}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Read receipts for sent messages */}
                      {chat.latestMessage?.sender?._id === user._id && (
                        <div className="flex items-center">
                          {(() => {
                            const status = getReadStatus(chat.latestMessage);
                            if (status === 'seen') {
                              return (
                                <div className="flex">
                                  <FiCheck size={14} className="text-blue-500 -mr-1.5" />
                                  <FiCheck size={14} className="text-blue-500" />
                                </div>
                              );
                            } else if (status === 'delivered') {
                              return (
                                <div className="flex">
                                  <FiCheck size={14} className="text-gray-400 dark:text-gray-500 -mr-1.5" />
                                  <FiCheck size={14} className="text-gray-400 dark:text-gray-500" />
                                </div>
                              );
                            } else {
                              return <FiCheck size={14} className="text-gray-400 dark:text-gray-500" />;
                            }
                          })()}
                        </div>
                      )}
                      
                      {/* Unread count badge */}
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="badge-notification"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

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
    </div>
  );
};

export default ChatList;
