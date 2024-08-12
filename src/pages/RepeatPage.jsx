import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import '../styles/pages/RepeatPage.css';

const RepeatPage = () => {
  const navigate = useNavigate();
  const { currentList } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([]);

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  useEffect(() => {
    if (currentList && currentList.words && currentList.words.length > 0) {
      setShuffledWords(shuffleArray(currentList.words));
    } else {
      alert('No words in the list. Please add some words before starting repeat mode.');
      navigate(-1);
    }
  }, [currentList, shuffleArray, navigate]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextWord = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setShowAnswer(false);
    } else {
      // End of repeat session
      alert('Congratulations! You\'ve completed the repeat session.');
      navigate(-1);
    }
  };

  const handleExit = () => {
    navigate(-1);
  };

  if (!currentList || !shuffledWords.length) {
    return (
      <div className="repeat-page">
        <h1>No words to repeat</h1>
        <Button onClick={handleExit}>Back to List</Button>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];

  return (
    <div className="repeat-page">
      <h1>Repeat</h1>
      <div className="progress">
        Word {currentIndex + 1} of {shuffledWords.length}
      </div>
      <div className="card">
        <div className="front">{currentWord.front}</div>
        {showAnswer && (
          <div className="back">
            <div>{currentWord.back}</div>
            {currentWord.example && <div className="example">{currentWord.example}</div>}
          </div>
        )}
      </div>
      {!showAnswer ? (
        <Button onClick={handleShowAnswer}>Show Answer</Button>
      ) : (
        <Button onClick={handleNextWord}>
          {currentIndex < shuffledWords.length - 1 ? 'Next Word' : 'Finish'}
        </Button>
      )}
      <Button onClick={handleExit} className="exit-button">Exit Repeat</Button>
    </div>
  );
};

export default RepeatPage;