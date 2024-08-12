import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import List from '../components/List';
import RepeatSettingsModal from '../components/RepeatSettingsModal';
import '../styles/pages/MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const { lists, setLists, setCurrentList, saveData } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);

  const handleAddList = () => {
    setIsAdding(true);
  };

  const handleSaveNewList = async () => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        words: []
      };
      const updatedLists = [...lists, newList];
      setLists(updatedLists);
      setNewListName('');
      setIsAdding(false);
      try {
        await saveData();
        alert('New list created successfully!');
      } catch (error) {
        alert('Error saving new list: ' + error.message);
      }
    }
  };

  const handleListClick = (list) => {
    setCurrentList(list);
    navigate(`/list/${list.id}`);
  };

  const handleDeleteList = async (list) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${list.name}"?`);
    if (confirmed) {
      const updatedLists = lists.filter(l => l.id !== list.id);
      setLists(updatedLists);
      try {
        await saveData();
        alert('List deleted successfully!');
      } catch (error) {
        alert('Error deleting list: ' + error.message);
      }
    }
  };

  const getAllWords = useCallback(() => {
    return lists.flatMap(list => list.words);
  }, [lists]);

  const handleRepeatAll = () => {
    const allWords = getAllWords();
    if (allWords.length > 0) {
      setShowRepeatSettings(true);
    } else {
      alert('No words to repeat. Please add some words to your lists first.');
    }
  };

  const handleRepeatSettingsStart = (settings) => {
    setShowRepeatSettings(false);
    const allWords = getAllWords();
    if (allWords.length > 0) {
      navigate('/repeat', { state: { settings, words: allWords } });
    } else {
      alert('No words to repeat. Please add some words to your lists first.');
    }
  };

  const renderListItem = (list) => (
    <div className="list-item">
      <span>{list.name}</span>
      <span>{list.words.length} cards</span>
      <Button onClick={() => handleDeleteList(list)} className="delete-button">Delete</Button>
    </div>
  );

  return (
    <div className="main-page">
      <h1>Lists</h1>
      <Button onClick={handleRepeatAll} className="repeat-all-button">Repeat All</Button>
      {isAdding ? (
        <div className="add-list-form">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name"
          />
          <Button onClick={handleSaveNewList}>Save</Button>
          <Button onClick={() => setIsAdding(false)}>Cancel</Button>
        </div>
      ) : (
        <Button onClick={handleAddList} className="fab">+</Button>
      )}
      <List
        items={lists}
        renderItem={renderListItem}
        onItemClick={handleListClick}
      />
      {showRepeatSettings && (
        <RepeatSettingsModal
          onStart={handleRepeatSettingsStart}
          onClose={() => setShowRepeatSettings(false)}
        />
      )}
    </div>
  );
};

export default MainPage;