import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Real Time Chat App - Free Secure Messaging & Online Chat Website',
  description = 'Free real-time chat app with secure messaging, group chats, file sharing, and emoji support. Best online chat website for instant communication. Safe, fast, and easy to use.',
  keywords = 'real time chat app, free chat web app, secure messaging app, online chat website, instant messaging, group chat, live chat, chat platform, web chat, secure chat, encrypted messaging, team chat',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author = 'Chat App',
  publishedTime,
  modifiedTime
}) => {
  const baseUrl = window.location.origin;
  const canonicalUrl = url.split('?')[0]; // Remove query params for canonical
  
  // Schema.org JSON-LD for rich snippets
  const schemaOrgWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Chat App',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: description,
    url: baseUrl,
    image: `${baseUrl}${image}`,
    author: {
      '@type': 'Organization',
      name: author
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1247'
    },
    featureList: [
      'Real-time messaging',
      'Group chats',
      'File sharing',
      'Emoji support',
      'Secure encryption',
      'Cross-platform',
      'Free forever'
    ]
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chat App',
    url: baseUrl,
    logo: `${baseUrl}/logo512.png`,
    sameAs: [
      'https://twitter.com/chatapp',
      'https://facebook.com/chatapp',
      'https://linkedin.com/company/chatapp'
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="theme-color" content="#6366f1" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Chat App" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Chat App - Real Time Messaging" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:image:secure_url" content={`${baseUrl}${image}`} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Chat App Preview" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@chatapp" />
      <meta name="twitter:creator" content="@chatapp" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />
      <meta name="twitter:image:alt" content="Chat App Screenshot" />
      
      {/* SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="3 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Languages (for future internationalization) */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* DNS Prefetch & Preconnect for Performance */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgWebPage)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;

// Predefined SEO configurations for different pages
export const pageConfigs = {
  home: {
    title: 'Real Time Chat App - Free Secure Messaging & Online Chat Website',
    description: 'Free real-time chat app with secure messaging, group chats, and file sharing. Best online chat website for instant communication. Start chatting now - no credit card required!',
    keywords: 'real time chat app, free chat web app, secure messaging app, online chat website, instant messaging, live chat, web chat',
    type: 'website'
  },
  login: {
    title: 'Login - Free Chat Web App | Secure Messaging',
    description: 'Sign in to your free chat account. Access secure real-time messaging, group chats, and file sharing instantly.',
    keywords: 'login, sign in, chat app login, secure login, messaging login',
    type: 'website'
  },
  register: {
    title: 'Sign Up Free - Real Time Chat App | Secure Messaging',
    description: 'Create your free account for secure real-time chat. Join thousands using our online chat website for instant messaging and group chats.',
    keywords: 'signup, register, create account, free chat app, join chat',
    type: 'website'
  },
  'forgot-password': {
    title: 'Forgot Password - Reset Your Account | Chat App',
    description: 'Reset your Chat App password securely. Enter your email to receive password reset instructions.',
    keywords: 'forgot password, reset password, account recovery, password help',
    type: 'website'
  },
  'reset-password': {
    title: 'Reset Password - Secure Account Recovery | Chat App',
    description: 'Create a new secure password for your Chat App account.',
    keywords: 'reset password, new password, secure password, account recovery',
    type: 'website'
  },
  chat: {
    title: 'Chat - Real Time Messaging & Secure Communication',
    description: 'Your secure conversations. Send messages, share files, and stay connected with real-time chat and instant messaging.',
    keywords: 'messages, conversations, real time chat, instant messaging, secure chat',
    type: 'website'
  }
};
