import { useState, useEffect } from 'react';

export function useCursorPosition() {
  const [cursorPosition, setCursorPosition] = useState({ cursorX: 0, cursorY: 0 });

  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPosition({ cursorX: e.clientX, cursorY: e.clientY });
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return cursorPosition;
}