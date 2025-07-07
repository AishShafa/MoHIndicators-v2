import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasNewData, setHasNewData] = useState(false);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, [removeNotification]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const notifyNewData = useCallback(() => {
    setHasNewData(true);
    addNotification({
      type: 'success',
      title: '🎉 New Health Data Available!',
      message: 'New health data reports have been added to the system.',
      duration: 5000
    });
  }, [addNotification]);

  const markDataAsViewed = useCallback(() => {
    setHasNewData(false);
  }, []);

  const value = {
    notifications,
    hasNewData,
    addNotification,
    removeNotification,
    clearAllNotifications,
    notifyNewData,
    markDataAsViewed
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
