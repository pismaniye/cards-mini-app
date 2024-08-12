import { useState, useEffect } from 'react';

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    const initTelegramWebApp = () => {
      const tg = window.Telegram.WebApp;
      if (tg) {
        tg.ready();
        setWebApp(tg);
      }
    };

    if (window.Telegram) {
      initTelegramWebApp();
    } else {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = initTelegramWebApp;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const showAlert = (message) => {
    if (webApp && webApp.version >= 6.0) {
      // For Telegram Mini App environment
      console.log('Alert:', message);
      // You might want to implement a custom alert component here
    } else {
      // For development environment
      alert(message);
    }
  };

  const showConfirm = (message) => {
    if (webApp && webApp.version >= 6.0) {
      // For Telegram Mini App environment
      console.log('Confirm:', message);
      // You might want to implement a custom confirm component here
      return Promise.resolve(true); // Always return true for now
    } else {
      // For development environment
      return new Promise((resolve) => {
        const result = window.confirm(message);
        resolve(result);
      });
    }
  };

  const closeApp = () => {
    webApp && webApp.close();
  };

  const setBackgroundColor = (color) => {
    webApp && webApp.setBackgroundColor(color);
  };

  const setHeaderColor = (color) => {
    webApp && webApp.setHeaderColor(color);
  };

  return { 
    webApp, 
    showAlert, 
    showConfirm, 
    closeApp,
    setBackgroundColor,
    setHeaderColor,
    // Add any other Telegram-specific functions here
  };
};

export default useTelegramWebApp;