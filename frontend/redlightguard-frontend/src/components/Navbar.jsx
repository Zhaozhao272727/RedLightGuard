// components/Navbar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
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

export default Navbar;
