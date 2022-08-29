import { createContext, useState } from "react";

const NotificationContext = createContext({
  notification: null, // { title, message, status }
  showNotification: function(notificationData) {},
  hideNotification: function() {},
});

export function NotificationContextProvider(props) {
  const [activeNotification, setActiveNotification] = useState();

  function showNotificationHandler(notificationData) {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  const context = { 
    notification: activeNotification, 
    showNotification: showNotificationHandler, 
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={context}>
      {/* allows you to call notification context function from any components encapsulated by this notifications context provider */}
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext;