/**
 * Create Group Modal Component
 * Modal for creating group chats
 */

import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useChat } from '../../context/ChatContext';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createGroupChat } = useChat();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      const { data } = await authAPI.searchUsers(query);
      setUsers(data.data || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const toggleUser = (user) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error('Please select at least 2 users');
      return;
    }

    setLoading(true);
    const userIds = selectedUsers.map(u => u._id);
    await createGroupChat(groupName, userIds);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 md:pt-20">
      <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
            Create Group
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover text-light-text dark:text-dark-text"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Group Name Input */}
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Search Users */}
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              Add Users
            </label>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search users..."
              className="w-full px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm"
                >
                  <span>{user.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleUser(user)}
                    className="hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* User Search Results */}
          {users.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-light-border dark:border-dark-border rounded-lg">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user)}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors ${
                    selectedUsers.find(u => u._id === user._id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    loading="lazy"
                    width="40"
                    height="40"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-light-text dark:text-dark-text truncate">
                      {user.name}
                    </h4>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
