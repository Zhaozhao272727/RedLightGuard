import React, { useEffect, useState, useContext } from 'react';
import '../styles/LoginPage.css';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';
import confetti from 'canvas-confetti'; // 🎉 星星灑落動畫

const LoginPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ userId: '', account: '', password: '' });
  const [errors, setErrors] = useState({ userId: '', account: '', password: '' });

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', theme);
  }, [theme]);

  const validateInput = (field, value) => {
    const regex = /^[a-zA-Z0-9_]*$/; // ✅ 僅允許英數字與底線

    if (!regex.test(value)) {
      return '只能輸入英數字和底線 🚫';
    }

    if (field === 'password' && value.length < 6) {
      return '密碼需至少 6 碼 🔒';
    }

    return '';
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const errorMsg = validateInput(field, value);
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: errorMsg });
  };

  const triggerStarRain = () => {
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.2 },
      shapes: ['star'],
      colors: ['#FFD700', '#FF69B4', '#87CEFA', '#FFB6C1', '#FFF'],
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((err) => err) || Object.values(formData).some((val) => !val.trim());

    if (hasErrors) {
      alert('請修正錯誤並填寫完整！🚫');
      return;
    }

    triggerStarRain(); // 🌠 星星灑落

    setTimeout(() => {
      navigate('/upload'); // ✅ 登入後跳轉
    }, 1500); // 延遲顯示動畫
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">登入 RedLightGuard</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="用戶 ID"
                value={formData.userId}
                onChange={handleChange('userId')}
                className="input-field"
                required
              />
              {errors.userId && <p className="error-message">{errors.userId}</p>}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="帳號"
                value={formData.account}
                onChange={handleChange('account')}
                className="input-field"
                required
              />
              {errors.account && <p className="error-message">{errors.account}</p>}
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="密碼"
                value={formData.password}
                onChange={handleChange('password')}
                className="input-field"
                required
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <button type="submit" className="login-button">登入</button>
          </form>
        </div>
      </div>
      <ColorPicker />
    </>
  );
};

export default LoginPage;
