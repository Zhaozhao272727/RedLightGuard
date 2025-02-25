import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const ColorPicker = () => {
  const { changeTheme, colors } = useTheme();
  const [showColors, setShowColors] = useState(false);

  return (
    <div style={styles.container}>
      <div
        style={{ ...styles.mainBall }}
        onClick={() => setShowColors(!showColors)}
        title="切換顏色主題 🎨"
      />
      {showColors && (
        <div style={styles.colorOptions}>
          {Object.entries(colors).map(([name, color]) => (
            <div
              key={name}
              style={{ ...styles.colorBall, backgroundColor: color }}
              onClick={() => changeTheme(color)}
              title={name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000,
  },
  mainBall: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d291bc, #f3a6b1)',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  colorOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '10px',
  },
  colorBall: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
};

export default ColorPicker;
