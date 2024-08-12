import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import List from '../components/List';
import '../styles/pages/ListPage.css';

const ListPage = () => {
  const navigate = useNavigate();
  const { currentList, setCurrentWord, lists, setLists, saveData } = useAppContext();

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
      navigate('/repeat');
    }
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

  const renderWordItem = (word) => (
    <div className="word-item">
      <span>{word.front}</span>
      <span>{word.back}</span>
      <Button onClick={() => handleDeleteWord(word)} className="delete-button">Delete</Button>
    </div>
  );

  if (!currentList) {
    return <div>No list selected</div>;
  }

  return (
    <div className="list-page">
      <h1>{currentList.name}</h1>
      <Button onClick={handleStartRepeat} className="repeat-button">
        Start Repeat
      </Button>
      <List 
        items={currentList.words}
        renderItem={renderWordItem}
        onItemClick={handleWordClick}
      />
      <Button onClick={handleAddWord} className="add-button">
        Add Word
      </Button>
    </div>
  );
};

export default ListPage;