import React, { useEffect } from "react";
import "../styles/BubbleBackground.css";

const BubbleBackground = () => {
  useEffect(() => {
    const bubbleContainer = document.querySelector(".bubble-background");

    const createBubble = () => {
      const bubble = document.createElement("span");
      const size = Math.random() * 60 + 20; // 泡泡大小 20px ~ 80px
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${Math.random() * 3 + 4}s`; // 上升速度

      bubbleContainer.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 7000); // 泡泡存在時間
    };

    const bubbleInterval = setInterval(createBubble, 500); // 泡泡生成頻率

    return () => clearInterval(bubbleInterval); // 清理定時器
  }, []);

  return <div className="bubble-background"></div>;
};

export default BubbleBackground;
