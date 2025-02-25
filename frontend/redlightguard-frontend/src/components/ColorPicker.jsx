import React, { useState } from 'react';
import { colors } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';

const ColorBall = ({ color, onClick }) => (
  <div
    onClick={() => onClick(color)}
    style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: color,
      cursor: 'pointer',
      margin: '6px',
      transition: 'transform 0.3s ease',
    }}
    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
  ></div>
);

const ColorPicker = () => {
  const { changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const colorOptions = [
    colors.pink,     // 粉
    colors.orange,   // 橘 🍊
    colors.yellow,   // 黃
    colors.green,    // 綠
    colors.lightBlue,// 淡藍
    colors.lavender, // 紫
    colors.gray,     // 灰
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#F2E7E8',
          border: '2px solid #C1A1A1',
          cursor: 'pointer',
          marginBottom: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        {isOpen ? '−' : '+'}
      </button>

      {isOpen &&
        colorOptions.map((color, index) => (
          <ColorBall key={index} color={color} onClick={changeTheme} />
        ))}
    </div>
  );
};

export default ColorPicker;
