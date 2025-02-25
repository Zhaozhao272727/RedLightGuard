import React, { createContext, useState, useContext } from 'react';
import { colors } from '../styles/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(colors.background);

  const changeTheme = (color) => {
    setTheme(color);
    document.documentElement.style.setProperty('--background-color', color);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
