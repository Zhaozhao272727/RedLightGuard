import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colors = {
    pink: '#f2e1e6',
    was: '#d3c4b7',
    green: '#c8d5c1',
    blue: '#b0c4de',
    yellow: '#f3eac2',
    purple: '#d7c5e0',
    gray: '#d1d1d1',
  };

  const [themeColor, setThemeColor] = useState(colors.pink);

  const changeTheme = (color) => setThemeColor(color);

  return (
    <ThemeContext.Provider value={{ themeColor, changeTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
