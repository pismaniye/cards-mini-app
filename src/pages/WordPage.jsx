import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import '../styles/pages/WordPage.css';

const WordPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentList, currentWord, setCurrentWord, lists, setLists, saveData } = useAppContext();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [example, setExample] = useState('');

  useEffect(() => {
    if (id !== 'new' && currentWord) {
      setFront(currentWord.front);
      setBack(currentWord.back);
      setExample(currentWord.example || '');
    }
  }, [id, currentWord]);

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      alert('Both front and back sides are required.');
      return;
    }

    const newWord = { id: id === 'new' ? Date.now().toString() : currentWord.id, front, back, example };
    let updatedList;
    if (id === 'new') {
      updatedList = {
        ...currentList,
        words: [...currentList.words, newWord]
      };
    } else {
      updatedList = {
        ...currentList,
        words: currentList.words.map(w => w.id === currentWord.id ? newWord : w)
      };
    }

    const updatedLists = lists.map(list => 
      list.id === currentList.id ? updatedList : list
    );

    setLists(updatedLists);
    setCurrentWord(null);

    try {
      await saveData();
      alert(id === 'new' ? 'New word added successfully!' : 'Word updated successfully!');
      navigate(-1);
    } catch (error) {
      alert('Error saving word: ' + error.message);
    }
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