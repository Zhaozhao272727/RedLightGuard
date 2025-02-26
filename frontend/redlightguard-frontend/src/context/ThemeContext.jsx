import React, { createContext, useState, useContext, useEffect } from 'react';
import { colors } from '../styles/colors';

const ThemeContext = createContext();

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme && !savedTheme.startsWith('{')) {
      const newTheme = { background: savedTheme, button: '#b07c7c' };
      localStorage.setItem('theme', JSON.stringify(newTheme)); 
      return newTheme;
    }

    return savedTheme ? JSON.parse(savedTheme) : { background: colors.background, button: '#b07c7c' };
  } catch (error) {
    console.error('⚠️ 無法解析主題 JSON，使用預設主題', error);
    return { background: colors.background, button: '#b07c7c' };
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);  // ✅ 使用修正版

  const changeTheme = (backgroundColor, buttonColor) => {
    const newTheme = { background: backgroundColor, button: buttonColor || backgroundColor };
    setTheme(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme)); 
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--button-color', buttonColor || backgroundColor);
  };
  
  

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', theme.background);
    document.documentElement.style.setProperty('--button-color', theme.button);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
