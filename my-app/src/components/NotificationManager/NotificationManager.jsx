import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNotification } from '../../contexts/NotificationContext';
import './NotificationManager.css';

const NotificationManager = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <ToastContainer position="top-end" className="notification-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          onClose={() => removeNotification(notification.id)}
          show={true}
          delay={notification.duration}
          autohide={notification.duration > 0}
          className={`notification-toast ${notification.type}`}
        >
          <Toast.Header closeButton={true}>
            <span className="notification-icon me-2">
              {getIcon(notification.type)}
            </span>
            <strong className="me-auto">
              {notification.title || 'Notification'}
            </strong>
          </Toast.Header>
          {notification.message && (
            <Toast.Body>
              {notification.message}
            </Toast.Body>
          )}
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationManager;
