import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import List from '../components/List';
import RepeatSettingsModal from '../components/RepeatSettingsModal';
import ContextMenu from '../components/ContextMenu';
import '../styles/pages/ListPage.css';

const ListPage = () => {
  const navigate = useNavigate();
  const { currentList, setCurrentWord, setCurrentList } = useAppContext();
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const handleAddWord = () => {
    navigate('/word/new');
  };

  const handleWordClick = useCallback((word) => {
    if (word && word.id) {
      setCurrentWord(word);
      navigate(`/word/${word.id}`);
    }
  }, [navigate, setCurrentWord]);

  const handleStartRepeat = () => {
    if (currentList.words.length === 0) {
      alert('Add some words to the list before starting repeat mode.');
    } else {
      setShowRepeatSettings(true);
    }
  };

  const handleRepeatSettingsStart = (settings) => {
    setShowRepeatSettings(false);
    navigate('/repeat', { state: { settings, words: currentList.words } });
  };

  const handleDeleteWord = async (word) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${word.front}"?`);
    if (confirmed) {
      const updatedList = {
        ...currentList,
        words: currentList.words.filter(w => w.id !== word.id)
      };
      setCurrentList(updatedList);
    }
  };

  const handleLongPress = useCallback((event, word) => {
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    if (x !== undefined && y !== undefined) {
      setContextMenu({ x, y, word });
    }
  }, []);

  const handleBackToMain = () => {
    navigate('/');
  };

  if (!currentList) {
    return <div>No list selected</div>;
  }

  return (
    <div className="list-page">
      <Button onClick={handleBackToMain} className="back-button">Back to Main</Button>
      <h1>{currentList.name}</h1>
      <Button onClick={handleStartRepeat} className="repeat-button">
        Start Repeat
      </Button>
      <List
        items={currentList.words}
        onItemClick={handleWordClick}
        onItemLongPress={handleLongPress}
      />
      <Button onClick={handleAddWord} className="fab">
        +
      </Button>
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
          onEdit={() => handleWordClick(contextMenu.word)}
          onDelete={() => handleDeleteWord(contextMenu.word)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default ListPage;