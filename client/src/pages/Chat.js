/**
 * Chat Page
 * Main chat interface with sidebar and chat window
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getSocket, connectSocket } from '../services/socket';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import Onboarding from '../components/Onboarding';

const Chat = () => {
  const { user } = useAuth();
  const { selectedChat, fetchChats } = useChat();
  const socket = getSocket();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Connect socket
      connectSocket();
      
      // Setup socket with user ID
      socket.emit('setup', user._id);
      
      socket.on('connected', () => {
        console.log('Socket connected');
      });

      // Fetch chats
      fetchChats();
    }

    return () => {
      if (socket) {
        socket.off('connected');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Close sidebar when chat is selected on mobile
  useEffect(() => {
    if (selectedChat && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [selectedChat]);

  return (
    <>
      <Helmet>
        <title>Chat - Chat App</title>
        <meta name="description" content="Start messaging with your contacts" />
      </Helmet>

      <div className="h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
        <div className="flex h-full relative">
          {/* Mobile Overlay - Enhanced */}
          {sidebarOpen && window.innerWidth < 1024 && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Fully Responsive */}
          <div className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:relative lg:translate-x-0
            w-full xs:w-[85vw] sm:w-80 md:w-[340px] lg:w-80 xl:w-96
            h-full z-30
            transition-transform duration-300 ease-in-out
          `}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Chat Window - Responsive */}
          {selectedChat ? (
            <ChatWindow onMenuClick={() => setSidebarOpen(true)} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-light-secondary dark:bg-dark-secondary px-4 py-6">
              <div className="text-center max-w-md w-full">
                <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6">💬</div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
                  Welcome to Chat App
                </h2>
                <p className="text-sm sm:text-base text-light-textSecondary dark:text-dark-textSecondary mb-6">
                  Select a chat to start messaging
                </p>
                {/* Mobile Menu Button - Show on mobile when no chat selected */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden btn-primary px-6 py-3 w-full sm:w-auto"
                >
                  View Chats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <Onboarding
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
};

export default Chat;
