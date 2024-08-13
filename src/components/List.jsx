import React from 'react';
import ListItem from './ListItem';
import '../styles/components/List.css';

const List = ({ items, onItemClick, onItemLongPress }) => {
  return (
    <ul className="list">
      {items.map((item) => (
        <ListItem 
          key={item.id}
          item={item} 
          onClick={onItemClick}
          onLongPress={onItemLongPress}
        />
      ))}
    </ul>
  );
};

export default List;