/**
 * Home Page Component
 * Landing page for the application
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { FiMessageCircle, FiUsers, FiZap, FiShield } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FiMessageCircle size={32} />,
      title: 'Real-Time Messaging',
      description: 'Instant message delivery with typing indicators and read receipts'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Group Chats',
      description: 'Create groups and chat with multiple people simultaneously'
    },
    {
      icon: <FiZap size={32} />,
      title: 'Fast & Responsive',
      description: 'Lightning-fast performance optimized for all devices'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Secure & Private',
      description: 'End-to-end encryption keeps your conversations safe'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Chat App - Real-time Messaging Platform</title>
        <meta name="description" content="Connect with friends and family through our modern, secure real-time chat application." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-bg dark:to-dark-secondary">
        {/* Header */}
        <header className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <nav className="flex items-center justify-between">
            <div className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-500">
              Chat App
            </div>
            <div className="flex gap-2 md:gap-4">
              {isAuthenticated ? (
                <Link
                  to="/chat"
                  className="px-4 md:px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
                >
                  Open Chat
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 md:px-6 py-2 border-2 border-primary-600 text-primary-600 dark:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 md:px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-light-text dark:text-dark-text mb-4 md:mb-6 leading-tight">
              Connect Instantly
              <br />
              <span className="text-primary-600 dark:text-primary-500">Chat in Real-Time</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-light-textSecondary dark:text-dark-textSecondary mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              A modern messaging platform for seamless communication with friends, family, and teams.
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-block px-6 md:px-8 py-3 md:py-4 bg-primary-600 hover:bg-primary-700 text-white text-base md:text-lg rounded-lg font-semibold transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-light-secondary dark:bg-dark-secondary p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-600 dark:text-primary-500 mb-3 md:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {!isAuthenticated && (
            <div className="text-center bg-light-secondary dark:bg-dark-secondary rounded-xl p-6 md:p-8 lg:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-3 md:mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary mb-6 md:mb-8 px-4">
                Join now and start chatting with your friends and colleagues.
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 md:px-6 py-6 md:py-8 mt-12 md:mt-16 border-t border-light-border dark:border-dark-border">
          <div className="text-center">
            <nav className="mb-4">
              <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary">
                <li>
                  <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </nav>
            <p className="text-light-textSecondary dark:text-dark-textSecondary text-xs md:text-sm">
              &copy; 2024 Chat App. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
