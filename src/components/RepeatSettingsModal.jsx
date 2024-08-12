import React, { useState } from 'react';
import Button from './Button';
import '../styles/components/RepeatSettingsModal.css';

const RepeatSettingsModal = ({ onStart, onClose }) => {
  const [settings, setSettings] = useState({
    side1: true,
    side2: false,
    random: false,
    sequential: true,
    shuffle: false
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;
    if (name === 'side1' || name === 'side2' || name === 'random') {
      setSettings(prev => ({
        ...prev,
        side1: name === 'side1' ? checked : false,
        side2: name === 'side2' ? checked : false,
        random: name === 'random' ? checked : false
      }));
    } else if (name === 'sequential' || name === 'shuffle') {
      setSettings(prev => ({
        ...prev,
        sequential: name === 'sequential' ? checked : false,
        shuffle: name === 'shuffle' ? checked : false
      }));
    }
  };

  const handleStart = () => {
    const side = settings.random ? 'random' : (settings.side1 ? '1' : '2');
    const order = settings.shuffle ? 'random' : 'sequential';
    onStart({ side, order });
  };

  return (
    <div className="repeat-settings-modal-overlay">
      <div className="repeat-settings-modal">
        <h2>Repeat Settings</h2>
        <div className="setting">
          <h3>Side:</h3>
          <label>
            <input
              type="checkbox"
              name="side1"
              checked={settings.side1}
              onChange={handleChange}
            />
            Side 1
          </label>
          <label>
            <input
              type="checkbox"
              name="side2"
              checked={settings.side2}
              onChange={handleChange}
            />
            Side 2
          </label>
          <label>
            <input
              type="checkbox"
              name="random"
              checked={settings.random}
              onChange={handleChange}
            />
            Random
          </label>
        </div>
        <div className="setting">
          <h3>Order:</h3>
          <label>
            <input
              type="checkbox"
              name="sequential"
              checked={settings.sequential}
              onChange={handleChange}
            />
            Sequential
          </label>
          <label>
            <input
              type="checkbox"
              name="shuffle"
              checked={settings.shuffle}
              onChange={handleChange}
            />
            Shuffle
          </label>
        </div>
        <div className="buttons">
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default RepeatSettingsModal;