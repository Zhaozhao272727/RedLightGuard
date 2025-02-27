import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/StarButton.css';

const StarButton = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 📍 取得當前路徑

  const handleClick = () => {
    if (location.pathname === "/admin-login") {
      navigate(-1); // ✅ 如果已經在管理員登入頁面，點擊返回上一頁
    } else {
      navigate("/admin-login"); // ✅ 其他頁面則跳轉至管理員登入頁面
    }
  };

  return (
    <button
      className="star-button"
      onClick={handleClick}
      title="管理員登入"
    >
      <span className="star-icon">⭐</span> {/* ✅ 使用 Emoji！ */}
    </button>
  );
};

export default StarButton;
