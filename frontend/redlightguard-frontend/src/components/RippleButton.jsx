import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/RippleButton.css";

const RippleButton = ({ children, onClick, disabled = false, className = "", style = {} }) => {
  const [ripples, setRipples] = useState([]);
  const { theme } = useTheme();

  const createRipple = (event) => {
    if (disabled) return;  // 禁用時不產生漣漪

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => setRipples((prev) => prev.slice(1)), 600);
  };

  return (
    <button
      className={`ripple-button ${className}`}  // ✅ 接收外部傳入的 className
      style={style}                              // ✅ 支援外部自訂 style
      onClick={(e) => {
        createRipple(e);
        onClick && onClick(e);
      }}
      disabled={disabled}
    >
      {children}
      {!disabled && (
        <div className="ripple-container">
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="ripple"
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
};

export default RippleButton;
