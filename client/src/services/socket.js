/**
 * Socket Service
 * Handles Socket.IO connection and events
 */

import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket;

export const initializeSocket = () => {
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    socket = initializeSocket();
  }
  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

const socketService = {
  initializeSocket,
  getSocket,
  connectSocket,
  disconnectSocket,
};

export default socketService;
