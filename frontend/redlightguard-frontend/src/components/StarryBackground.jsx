import React, { useEffect } from "react";
import "../styles/StarryBackground.css";

const StarryBackground = () => {
  useEffect(() => {
    const starContainer = document.querySelector(".starry-background");

    for (let i = 0; i < 50; i++) { // 產生 50 顆星
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 5 + 5}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;

      starContainer.appendChild(star);
    }

    return () => starContainer.innerHTML = ""; // 清理星星
  }, []);

  return <div className="starry-background"></div>;
};

export default StarryBackground;
