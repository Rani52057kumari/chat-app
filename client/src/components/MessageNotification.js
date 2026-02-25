/**
 * Message Notification Component
 * In-app toast notification for new messages
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const MessageNotification = ({ notification, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] cursor-pointer"
    >
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-2xl border border-light-border dark:border-dark-border overflow-hidden hover:shadow-3xl transition-shadow">
        <div className="p-4 flex items-start gap-3">
          {/* Avatar */}
          <img
            src={notification.senderAvatar || 'https://ui-avatars.com/api/?background=random'}
            alt={notification.senderName}
            className="w-12 h-12 rounded-full object-cover object-center flex-shrink-0 ring-2 ring-primary-500/20"
          />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {notification.senderName}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                aria-label="Close notification"
              >
                <FiX size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {notification.messagePreview}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4, ease: 'linear' }}
          className="h-1 bg-primary-600"
        />
      </div>
    </motion.div>
  );
};

export default MessageNotification;
