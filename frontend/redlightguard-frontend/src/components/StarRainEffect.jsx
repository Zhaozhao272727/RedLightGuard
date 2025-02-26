// components/StarRainEffect.jsx
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const StarRainEffect = ({ trigger }) => {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.2 },
        shapes: ['star'],
        colors: ['#FFD700', '#FF69B4', '#87CEFA', '#FFB6C1', '#FFF'],
      });
    }
  }, [trigger]);

  return null; // 此元件僅負責觸發動畫，無需渲染內容
};

export default StarRainEffect;
