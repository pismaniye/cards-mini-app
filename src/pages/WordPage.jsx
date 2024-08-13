import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import '../styles/pages/WordPage.css';

const WordPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentList, setCurrentList } = useAppContext();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');

  useEffect(() => {
    if (id !== 'new' && currentList) {
      const word = currentList.words.find(w => w.id === id);
      if (word) {
        setFront(word.front);
        setBack(word.back);
        setExample(word.example || '');
      }
    }
  }, [id, currentList]);

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      alert('Both front and back sides are required.');
      return;
    }
    const newWord = { id: id === 'new' ? Date.now().toString() : id, front, back, example };
    let updatedList;
    if (id === 'new') {
      updatedList = {
        ...currentList,
        words: [...currentList.words, newWord]
      };
    } else {
      updatedList = {
        ...currentList,
        words: currentList.words.map(w => w.id === id ? newWord : w)
      };
    }
    setCurrentList(updatedList);
    alert(id === 'new' ? 'New word added successfully!' : 'Word updated successfully!');
    navigate(-1);
  };

  return (
    <div className="word-page">
      <h1>{id === 'new' ? 'Add New Word' : 'Edit Word'}</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Front side"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <input
          type="text"
          placeholder="Back side"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <input
          type="text"
          placeholder="Example (optional)"
          value={example}
          onChange={(e) => setExample(e.target.value)}
        />
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
      </div>
    </div>
  );
};

export default WordPage;