/**
 * Message Input Component
 * Input area for sending messages and files with glassmorphism design
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { FiSend, FiPaperclip, FiSmile, FiX, FiFile } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ onTyping }) => {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Only images (JPEG, PNG, GIF) and PDF files are allowed');
        return;
      }

      setFile(selectedFile);
      
      // Generate preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !file) return;

    setSending(true);
    await sendMessage(message, file);
    
    setMessage('');
    setFile(null);
    setFilePreview(null);
    setSending(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping();
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-light dark:glass-dark border-t border-white/10 p-4">
      {/* File Preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3"
          >
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  loading="lazy"
                  width="48"
                  height="48"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <FiFile size={24} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearFile}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors"
              >
                <FiX size={18} className="text-red-500" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Emoji Picker Button */}
        <div className="relative">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn-icon"
          >
            <FiSmile size={22} />
          </motion.button>

          <AnimatePresence>
            {showEmojiPicker && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowEmojiPicker(false)}
                  className="fixed inset-0 z-40"
                />
                {/* Emoji Picker */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 z-50 shadow-2xl rounded-xl overflow-hidden"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    height={400}
                    width={350}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* File Attach Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          className="btn-icon"
        >
          <FiPaperclip size={22} />
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,.pdf"
          className="hidden"
        />

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="input-glass flex-1"
        />

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={(!message.trim() && !file) || sending}
          whileHover={{ scale: sending || (!message.trim() && !file) ? 1 : 1.05 }}
          whileTap={{ scale: sending || (!message.trim() && !file) ? 1 : 0.95 }}
          className={`btn-primary p-3 ${
            (!message.trim() && !file) || sending
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {sending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <FiSend size={20} />
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;
