import React, { useState, useEffect } from "react";
import "../styles/MouseRipple.css";

const MouseRipple = () => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    const newRipple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600); // 漣漪持續時間
  };

  useEffect(() => {
    window.addEventListener("click", createRipple);
    return () => window.removeEventListener("click", createRipple);
  }, []);

  return (
    <div className="mouse-ripple-container">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="mouse-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  );
};

export default MouseRipple;
