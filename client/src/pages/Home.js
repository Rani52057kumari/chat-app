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
      title: 'Real Time Chat App',
      description: 'Instant messaging with live updates, typing indicators, and real-time message delivery for seamless communication'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Free Chat Web App',
      description: 'Create unlimited groups and chat with multiple people at once. 100% free forever with no hidden fees'
    },
    {
      icon: <FiZap size={32} />,
      title: 'Online Chat Website',
      description: 'Lightning-fast performance on all devices. Access from anywhere with our responsive web interface'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Secure Messaging App',
      description: 'End-to-end encryption, secure authentication, and private messaging to keep your conversations safe'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Chat App - Real-time Messaging Platform</title>
        <meta name="description" content="Connect with friends and family through our modern, secure real-time chat application. Features include group chats, file sharing, and more." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-bg dark:to-dark-secondary">
        {/* Header - Responsive */}
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

        {/* Hero Section - Responsive */}
        <main className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-light-text dark:text-dark-text mb-4 md:mb-6 leading-tight">
              Real Time Chat App
              <br />
              <span className="text-primary-600 dark:text-primary-500">Free Secure Messaging & Online Chat</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-light-textSecondary dark:text-dark-textSecondary mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              The best free chat web app for secure messaging. Experience instant real-time communication with end-to-end encryption, group chats, file sharing, and more. Your complete online chat website for private and group conversations.
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-block px-6 md:px-8 py-3 md:py-4 bg-primary-600 hover:bg-primary-700 text-white text-base md:text-lg rounded-lg font-semibold transition-colors shadow-lg"
                aria-label="Sign up for free secure messaging"
              >
                Get Started Free - No Credit Card Required
              </Link>
            )}
          </div>

          {/* Features Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16 lg:mb-20">
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

          {/* App Preview Section - Responsive & Attractive */}
          <div className="mb-12 md:mb-16 lg:mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-3 md:mb-4">
                See Our App in Action
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-light-textSecondary dark:text-dark-textSecondary max-w-2xl mx-auto px-4">
                Beautiful, fast, and secure messaging on any device
              </p>
            </div>
            
            {/* Screenshot Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {/* Main Screenshot - Large */}
              <div className="md:col-span-2 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-dark-secondary dark:to-dark-bg rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary-600/10 to-primary-400/10 dark:from-primary-500/20 dark:to-primary-700/20 rounded-xl flex items-center justify-center border-2 border-primary-300/50 dark:border-primary-500/30">
                  <div className="text-center px-4">
                    <FiMessageCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary-600 dark:text-primary-500 mx-auto mb-3 md:mb-4" />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                      Real-Time Messaging Interface
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary">
                      Chat with friends, send photos, and create groups instantly
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Highlights - Mobile & Desktop Views */}
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-dark-secondary dark:to-dark-bg rounded-2xl p-4 md:p-6 shadow-xl overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-600/10 to-primary-400/10 dark:from-primary-500/20 dark:to-primary-700/20 rounded-xl flex items-center justify-center border-2 border-primary-300/50 dark:border-primary-500/30">
                  <div className="text-center px-4">
                    <FiUsers className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary-600 dark:text-primary-500 mx-auto mb-2 md:mb-3" />
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-light-text dark:text-dark-text mb-2">
                      Mobile View
                    </h3>
                    <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      Responsive on all devices
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-dark-secondary dark:to-dark-bg rounded-2xl p-4 md:p-6 shadow-xl overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-600/10 to-primary-400/10 dark:from-primary-500/20 dark:to-primary-700/20 rounded-xl flex items-center justify-center border-2 border-primary-300/50 dark:border-primary-500/30">
                  <div className="text-center px-4">
                    <FiShield className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary-600 dark:text-primary-500 mx-auto mb-2 md:mb-3" />
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-light-text dark:text-dark-text mb-2">
                      Secure & Private
                    </h3>
                    <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      End-to-end encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content Section - Responsive */}
          <div className="max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20 space-y-6 md:space-y-8">
            <section className="bg-light-secondary dark:bg-dark-secondary rounded-xl p-5 md:p-6 lg:p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-3 md:mb-4">
                Why Choose Our Real Time Chat App?
              </h2>
              <p className="text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary mb-3 md:mb-4 leading-relaxed">
                Looking for the best <strong>free chat web app</strong> with <strong>secure messaging</strong>? Our <strong>real time chat app</strong> provides instant communication with military-grade encryption. Whether you need an <strong>online chat website</strong> for personal use or business communication, we offer unlimited messaging, group chats, file sharing, and more - absolutely free.
              </p>
              <p className="text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary leading-relaxed">
                As a leading <strong>secure messaging app</strong>, we prioritize your privacy with end-to-end encryption, secure authentication, and no data tracking. Our platform is designed for speed, reliability, and security - making it the perfect choice for anyone seeking a trustworthy <strong>free chat web app</strong>.
              </p>
            </section>

            <section className="bg-light-secondary dark:bg-dark-secondary rounded-xl p-5 md:p-6 lg:p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-3 md:mb-4">
                Key Features of Our Secure Messaging Platform
              </h2>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary">
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-500 mr-2">✓</span>
                  <span><strong>Real-time messaging:</strong> Experience instant message delivery with typing indicators and read receipts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-500 mr-2">✓</span>
                  <span><strong>End-to-end encryption:</strong> Your conversations stay private with military-grade security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-500 mr-2">✓</span>
                  <span><strong>Group chats:</strong> Create unlimited groups for team collaboration or social conversations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-500 mr-2">✓</span>
                  <span><strong>File sharing:</strong> Share documents, images, and files securely within conversations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-500 mr-2">✓</span>
                  <span><strong>Cross-platform access:</strong> Use our online chat website from any device, anywhere</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 dark:text-primary-500 mr-2">✓</span>
                  <span><strong>100% Free:</strong> No subscriptions, no hidden fees, completely free forever</span>
                </li>
              </ul>
            </section>
          </div>

          {/* CTA Section - Responsive */}
          <div className="text-center bg-light-secondary dark:bg-dark-secondary rounded-xl p-6 md:p-8 lg:p-12 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-3 md:mb-4">
              Ready to Start Using Our Free Secure Messaging App?
            </h2>
            <p className="text-sm md:text-base text-light-textSecondary dark:text-dark-textSecondary mb-6 md:mb-8 px-4">
              Join thousands of users enjoying this real time chat app. Free forever, secure messaging with end-to-end encryption, and unlimited group chats on our online chat website.
            </p>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                aria-label="Create free account for secure messaging"
              >
                Create Free Account - Start Chatting Now
              </Link>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 md:px-6 py-6 md:py-8 mt-12 md:mt-16 lg:mt-20 border-t border-light-border dark:border-dark-border">
          <div className="text-center">
            <nav className="mb-4" aria-label="Footer navigation">
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
                    Sign Up Free
                  </Link>
                </li>
              </ul>
            </nav>
            <p className="text-light-textSecondary dark:text-dark-textSecondary text-xs md:text-sm">
              Real Time Chat App - Free Secure Messaging & Online Chat Website
            </p>
            <p className="text-light-textSecondary dark:text-dark-textSecondary text-xs md:text-sm mt-2">
              &copy; 2024 Chat App. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
