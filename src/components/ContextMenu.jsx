import React from 'react';
import '../styles/components/ContextMenu.css';

const ContextMenu = ({ x, y, onEdit, onDelete, onClose }) => {
  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ContextMenu;