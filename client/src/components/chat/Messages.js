/**
 * Messages Component
 * Displays all messages in the chat with glassmorphism design
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { FiCheck, FiCheckCircle, FiDownload, FiFile } from 'react-icons/fi';
import { MessageSkeleton } from '../LoadingSkeletons';

const Messages = () => {
  const { messages, loading } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  
  // Get backend URL for file attachments
  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return '';
    // If already absolute URL, return as is
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    // Otherwise, prepend backend server URL
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const SERVER_URL = API_BASE.replace('/api', '');
    return `${SERVER_URL}${fileUrl}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessageTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };

  const isMyMessage = (message) => {
    return message.sender._id === user._id;
  };

  const isRead = (message) => {
    return message.readBy?.length > 1;
  };

  if (loading) {
    return <MessageSkeleton />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5 custom-scrollbar">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-full px-4"
        >
          <div className="text-5xl sm:text-6xl md:text-7xl mb-4">👋</div>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg text-center">
            No messages yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm text-center mt-2">
            Start the conversation!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => {
              const isMine = isMyMessage(message);
              const showAvatar = 
                index === 0 || 
                messages[index - 1].sender._id !== message.sender._id;

              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-1.5 md:gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar - Responsive */}
                  <div className="flex-shrink-0">
                    {!isMine && showAvatar ? (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        src={message.sender.avatar || 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(message.sender.name)}
                        alt={message.sender.name}
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-white/10"
                      />
                    ) : (
                      <div className="w-7 md:w-8" />
                    )}
                  </div>

                  {/* Message Content - Responsive Width */}
                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[55%]`}>
                    {/* Sender Name (for group chats) */}
                    {!isMine && showAvatar && (
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1 px-2">
                        {message.sender.name}
                      </span>
                    )}

                    {/* Message Bubble */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`relative ${
                        isMine
                          ? 'message-bubble-sent'
                          : 'message-bubble-received'
                      }`}
                    >
                      {/* File Attachment */}
                      {message.fileUrl && (
                        <div className="mb-2">
                          {message.fileType === 'image' ? (
                            <div className="file-preview">
                              <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={getFileUrl(message.fileUrl)}
                                alt="attachment"
                                className="rounded-lg max-w-full h-auto max-h-48 sm:max-h-56 md:max-h-64 object-cover"
                              />
                              <a
                                href={getFileUrl(message.fileUrl)}
                                download
                                className="absolute top-2 right-2 p-1.5 md:p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                                aria-label="Download image"
                              >
                                <FiDownload className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                              </a>
                            </div>
                          ) : (
                            <a
                              href={getFileUrl(message.fileUrl)}
                              download
                              className={`flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg transition-all hover:scale-105 ${
                                isMine 
                                  ? 'bg-white/10 hover:bg-white/20' 
                                  : 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className={`p-1.5 md:p-2 rounded-lg ${
                                isMine ? 'bg-white/20' : 'bg-primary-100 dark:bg-primary-900/30'
                              }`}>
                                <FiFile className={`w-4 h-4 md:w-5 md:h-5 ${isMine ? 'text-white' : 'text-primary-600 dark:text-primary-400'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs md:text-sm font-medium truncate ${
                                  isMine ? 'text-white' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {message.fileName || 'Document'}
                                </p>
                                <p className={`text-xs ${
                                  isMine ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  Click to download
                                </p>
                              </div>
                              <FiDownload className={`w-4 h-4 md:w-4.5 md:h-4.5 ${isMine ? 'text-white/70' : 'text-gray-400'}`} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Text Content - Responsive */}
                      {message.content && (
                        <p className={`text-xs sm:text-sm whitespace-pre-wrap break-words ${
                          isMine ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {message.content}
                        </p>
                      )}

                      {/* Time and Read Status */}
                      <div className={`flex items-center gap-1 mt-1.5 ${
                        isMine ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className={`text-xs ${
                          isMine 
                            ? 'text-white/70' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatMessageTime(message.createdAt)}
                        </span>
                        {isMine && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {isRead(message) ? (
                              <FiCheckCircle size={14} className="text-white" />
                            ) : (
                              <FiCheck size={14} className="text-white/70" />
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default Messages;
