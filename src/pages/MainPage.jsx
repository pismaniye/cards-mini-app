import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import List from '../components/List';
import RepeatSettingsModal from '../components/RepeatSettingsModal';
import ContextMenu from '../components/ContextMenu';
import '../styles/pages/MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const { lists, setLists, setCurrentList, saveData } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

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

  const handleListClick = useCallback((list) => {
    setCurrentList(list);
    navigate(`/list/${list.id}`);
  }, [navigate, setCurrentList]);

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

  const handleRepeatAll = () => {
    const allWords = lists.flatMap(list => list.words);
    if (allWords.length > 0) {
      setShowRepeatSettings(true);
    } else {
      alert('No words to repeat. Please add some words to your lists first.');
    }
  };

  const handleRepeatSettingsStart = (settings) => {
    setShowRepeatSettings(false);
    const allWords = lists.flatMap(list => list.words);
    if (allWords.length > 0) {
      navigate('/repeat', { state: { settings, words: allWords } });
    } else {
      alert('No words to repeat. Please add some words to your lists first.');
    }
  };

  const handleLongPress = useCallback((event, list) => {
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    if (x !== undefined && y !== undefined) {
      setContextMenu({ x, y, list });
    }
  }, []);

  const handleEdit = (list) => {
    // Implement edit functionality
    setContextMenu(null);
  };

  const handleContextMenuDelete = (list) => {
    handleDeleteList(list);
    setContextMenu(null);
  };

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
        onItemClick={handleListClick}
        onItemLongPress={handleLongPress}
      />
      {showRepeatSettings && (
        <RepeatSettingsModal
          onStart={handleRepeatSettingsStart}
          onClose={() => setShowRepeatSettings(false)}
        />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => handleEdit(contextMenu.list)}
          onDelete={() => handleContextMenuDelete(contextMenu.list)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default MainPage;