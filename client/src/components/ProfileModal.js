/**
 * Profile Modal Component
 * Displays public user profile information
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiMapPin } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { format } from 'date-fns';
import { formatLocation } from '../utils/locationService';

const ProfileModal = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await authAPI.getPublicProfile(userId);
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

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
          className="bg-white dark:bg-dark-secondary rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-br from-primary-500 to-primary-700">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Close profile"
            >
              <FiX size={20} className="text-white" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
              </div>
            ) : profile ? (
              <>
                {/* Avatar */}
                <div className="relative -mt-16 mb-4">
                  <img
                    src={profile.avatar || 'https://ui-avatars.com/api/?background=random'}
                    alt={profile.name}
                    className="w-28 h-28 rounded-full object-cover object-center border-4 border-white dark:border-dark-secondary shadow-xl mx-auto"
                  />
                  {/* Online Status Indicator */}
                  <div
                    className={`absolute bottom-2 right-1/2 translate-x-14 w-6 h-6 rounded-full border-4 border-white dark:border-dark-secondary ${
                      profile.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
                  {profile.name}
                </h2>

                {/* Online Status */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {profile.isOnline ? (
                    <span className="text-green-600 dark:text-green-500 font-medium">● Online</span>
                  ) : (
                    <span className="text-gray-500">
                      Last seen {profile.lastSeen ? format(new Date(profile.lastSeen), 'MMM dd, yyyy h:mm a') : 'recently'}
                    </span>
                  )}
                </p>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    About
                  </h3>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                    {profile.bio || 'Hey there! I am using Chat App'}
                  </p>
                </div>

                {/* Location */}
                {formatLocation(profile) && (
                  <div className="mb-6">
                    <div className="flex items-center justify-center text-base text-gray-700 dark:text-gray-300 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-4">
                      <FiMapPin size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
                      <span className="font-medium">
                        {formatLocation(profile).replace('📍 ', '')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Joined Date */}
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                  <FiCalendar size={16} className="mr-2" />
                  <span>
                    Joined {format(new Date(profile.joinedDate), 'MMMM yyyy')}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Profile not found
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
