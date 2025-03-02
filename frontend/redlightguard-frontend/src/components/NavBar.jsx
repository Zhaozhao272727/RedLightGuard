// components/NavBar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🛡️ 在 `/` 和 `/login` 頁面隱藏導覽列
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="navbar">
      <button className="nav-button" onClick={() => navigate('/')}>🏠 首頁</button>
      {location.pathname !== '/' && (
        <button className="nav-button" onClick={() => navigate(-1)}>🔙 返回</button>
      )}
      <button className="nav-button" onClick={() => navigate('/user/videos')}>👤 個人中心</button> {/* 🆕 新增按鈕 */}
    </nav>
  );
};

export default NavBar;
