/**
 * Location Permission Modal
 * Privacy-friendly location sharing prompt
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiShield, FiX } from 'react-icons/fi';
import { getUserLocation } from '../utils/locationService';
import { authAPI } from '../services/api';

const LocationPermissionModal = ({ isOpen, onClose, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAllow = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user's location
      const location = await getUserLocation();

      // Update location on backend
      await authAPI.updateLocation({
        city: location.city,
        state: location.state,
        country: location.country,
        locationEnabled: true
      });

      onComplete(true);
    } catch (err) {
      setError(err.message || 'Unable to get location. You can enable this later in settings.');
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Update backend that location is disabled
      await authAPI.updateLocation({
        city: null,
        state: null,
        country: null,
        locationEnabled: false
      });

      onComplete(false);
    } catch (err) {
      // Silently fail and continue
      console.error('Failed to update location preference:', err);
      onComplete(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) {
            handleSkip();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-light dark:glass-dark max-w-md w-full p-6 sm:p-8 shadow-2xl border border-white/20 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {!loading && (
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FiX size={20} />
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full mb-4">
              <FiMapPin size={32} className="text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Share Your Location
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help others discover you by sharing your city
            </p>
          </div>

          {/* Privacy Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiShield className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-1">
                  Privacy First
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Only city and country are stored</li>
                  <li>• No precise coordinates saved</li>
                  <li>• You can disable anytime</li>
                  <li>• Completely optional</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-3 mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={handleAllow}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                'Allow Location'
              )}
            </motion.button>
            <motion.button
              onClick={handleSkip}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-secondary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for Now
            </motion.button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
            You can change this setting later in your profile
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationPermissionModal;
