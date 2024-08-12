import React, { useState } from 'react';
import Button from './Button';
import '../styles/components/RepeatSettingsModal.css';

const RepeatSettingsModal = ({ onStart, onClose }) => {
  const [side, setSide] = useState('1');
  const [order, setOrder] = useState('sequential');

  const handleStart = () => {
    onStart({ side, order });
  };

  return (
    <div className="repeat-settings-modal">
      <h2>Repeat Settings</h2>
      <div className="setting">
        <label>Side:</label>
        <select value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="random">Random</option>
        </select>
      </div>
      <div className="setting">
        <label>Word Order:</label>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="sequential">Sequential</option>
          <option value="random">Random</option>
        </select>
      </div>
      <div className="buttons">
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default RepeatSettingsModal;