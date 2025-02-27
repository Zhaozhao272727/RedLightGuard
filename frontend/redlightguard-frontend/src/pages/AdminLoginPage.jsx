import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLoginPage.css';

const AdminLoginPage = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 假設的管理員帳號密碼
    const adminAccount = 'admin';
    const adminPassword = '1234';

    if (account === adminAccount && password === adminPassword) {
      navigate('/admin'); // ✅ 登入成功跳轉至管理員頁面
    } else {
      setError('❌ 帳號或密碼錯誤！');
      setTimeout(() => setError(''), 3000); // ⏳ 3 秒後自動清除錯誤訊息
    }
  };

  return (
    <div className="admin-login-container">
      <h1 className="admin-login-title">🔑 管理員登入</h1>
      <form onSubmit={handleLogin} className="admin-login-form">
        {/* ✅ 帳號輸入框 */}
        <input
          type="text"
          placeholder="管理員帳號"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          required
          className={error ? "input-error" : ""}
        />
        
        {/* ✅ 密碼輸入框 */}
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={error ? "input-error" : ""}
        />

        {/* 🔴 錯誤訊息 */}
        {error && <p className="error-message">{error}</p>}

        {/* 🟢 登入按鈕 */}
        <button type="submit" className="admin-login-button">登入</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
