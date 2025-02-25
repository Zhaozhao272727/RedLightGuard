import React, { useEffect } from 'react';
import '../styles/LoginPage.css';
import { useTheme } from '../context/ThemeContext';
import ColorPicker from '../components/ColorPicker';

const LoginPage = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', theme); // 背景變色
    document.documentElement.style.setProperty('--button-color', theme);     // 按鈕同步主題顏色！
  }, [theme]);

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">登入 RedLightGuard</h2>
          <form className="login-form">
            <input type="text" placeholder="用戶 ID" className="input-field" />
            <input type="text" placeholder="名字" className="input-field" />
            <input type="text" placeholder="帳號" className="input-field" />
            <button type="submit" className="login-button">登入</button>
          </form>
        </div>
      </div>
      <ColorPicker />
    </>
  );
};

export default LoginPage;
