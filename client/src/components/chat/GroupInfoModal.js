/**
 * Group Info Modal Component
 * Displays group information and members
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiUsers, FiLogOut, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ProfileModal from '../ProfileModal';

const GroupInfoModal = ({ group, onClose }) => {
  const { user } = useAuth();
  const { leaveGroup } = useChat();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = group.groupAdmin?._id === user._id;

  const handleMemberClick = (userId) => {
    setSelectedUserId(userId);
    setShowProfile(true);
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) {
      return;
    }

    setLoading(true);
    await leaveGroup(group._id, user._id);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-dark-secondary rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
        >
          {/* Header with Group Avatar */}
          <div className="relative min-h-[160px] bg-gradient-to-br from-primary-500 to-purple-600 flex-shrink-0 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
              aria-label="Close"
            >
              <FiX size={20} className="text-white" />
            </button>
            
            {/* Group Avatar - positioned at bottom of header */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-20">
              <img
                src={group.groupAvatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(group.chatName)}`}
                alt={group.chatName}
                className="w-32 h-32 rounded-full object-cover object-center border-4 border-white dark:border-dark-secondary shadow-xl"
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto rounded-b-2xl">
            <div className="relative px-6 pb-6 pt-20">
              {/* Group Name */}
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
                {group.chatName}
              </h2>

              {/* Member Count */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                <FiUsers size={16} />
                <span>{group.users?.length || 0} members</span>
              </p>

              {/* Created Date */}
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <FiCalendar size={16} className="mr-2" />
                <span>Created {format(new Date(group.createdAt), 'MMMM dd, yyyy')}</span>
              </div>

              {/* Group Description (if exists) */}
              {group.description && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Description
                  </h3>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-dark-bg rounded-xl p-5 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              )}

              {/* Members List */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Members ({group.users?.length || 0})
                </h3>
                <div className="space-y-3">
                  {group.users?.map((member) => (
                    <motion.div
                      key={member._id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleMemberClick(member._id)}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                    >
                      <img
                        src={member.avatar || 'https://ui-avatars.com/api/?background=random'}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover object-center ring-2 ring-white dark:ring-dark-secondary flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {member.name}
                          </h4>
                          {member._id === group.groupAdmin?._id && (
                            <span className="flex items-center gap-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                              <FiShield size={12} />
                              Admin
                            </span>
                          )}
                          {member._id === user._id && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (You)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>
                      {member.isOnline && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Leave Group Button */}
              {!isAdmin && (
                <motion.button
                  onClick={handleLeaveGroup}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLogOut size={18} />
                  {loading ? 'Leaving...' : 'Leave Group'}
                </motion.button>
              )}

              {isAdmin && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-center">
                  <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center justify-center gap-2">
                    <FiShield size={16} />
                    <span>You are the group admin. Transfer admin rights before leaving.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Modal */}
        {showProfile && selectedUserId && (
          <ProfileModal
            userId={selectedUserId}
            onClose={() => {
              setShowProfile(false);
              setSelectedUserId(null);
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default GroupInfoModal;
