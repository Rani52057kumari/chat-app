/**
 * API Service
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication APIs
 */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  searchUsers: (search) => api.get(`/auth/users?search=${search}`),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
};

/**
 * Chat APIs
 */
export const chatAPI = {
  accessChat: (userId) => api.post('/chats', { userId }),
  fetchChats: () => api.get('/chats'),
  createGroupChat: (data) => api.post('/chats/group', data),
  renameGroup: (data) => api.put('/chats/group/rename', data),
  addToGroup: (data) => api.put('/chats/group/add', data),
  removeFromGroup: (data) => api.put('/chats/group/remove', data),
};

/**
 * Message APIs
 */
export const messageAPI = {
  sendMessage: (data) => {
    const formData = new FormData();
    formData.append('chatId', data.chatId);
    if (data.content) formData.append('content', data.content);
    if (data.file) formData.append('file', data.file);

    return api.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getMessages: (chatId) => api.get(`/messages/${chatId}`),
  markAsRead: (messageId) => api.put(`/messages/read/${messageId}`),
  markChatAsRead: (chatId) => api.put(`/messages/read/chat/${chatId}`),
};

export default api;
