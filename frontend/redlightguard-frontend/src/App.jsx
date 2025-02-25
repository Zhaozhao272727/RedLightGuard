import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider>
      <LoginPage />  {/* ✅ 小球會跟著 LoginPage 出現 */}
    </ThemeProvider>
  );
}

export default App;
