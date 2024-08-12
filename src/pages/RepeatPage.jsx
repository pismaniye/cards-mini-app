import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import '../styles/pages/RepeatPage.css';

const RepeatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentList } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [words, setWords] = useState([]);
  const [settings, setSettings] = useState({ side: '1', order: 'sequential' });
  const [dontKnowClicked, setDontKnowClicked] = useState(false);

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  useEffect(() => {
    if (location.state && location.state.settings) {
      setSettings(location.state.settings);
    }

    if (currentList && currentList.words && currentList.words.length > 0) {
      let initialWords = currentList.words;
      if (settings.order === 'random') {
        initialWords = shuffleArray(initialWords);
      }
      setWords(initialWords);
    } else {
      alert('No words in the list. Please add some words before starting repeat mode.');
      navigate(-1);
    }
  }, [currentList, shuffleArray, navigate, location.state, settings.order]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleKnow = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setShowAnswer(false);
      setDontKnowClicked(false);
    } else {
      // All words have been reviewed
      alert('Congratulations! You\'ve completed all words.');
      navigate(-1);
    }
  };

  const handleDontKnow = () => {
    if (!dontKnowClicked && currentIndex < words.length) {
      setShowAnswer(true);
      setDontKnowClicked(true);
      // Add the current word to the end of the list
      setWords(prevWords => [...prevWords, prevWords[currentIndex]]);
    }
  };

  const handleExit = () => {
    navigate(-1);
  };

  if (!currentList || words.length === 0) {
    return (
      <div className="repeat-page">
        <h1>No words to repeat</h1>
        <Button onClick={handleExit}>Back to List</Button>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  if (!currentWord) {
    return (
      <div className="repeat-page">
        <h1>All words completed</h1>
        <Button onClick={handleExit}>Back to List</Button>
      </div>
    );
  }

  const frontSide = settings.side === 'random' ? (Math.random() < 0.5 ? 'front' : 'back') : (settings.side === '1' ? 'front' : 'back');
  const backSide = frontSide === 'front' ? 'back' : 'front';

  return (
    <div className="repeat-page">
      <h1>Repeat</h1>
      <div className="progress">
        Word {currentIndex + 1} of {words.length}
      </div>
      <div className="card">
        <div className="front">{currentWord[frontSide]}</div>
        {showAnswer && (
          <div className="back">
            <div>{currentWord[backSide]}</div>
            {currentWord.example && <div className="example">{currentWord.example}</div>}
          </div>
        )}
      </div>
      <div className="buttons">
        <Button onClick={handleKnow} disabled={currentIndex >= words.length}>Know</Button>
        <Button onClick={handleDontKnow} disabled={dontKnowClicked || currentIndex >= words.length}>Don't Know</Button>
      </div>
      <Button onClick={handleExit} className="exit-button">Exit Repeat</Button>
    </div>
  );
};

export default RepeatPage;