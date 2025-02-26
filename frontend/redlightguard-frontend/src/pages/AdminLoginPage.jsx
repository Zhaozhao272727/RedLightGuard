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

    // 假設帳號密碼 (可改為你想要的)
    const adminAccount = 'admin';
    const adminPassword = '1234';

    if (account === adminAccount && password === adminPassword) {
      navigate('/admin'); // 登入成功跳轉到管理員頁面
    } else {
      setError('帳號或密碼錯誤！');
    }
  };

  return (
    <div className="admin-login-container">
      <h1>🔑 管理員登入</h1>
      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="text"
          placeholder="管理員帳號"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">登入</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
