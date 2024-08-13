import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import List from '../components/List';
import RepeatSettingsModal from '../components/RepeatSettingsModal';
import ContextMenu from '../components/ContextMenu';
import useLongPress from '../utils/longpress';
import '../styles/pages/ListPage.css';

const ListPage = () => {
  const navigate = useNavigate();
  const { currentList, setCurrentWord, lists, setLists, saveData } = useAppContext();
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const handleAddWord = () => {
    navigate('/word/new');
  };

  const handleWordClick = (word) => {
    setCurrentWord(word);
    navigate(`/word/${word.id}`);
  };

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
      const updatedLists = lists.map(list =>
        list.id === currentList.id ? updatedList : list
      );
      setLists(updatedLists);
      try {
        await saveData();
        alert('Word deleted successfully!');
      } catch (error) {
        alert('Error deleting word: ' + error.message);
      }
    }
  };

  const handleLongPress = useCallback((event, word) => {
    setContextMenu({
      x: event.clientX || event.touches[0].clientX,
      y: event.clientY || event.touches[0].clientY,
      word
    });
  }, []);

  const handleEdit = (word) => {
    setCurrentWord(word);
    navigate(`/word/${word.id}`);
    setContextMenu(null);
  };

  const handleContextMenuDelete = (word) => {
    handleDeleteWord(word);
    setContextMenu(null);
  };

  const renderWordItem = (word) => {
    const longPressEvent = useLongPress(
      (event) => handleLongPress(event, word),
      () => handleWordClick(word),
      { shouldPreventDefault: true, delay: 500 }
    );

    return (
      <div className="word-item" {...longPressEvent}>
        <span>{word.front}</span>
        <span>{word.back}</span>
      </div>
    );
  };

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
        renderItem={renderWordItem}
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
          onEdit={() => handleEdit(contextMenu.word)}
          onDelete={() => handleContextMenuDelete(contextMenu.word)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default ListPage;