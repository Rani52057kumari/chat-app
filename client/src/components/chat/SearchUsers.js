/**
 * Search Users Component
 * Modal to search and start chatting with users with glassmorphism design
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../services/api';
import { useChat } from '../../context/ChatContext';
import { FiX, FiSearch, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { SearchSkeleton } from '../LoadingSkeletons';

const SearchUsers = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { accessChat } = useChat();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await authAPI.searchUsers(query);
      setUsers(data.data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    await accessChat(userId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-content w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <FiSearch size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Users
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="btn-icon"
            >
              <FiX size={24} />
            </motion.button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name or email..."
                className="input-glass w-full pl-10"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {loading ? (
              <SearchSkeleton />
            ) : users.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
                  {search ? 'No users found' : 'Start typing to search'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-center text-sm mt-2">
                  {search ? 'Try a different search term' : 'Search by name or email'}
                </p>
              </motion.div>
            ) : (
              <div className="p-2 space-y-2">
                {users.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectUser(user._id)}
                    className="flex items-center gap-3 p-3 glass rounded-xl cursor-pointer hover-lift"
                  >
                    <img
                      src={user.avatar || 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(user.name)}
                      alt={user.name}
                      loading="lazy"
                      width="48"
                      height="48"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg"
                    >
                      <FiMessageSquare size={18} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchUsers;
