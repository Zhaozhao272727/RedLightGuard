import React, { useEffect } from 'react';
import '../styles/LoginPage.css';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom'; // ✅ 加入 useNavigate
import ColorPicker from '../components/ColorPicker';

const LoginPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate(); // ✅ 初始化導航

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', theme);
  }, [theme]);

  const handleLogin = (e) => {
    e.preventDefault(); // 🛡️ 防止表單自動刷新
    // 🚀 登入驗證邏輯可放這裡 (可加上驗證條件)
    navigate('/upload'); // ✅ 登入成功後跳轉到上傳頁面
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">登入 RedLightGuard</h2>
          <form className="login-form" onSubmit={handleLogin}>
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
