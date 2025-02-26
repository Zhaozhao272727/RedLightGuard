import React, { useEffect, useRef } from "react";
import "../styles/BackgroundStars.css";

const BackgroundStars = () => {
  const starContainer = useRef(null);

  useEffect(() => {
    if (!starContainer.current) return;

    starContainer.current.innerHTML = ""; // 清空

    const totalStars = 100; // 星星數量
    const stars = Array.from({ length: totalStars }, () => {
      const star = document.createElement("div");
      star.className = "star";

      // ⭐ 隨機位置 (全螢幕隨機)
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;

      // ⭐ 隨機大小 (0.8px - 3px)
      const size = Math.random() * 2.2 + 0.8;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // ✨ 閃爍隨機時間 (2s - 6s) + 延遲 (0s - 5s)
      star.style.animationDuration = `${Math.random() * 4 + 2}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;

      // 🌠 隨機微移動效果 (上漂或下漂)
      star.style.setProperty('--move-x', `${(Math.random() - 0.5) * 4}px`);
      star.style.setProperty('--move-y', `${(Math.random() - 0.5) * 4}px`);

      starContainer.current.appendChild(star);
      return star;
    });

    console.log("🌟 星星隨機分佈並自然閃爍成功！");
    return () => stars.forEach((star) => star.remove());
  }, []);

  return <div className="background-stars" ref={starContainer}></div>;
};

export default BackgroundStars;
