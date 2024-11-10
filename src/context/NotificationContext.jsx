import PropTypes from 'prop-types';
import React, { useMemo, useContext, useCallback, createContext, } from 'react';

import { Alert, Slide, Snackbar } from '@mui/material';

const NotificationContext = createContext({});

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = React.useState([]);

  const showNotification = useCallback((message, options = {}) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      severity: options.severity || 'info',
      autoHideDuration: options.autoHideDuration || 2000,
      ...options,

    };

    setNotifications(prev => [...prev, notification]);
    return id;
  }, []);

  const closeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const value = useMemo(() => ({ showNotification, closeNotification }), [showNotification, closeNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open
          autoHideDuration={notification.autoHideDuration}
          onClose={() => closeNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}

        >
          <Alert
            variant="filled"
            severity={notification.severity}
            onClose={() => closeNotification(notification.id)}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use notifications
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}



// examples of using notifications:
// function OtherComponent() {
//   const { showNotification } = useNotification();

//   const handleSuccess = () => {
//     showNotification('Operation completed successfully', {
//       severity: 'success',
//       autoHideDuration: 4000,
//     });
//   };

//   const handleError = () => {
//     showNotification('An error occurred', {
//       severity: 'error',
//       autoHideDuration: 6000,
//     });
//   };

//   const handleInfo = () => {
//     showNotification('Please wait while we process your request', {
//       severity: 'info',
//       autoHideDuration: 3000,
//     });
//   };

//   const handleWarning = () => {
//     showNotification('Please save your changes before leaving', {
//       severity: 'warning',
//       autoHideDuration: 5000,
//     });
//   };

//   return (
//     <div>
//       <Button onClick={handleSuccess}>Show Success</Button>
//       <Button onClick={handleError}>Show Error</Button>
//       <Button onClick={handleInfo}>Show Info</Button>
//       <Button onClick={handleWarning}>Show Warning</Button>
//     </div>
//   );
// }