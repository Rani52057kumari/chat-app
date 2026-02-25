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
  const [unreadCounts, setUnreadCounts] = useState({}); // Track unread per chat
  const [toastNotification, setToastNotification] = useState(null); // Current toast
  const socket = getSocket();

  /**
   * Request browser notification permission
   */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
        users
      });
      
      if (data.success) {
        setChats([data.data, ...chats]);
        toast.success(data.message);
        return data.data;
      }
    } catch (error) {
      console.error('Create group chat error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create group chat';
      toast.error(errorMessage);
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
        const fetchedMessages = data.data;
        setMessages(fetchedMessages);
        
        // Mark chat as read
        await messageAPI.markChatAsRead(chatId);
        
        // Emit socket events for unread messages to notify senders
        fetchedMessages.forEach((message) => {
          // Only for messages from others that user hasn't read yet
          if (message.sender._id !== user._id) {
            const hasRead = message.readBy?.some(r => r.user === user._id);
            if (!hasRead) {
              socket.emit('message-read', {
                messageId: message._id,
                chatId: chatId,
                userId: user._id,
                senderId: message.sender._id
              });
            }
          }
        });
        
        // Clear unread count
        setUnreadCounts(prev => {
          const newCounts = { ...prev };
          delete newCounts[chatId];
          return newCounts;
        });
        // Remove notifications for this chat
        setNotification(prev => prev.filter(notif => notif.chat._id !== chatId));
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
   * Leave group
   */
  const leaveGroup = async (chatId, userId) => {
    try {
      const { data } = await chatAPI.removeFromGroup({
        chatId,
        userId
      });

      if (data.success) {
        // Remove group from chat list
        setChats(chats.filter(chat => chat._id !== chatId));
        
        // Deselect chat if it's currently selected
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
          setMessages([]);
        }

        toast.success('Left group successfully');
        return true;
      }
    } catch (error) {
      console.error('Leave group error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to leave group';
      toast.error(errorMessage);
      return false;
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
        // Increment unread count
        setUnreadCounts(prev => ({
          ...prev,
          [message.chat._id]: (prev[message.chat._id] || 0) + 1
        }));
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

    // Listen for notification events
    socket.on('newMessageNotification', (notifData) => {
      // Don't show notification if user is on the same chat
      if (selectedChat && selectedChat._id === notifData.chatId) {
        return;
      }

      // Show in-app toast
      setToastNotification(notifData);

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const notification = new Notification(notifData.senderName, {
            body: notifData.messagePreview,
            icon: notifData.senderAvatar || '/logo192.png',
            tag: notifData.chatId, // Prevents duplicate notifications
            requireInteraction: false
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
            // Find and select the chat
            const chat = chats.find(c => c._id === notifData.chatId);
            if (chat) {
              setSelectedChat(chat);
            }
          };

          // Auto close after 5 seconds
          setTimeout(() => notification.close(), 5000);
        } catch (error) {
          console.error('Browser notification error:', error);
        }
      }
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

    // Handle message seen updates
    socket.on('message-seen', ({ messageId, chatId, readerId }) => {
      // Update message in messages list
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId
            ? {
                ...msg,
                readBy: msg.readBy.some(r => r.user === readerId)
                  ? msg.readBy
                  : [...(msg.readBy || []), { user: readerId, readAt: new Date() }]
              }
            : msg
        )
      );

      // Update latest message in chat list
      setChats(prev =>
        prev.map(chat =>
          chat._id === chatId && chat.latestMessage?._id === messageId
            ? {
                ...chat,
                latestMessage: {
                  ...chat.latestMessage,
                  readBy: chat.latestMessage.readBy.some(r => r.user === readerId)
                    ? chat.latestMessage.readBy
                    : [...(chat.latestMessage.readBy || []), { user: readerId, readAt: new Date() }]
                }
              }
            : chat
        )
      );
    });

    // Handle group creation events
    socket.on('group-created', (newGroup) => {
      // Add new group to chat list if user is a member
      setChats(prev => {
        const exists = prev.some(chat => chat._id === newGroup._id);
        if (exists) return prev;
        return [newGroup, ...prev];
      });
      
      // Show notification if user didn't create this group
      if (newGroup.groupAdmin._id !== user._id) {
        toast.info(`You were added to group: ${newGroup.chatName}`);
      }
    });

    // Handle user left group
    socket.on('left-group', ({ chatId, userId }) => {
      if (userId === user._id) {
        // Remove group from chat list
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        
        // Deselect if currently viewing
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
          setMessages([]);
        }
      }
    });

    return () => {
      socket.off('message-received');
      socket.off('newMessageNotification');
      socket.off('typing');
      socket.off('stop-typing');
      socket.off('user-online');
      socket.off('user-offline');
      socket.off('message-seen');
      socket.off('group-created');
      socket.off('left-group');
    };
  }, [socket, selectedChat, user, chats]);

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
    unreadCounts,
    toastNotification,
    setToastNotification,
    fetchChats,
    accessChat,
    createGroupChat,
    fetchMessages,
    sendMessage,
    deleteChat,
    leaveGroup,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
