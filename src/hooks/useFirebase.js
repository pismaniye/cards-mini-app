import { useState, useEffect } from 'react';
import { auth, saveUserData, loadUserData, authenticateAnonymously } from '../utils/firebase';

const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!auth.currentUser) {
          await authenticateAnonymously();
        }
        setUser(auth.currentUser);
      } catch (error) {
        console.error("Error during authentication:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    initializeAuth();

    return () => unsubscribe();
  }, []);

  const saveData = async (data) => {
    try {
      return await saveUserData(data);
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      return await loadUserData();
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  return { user, loading, error, saveData, loadData };
};

export default useFirebase;