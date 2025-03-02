// components/NavBar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <button className="nav-button" onClick={() => navigate('/')}>🏠 首頁</button>
      {location.pathname !== '/' && (
        <button className="nav-button" onClick={() => navigate(-1)}>🔙 返回</button>
      )}
    </nav>
  );
};

export default NavBar;
