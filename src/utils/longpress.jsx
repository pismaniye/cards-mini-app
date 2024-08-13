import { useCallback, useRef } from 'react';

export const useLongPress = (onLongPress, onClick, { shouldPreventDefault = true, delay = 300 } = {}) => {
  const timeout = useRef();
  const target = useRef();

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, {
          passive: false
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && event.target === target.current && onClick();
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault);
      }
    },
    [shouldPreventDefault, onClick]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e)
  };
};

const isTouchEvent = (event) => {
  return 'touches' in event;
};

const preventDefault = (event) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongPress;