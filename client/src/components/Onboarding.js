/**
 * Onboarding Component
 * Guides new users through profile setup and connecting with friends
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiCamera, FiUsers, FiMessageCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Onboarding = ({ onComplete, onSkip }) => {
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: '',
    phone: ''
  });

  const steps = [
    {
      id: 0,
      title: 'Welcome to Chat App! 👋',
      subtitle: 'Let\'s get you connected with friends',
      icon: <FiMessageCircle className="w-12 h-12" />
    },
    {
      id: 1,
      title: 'Complete Your Profile',
      subtitle: 'Add a photo and tell us about yourself',
      icon: <FiCamera className="w-12 h-12" />
    },
    {
      id: 2,
      title: 'Find Friends',
      subtitle: 'Connect with people you know',
      icon: <FiUsers className="w-12 h-12" />
    },
    {
      id: 3,
      title: 'Start Chatting!',
      subtitle: 'You\'re all set to begin messaging',
      icon: <FiCheck className="w-12 h-12" />
    }
  ];

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

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
        toast.success('Avatar uploaded! 📸');
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const cleanData = {
        name: profileData.name.trim(),
        bio: profileData.bio.trim(),
        phone: profileData.phone.trim()
      };

      const response = await authAPI.updateProfile(cleanData);

      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOnboardingStatus = async (step, completed = false) => {
    try {
      const response = await authAPI.updateOnboarding({ step, completed });
      if (response.data.success) {
        const updatedUser = { 
          ...user, 
          onboardingStep: step,
          onboardingCompleted: completed 
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Onboarding update error:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate and save profile
      if (!profileData.name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      
      const success = await saveProfile();
      if (!success) return;
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await updateOnboardingStatus(nextStep);
    } else {
      // Complete onboarding
      await updateOnboardingStatus(currentStep, true);
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await updateOnboardingStatus(currentStep, true);
    onSkip();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Welcome Screen
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
            >
              {steps[0].icon}
            </motion.div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
              Chat App helps you stay connected with friends and family. Let's set up your profile to get started!
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Profile</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Friends</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Chat</p>
              </div>
            </div>
          </div>
        );

      case 1:
        // Complete Profile
        return (
          <div className="py-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group mb-3">
                <img
                  src={avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=200`}
                  alt="Profile"
                  className={`w-28 h-28 rounded-full object-cover object-center border-4 border-blue-500 shadow-lg ${uploadingAvatar ? 'opacity-50' : ''}`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 shadow-lg transition-all duration-200"
                  type="button"
                >
                  <FiCamera className="w-4 h-4" />
                </motion.button>
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
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
              <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload profile picture</p>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your name"
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Bio <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  rows={2}
                  className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="Tell others about yourself"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                  {profileData.bio.length}/200
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        // Find Friends
        return (
          <div className="py-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Choose how you'd like to connect with friends
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Search by Email</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Find friends using their email address</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Share Invite Link</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send your profile link to friends</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Search by Name</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Look up people by their username</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>💡 Tip:</strong> Use the search icon in chat to find and add friends anytime!
              </p>
            </div>
          </div>
        );

      case 3:
        // Start Chatting
        return (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
            >
              <FiCheck className="w-12 h-12 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              You're All Set! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Your profile is ready! Search for friends, start conversations, and enjoy chatting.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">
                Quick Start Guide:
              </p>
              <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Click the <strong>search icon</strong> to find friends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Click on a user to start chatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Use the <strong>+ icon</strong> to create group chats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Access settings from the menu anytime</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {steps[currentStep].subtitle}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        index < currentStep
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {index < currentStep ? <FiCheck className="w-4 h-4" /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          index < currentStep
                            ? 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
            <div className="flex gap-3">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg transition-all duration-200 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Onboarding;
