import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import List from '../components/List';
import '../styles/pages/MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const { lists, setLists, setCurrentList, telegram } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleAddList = () => {
    setIsAdding(true);
  };

  const handleSaveNewList = () => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        words: []
      };
      setLists([...lists, newList]);
      setNewListName('');
      setIsAdding(false);
      telegram.showAlert('New list created successfully!');
    }
  };

  const handleListClick = (list) => {
    setCurrentList(list);
    navigate(`/list/${list.id}`);
  };

  const handleDeleteList = async (list) => {
    const confirmed = await telegram.showConfirm(`Are you sure you want to delete "${list.name}"?`);
    if (confirmed) {
      setLists(lists.filter(l => l.id !== list.id));
      telegram.showAlert('List deleted successfully!');
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
        <Button onClick={handleAddList} className="add-button">
          Add List
        </Button>
      )}
      <List 
        items={lists}
        renderItem={renderListItem}
        onItemClick={handleListClick}
      />
    </div>
  );
};

export default MainPage;