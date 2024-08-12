import React from 'react';
import '../styles/components/Button.css';

const Button = ({ onClick, children, className = '' }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;