
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getUserNotifications: (userId: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem('taskapp_notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    }
  }, [user]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('taskapp_notifications', JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const unreadCount = notifications.filter(n => !n.isRead && user && n.userId === user.id).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);

    if (user && user.id === notificationData.userId) {
      toast({
        title: "New Notification",
        description: getNotificationMessage(newNotification),
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    setNotifications(prev =>
      prev.map(notification =>
        notification.userId === user.id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const getUserNotifications = (userId: string) => {
    return notifications.filter(n => n.userId === userId);
  };

  const getNotificationMessage = (notification: Notification) => {
    switch(notification.type) {
      case 'task_assigned':
        return 'You have been assigned a new task';
      case 'task_updated':
        return 'A task assigned to you has been updated';
      case 'task_completed':
        return 'A task has been marked as completed';
      default:
        return 'New notification';
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        getUserNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
