import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import ColorPicker from './components/ColorPicker';

function App() {
  return (
    <ThemeProvider>
      <LoginPage />
      <ColorPicker />
    </ThemeProvider>
  );
}

export default App;
