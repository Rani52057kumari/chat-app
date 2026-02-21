/**
 * Chat Context
 * Manages chat and messaging state
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { chatAPI, messageAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { getSocket } from '../services/socket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = getSocket();

  /**
   * Fetch all chats
   */
  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await chatAPI.fetchChats();
      if (data.success) {
        setChats(data.data);
      }
    } catch (error) {
      console.error('Fetch chats error:', error);
      toast.error('Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Access or create one-to-one chat
   */
  const accessChat = async (userId) => {
    try {
      const { data } = await chatAPI.accessChat(userId);
      if (data.success) {
        // Check if chat already exists in state
        const chatExists = chats.find(c => c._id === data.data._id);
        if (!chatExists) {
          setChats([data.data, ...chats]);
        }
        setSelectedChat(data.data);
        return data.data;
      }
    } catch (error) {
      console.error('Access chat error:', error);
      toast.error('Failed to access chat');
    }
  };

  /**
   * Create group chat
   */
  const createGroupChat = async (name, users) => {
    try {
      const { data } = await chatAPI.createGroupChat({
        name,
        users: JSON.stringify(users)
      });
      
      if (data.success) {
        setChats([data.data, ...chats]);
        toast.success(data.message);
        return data.data;
      }
    } catch (error) {
      console.error('Create group chat error:', error);
      toast.error('Failed to create group chat');
    }
  };

  /**
   * Fetch messages for selected chat
   */
  const fetchMessages = async (chatId) => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      const { data } = await messageAPI.getMessages(chatId);
      if (data.success) {
        setMessages(data.data);
        // Mark chat as read
        await messageAPI.markChatAsRead(chatId);
      }
    } catch (error) {
      console.error('Fetch messages error:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send message
   */
  const sendMessage = async (content, file = null) => {
    if (!selectedChat) return;

    try {
      const { data } = await messageAPI.sendMessage({
        chatId: selectedChat._id,
        content,
        file
      });

      if (data.success) {
        const newMessage = data.data;
        setMessages([...messages, newMessage]);
        
        // Update latest message in chat list
        setChats(chats.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, latestMessage: newMessage }
            : chat
        ));

        // Emit socket event
        socket.emit('new-message', newMessage);
        
        return newMessage;
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    }
  };

  /**
   * Delete chat
   */
  const deleteChat = (chatId) => {
    setChats(chats.filter(chat => chat._id !== chatId));
    if (selectedChat?._id === chatId) {
      setSelectedChat(null);
      setMessages([]);
    }
  };

  /**
   * Handle incoming messages via socket
   */
  useEffect(() => {
    if (!socket || !user) return;

    socket.on('message-received', (message) => {
      // If message is for selected chat, add to messages
      if (selectedChat && message.chat._id === selectedChat._id) {
        setMessages(prev => [...prev, message]);
        // Mark as read
        messageAPI.markAsRead(message._id).catch(console.error);
      } else {
        // Add to notifications
        setNotification(prev => [...prev, message]);
      }

      // Update chat list with latest message
      setChats(prev => 
        prev.map(chat => 
          chat._id === message.chat._id 
            ? { ...chat, latestMessage: message }
            : chat
        )
      );
    });

    socket.on('typing', ({ chatId, userId }) => {
      setTypingUsers(prev => ({ ...prev, [chatId]: userId }));
    });

    socket.on('stop-typing', ({ chatId }) => {
      setTypingUsers(prev => {
        const newState = { ...prev };
        delete newState[chatId];
        return newState;
      });
    });

    socket.on('user-online', (userId) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
    });

    socket.on('user-offline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    return () => {
      socket.off('message-received');
      socket.off('typing');
      socket.off('stop-typing');
      socket.off('user-online');
      socket.off('user-offline');
    };
  }, [socket, selectedChat, user]);

  const value = {
    chats,
    selectedChat,
    setSelectedChat,
    messages,
    loading,
    notification,
    setNotification,
    typingUsers,
    onlineUsers,
    fetchChats,
    accessChat,
    createGroupChat,
    fetchMessages,
    sendMessage,
    deleteChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
