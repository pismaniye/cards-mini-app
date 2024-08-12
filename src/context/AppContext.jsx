import React, { createContext, useState, useContext, useEffect } from 'react';
import useFirebase from '../hooks/useFirebase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const firebase = useFirebase();

  useEffect(() => {
    if (!firebase.loading && firebase.user) {
      loadData();
    }
  }, [firebase.loading, firebase.user]);

  const loadData = async () => {
    try {
      const data = await firebase.loadData();
      if (data && data.lists) {
        setLists(data.lists);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Здесь вы можете добавить обработку ошибок, например, показать уведомление пользователю
    }
  };

  const saveData = async () => {
    try {
      await firebase.saveData({ lists });
    } catch (error) {
      console.error("Error saving data:", error);
      // Здесь вы можете добавить обработку ошибок, например, показать уведомление пользователю
    }
  };

  const value = {
    lists,
    setLists,
    currentList,
    setCurrentList,
    currentWord,
    setCurrentWord,
    saveData,
    loadData,
    firebase,
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