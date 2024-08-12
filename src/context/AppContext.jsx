import React, { createContext, useState, useContext } from 'react';
import useTelegramWebApp from '../hooks/useTelegramWebApp';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const telegram = useTelegramWebApp();

  const value = {
    lists,
    setLists,
    currentList,
    setCurrentList,
    currentWord,
    setCurrentWord,
    telegram,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};