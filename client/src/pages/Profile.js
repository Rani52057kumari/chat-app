/**
 * Profile Page Component
 * Allows users to view and edit their profile
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiSave, FiX, FiEdit2, FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import SEO from '../components/SEO';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload immediately
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await authAPI.uploadAvatar(formData);
      
      if (response.data.success) {
        const updatedUser = { ...user, avatar: response.data.data.avatar };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Avatar updated successfully');
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (formData.name.length > 50) {
      toast.error('Name cannot be more than 50 characters');
      return;
    }

    if (formData.bio.length > 200) {
      toast.error('Bio cannot be more than 200 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.updateProfile(formData);

      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
    setAvatarPreview(null);
  };

  return (
    <>
      <SEO
        title="Profile"
        description="View and edit your profile"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-light dark:glass-dark rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </motion.button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center mb-8">
                {/* Avatar */}
                <div className="relative group">
                  <motion.div
                    whileHover={isEditing ? { scale: 1.05 } : {}}
                    className="relative"
                  >
                    <img
                      src={avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=200`}
                      alt={user?.name}
                      className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-purple-500 shadow-2xl object-cover ${
                        isEditing ? 'cursor-pointer' : ''
                      } ${uploadingAvatar ? 'opacity-50' : ''}`}
                      onClick={handleAvatarClick}
                    />
                    {isEditing && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleAvatarClick}
                      >
                        <FiCamera className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                      </div>
                    )}
                  </motion.div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {isEditing && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Click avatar to upload new image (max 5MB)
                  </p>
                )}
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiUser className="w-4 h-4" />
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your name"
                      maxLength={50}
                      required
                    />
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white">
                      {user?.name}
                    </div>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white">
                    {user?.email}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiPhone className="w-4 h-4" />
                    Phone (Optional)
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white">
                      {user?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMessageSquare className="w-4 h-4" />
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Tell us about yourself"
                      maxLength={200}
                    />
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white min-h-[80px]">
                      {user?.bio || 'No bio added yet'}
                    </div>
                  )}
                  {isEditing && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formData.bio.length}/200 characters
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </motion.button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;
