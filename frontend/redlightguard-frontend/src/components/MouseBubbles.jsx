import React, { useEffect } from 'react';
import "../styles/MouseBubbles.css";

const MouseBubbles = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const bubble = document.createElement('div');
      bubble.className = 'mouse-bubble';
      bubble.style.left = `${e.clientX}px`;
      bubble.style.top = `${e.clientY}px`;
      document.body.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 800); // 泡泡存在時間
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null; // 泡泡是直接加到 body 的
};

export default MouseBubbles;
