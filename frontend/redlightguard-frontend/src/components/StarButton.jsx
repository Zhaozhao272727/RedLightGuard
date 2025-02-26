import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StarButton.css';

const StarButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="star-button"
      onClick={() => navigate('/admin-login')}
      title="管理員登入"
    >
      <span className="star-icon">⭐</span> {/* ✅ 使用 Emoji！ */}
    </button>
  );
};

export default StarButton;
