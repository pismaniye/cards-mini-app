import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
    }
  };

  const saveData = useCallback(async () => {
    try {
      await firebase.saveData({ lists });
      console.log('Data saved successfully');
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  }, [firebase, lists]);

  const updateLists = useCallback((newLists) => {
    setLists(newLists);
    saveData();
  }, [saveData]);

  const updateCurrentList = useCallback((updatedList) => {
    setCurrentList(updatedList);
    setLists(prevLists => prevLists.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
    saveData();
  }, [saveData]);

  const value = {
    lists,
    setLists: updateLists,
    currentList,
    setCurrentList: updateCurrentList,
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