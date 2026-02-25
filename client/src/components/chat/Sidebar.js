/**
 * Sidebar Component - Modern Glassmorphism Design
 * Displays user profile, search, and chat list with beautiful animations
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiPlus, FiMoreVertical, FiSettings, 
  FiLogOut, FiMoon, FiSun, FiUsers, FiUser 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ChatList from './ChatList';
import SearchUsers from './SearchUsers';
import CreateGroupModal from './CreateGroupModal';
import { ChatListSkeleton } from '../LoadingSkeletons';

const Sidebar = ({ loading, onClose }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowMenu(false);
    if (onClose) onClose(); // Close sidebar on mobile
  };

  return (
    <div className="flex flex-col h-full glass-light dark:glass-dark lg:rounded-2xl overflow-hidden shadow-2xl">
      {/* Header - Responsive */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/20 dark:border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
          <div 
            className="relative cursor-pointer hover-lift flex-shrink-0"
            onClick={handleProfileClick}
          >
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name}
              alt={user?.name}
              loading="lazy"
              width="40"
              height="40"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-primary-500 shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
              {user?.name}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Online</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="btn-icon p-2 md:p-2.5"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <FiSun className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <FiMoon className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </motion.button>

          {/* Search Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="btn-icon p-2 md:p-2.5"
            aria-label="Search users"
          >
            <FiSearch className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          {/* New Group */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGroupModal(true)}
            className="btn-icon p-2 md:p-2.5"
            aria-label="Create group"
          >
            <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          {/* Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="btn-icon p-2 md:p-2.5"
              aria-label="More options"
            >
              <FiMoreVertical className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="context-menu right-0 top-14 mt-1"
                  >
                  <button
                    onClick={handleProfileClick}
                    className="context-menu-item"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowGroupModal(true);
                      setShowMenu(false);
                    }}
                    className="context-menu-item"
                  >
                    <FiUsers className="w-4 h-4" />
                    <span>New Group</span>
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="context-menu-item"
                  >
                    {darkMode ? (
                      <>
                        <FiSun className="w-4 h-4" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <FiMoon className="w-4 h-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                  <button className="context-menu-item">
                    <FiSettings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="context-menu-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-b border-white/20 dark:border-gray-800/50">
              <SearchUsers onClose={() => setSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <ChatListSkeleton />
        ) : (
          <ChatList />
        )}
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center">
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name + '&size=120'}
                  alt={user?.name}
                  loading="lazy"
                  width="128"
                  height="128"
                  className="w-32 h-32 rounded-full border-4 border-primary-500 shadow-2xl hover-glow"
                />
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                {user?.bio && (
                  <p className="mt-2 text-center text-gray-700 dark:text-gray-300">
                    {user?.bio}
                  </p>
                )}
                <button
                  onClick={() => setShowProfile(false)}
                  className="btn-primary mt-6 w-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      {showGroupModal && (
        <CreateGroupModal onClose={() => setShowGroupModal(false)} />
      )}
    </div>
  );
};

export default Sidebar;
