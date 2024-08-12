import React from 'react';
import '../styles/components/Button.css';

const Button = ({ onClick, children, className = '', isFab = false }) => {
  return (
    <button 
      className={`button ${isFab ? 'fab' : ''} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;