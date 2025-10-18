import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinDepartment: (department: string) => void;
  leaveDepartment: (department: string) => void;
  sendNotification: (data: { department: string; message: string; type: string }) => void;
  updateStory: (data: { storyId: string; department: string; updates: any }) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          userId: user.id,
          department: user.department,
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        
        // Join user's department room
        if (user.department) {
          newSocket.emit('join-department', user.department);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const joinDepartment = (department: string) => {
    if (socket) {
      socket.emit('join-department', department);
    }
  };

  const leaveDepartment = (department: string) => {
    if (socket) {
      socket.emit('leave-department', department);
    }
  };

  const sendNotification = (data: { department: string; message: string; type: string }) => {
    if (socket) {
      socket.emit('send-notification', data);
    }
  };

  const updateStory = (data: { storyId: string; department: string; updates: any }) => {
    if (socket) {
      socket.emit('story-update', data);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinDepartment,
    leaveDepartment,
    sendNotification,
    updateStory,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;