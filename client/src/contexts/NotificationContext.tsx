import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useSocket } from './SocketContext';

// Types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  department?: string;
  storyId?: string;
  userId?: string;
  actionUrl?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationContextType extends NotificationState {
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

// Action Types
type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'SET_ERROR'; payload: string };

// Initial State
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
        isLoading: false,
        error: null,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0,
      };
    case 'DELETE_NOTIFICATION':
      const notificationToDelete = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: notificationToDelete && !notificationToDelete.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider Component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { socket } = useSocket();

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification: Notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });

      socket.on('story-updated', (data: { storyId: string; department: string }) => {
        const notification: Notification = {
          id: `story-${data.storyId}-${Date.now()}`,
          title: 'Story Updated',
          message: `A story has been updated in the ${data.department} department`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
          department: data.department,
          storyId: data.storyId,
          actionUrl: `/${data.department}/${data.storyId}`,
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });

      return () => {
        socket.off('notification');
        socket.off('story-updated');
      };
    }
  }, [socket]);

  const loadNotifications = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Mock data - replace with API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Story Approved',
          message: 'Your story "Breaking: Major Economic Policy Change" has been approved',
          type: 'success',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          department: 'input',
          storyId: '1',
          actionUrl: '/input/1',
        },
        {
          id: '2',
          title: 'New Assignment',
          message: 'You have been assigned to review a story in the output department',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          department: 'output',
          actionUrl: '/output',
        },
        {
          id: '3',
          title: 'Deadline Reminder',
          message: 'Story "Local Sports Team Wins Championship" is due for review in 2 hours',
          type: 'warning',
          read: true,
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          department: 'input',
          storyId: '2',
          actionUrl: '/input/2',
        },
      ];
      
      dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load notifications' });
    }
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const deleteNotification = (notificationId: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const value: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;