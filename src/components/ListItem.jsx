import React from 'react';
import useLongPress from '../utils/longpress';
import '../styles/components/ListItem.css';

const ListItem = ({ item, onClick, onLongPress }) => {
  const longPressEvent = useLongPress(
    (event) => onLongPress(event, item),
    () => onClick(item),
    { shouldPreventDefault: true, delay: 500 }
  );

  const isWord = 'front' in item && 'back' in item;
  const classList = `list-item ${isWord ? 'word' : 'list'}`;

  return (
    <li className={classList} {...longPressEvent}>
      {isWord ? (
        <>
          <span>{item.front}</span>
          <span>{item.back}</span>
        </>
      ) : (
        <>
          <span>{item.name}</span>
          <span>{item.words ? `${item.words.length} cards` : ''}</span>
        </>
      )}
    </li>
  );
};

export default ListItem;