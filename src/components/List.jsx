import React from 'react';
import '../styles/components/List.css';

const List = ({ items, renderItem, onItemClick }) => {
  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={item.id || index} onClick={() => onItemClick(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
};

export default List;