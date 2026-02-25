/**
 * Profile Page Component
 * Allows users to view and edit their profile
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiSave, FiX, FiEdit2, FiUser, FiMail, FiPhone, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import SEO from '../components/SEO';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
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

  // Dismiss any existing toasts when component mounts
  useEffect(() => {
    toast.dismiss();
  }, []);

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
      
      // Prepare clean data
      const cleanData = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        phone: formData.phone.trim()
      };

      console.log('Updating profile with data:', cleanData);
      const response = await authAPI.updateProfile(cleanData);
      console.log('Profile update response:', response.data);

      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully! 🎉');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show specific error message
      let errorMessage = 'Failed to update profile';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(e => e.message).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    toast.dismiss(); // Clear any error messages
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const handleEditClick = () => {
    toast.dismiss(); // Clear any old messages
    setIsEditing(true);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/chat');
    }
  };

  return (
    <>
      <SEO
        title="Profile"
        description="View and edit your profile"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Header - Responsive */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 md:py-5">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  type="button"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back</span>
                </motion.button>
              </div>
              <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-3 md:gap-0">
                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Profile</h1>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your profile information
                  </p>
                </div>
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditClick}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 w-full md:w-auto justify-center"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 w-full md:w-auto justify-center"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </motion.button>
                )}
              </div>
            </div>

            {/* Profile Content - Responsive */}
            <div className="p-4 md:p-6">
              {/* Avatar Section - Responsive */}
              <div className="flex flex-col items-center pb-6 md:pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group mb-3">
                  <div className="relative">
                    <img
                      src={avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=200`}
                      alt={user?.name}
                      className={`w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg ${
                        uploadingAvatar ? 'opacity-50' : ''
                      }`}
                    />
                    {isEditing && !uploadingAvatar && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAvatarClick}
                        className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 md:p-3 shadow-lg transition-all duration-200"
                        type="button"
                      >
                        <FiCamera className="w-4 h-4 md:w-5 md:h-5" />
                      </motion.button>
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 break-all px-2">
                  {user?.email}
                </p>
                {isEditing && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Click camera icon to change avatar (max 5MB)
                  </p>
                )}
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter your name"
                      maxLength={50}
                      required
                    />
                  ) : (
                    <div className="px-4 py-2.5 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {user?.name}
                    </div>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    Email
                  </label>
                  <div className="px-4 py-2.5 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {user?.email}
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Email address cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    Phone Number
                    <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="px-4 py-2.5 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                      {user?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMessageSquare className="w-4 h-4 text-gray-400" />
                    About
                  </label>
                  {isEditing ? (
                    <>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                        placeholder="Write something about yourself"
                        maxLength={200}
                      />
                      <div className="flex justify-between items-center mt-1.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Share a bit about yourself
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formData.bio.length}/200
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-2.5 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[80px]">
                      {user?.bio || 'No bio added yet'}
                    </div>
                  )}
                </div>

                {/* Action Buttons - Responsive */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg transition-all duration-200 ${
                        loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
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
