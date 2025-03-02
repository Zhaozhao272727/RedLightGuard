import React, { useEffect, useState } from 'react';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const hasErrors = Object.values(errors).some((err) => err) || Object.values(formData).some((val) => !val.trim());
    if (hasErrors) {
      alert('請修正錯誤並填寫完整！🚫');
      return;
    }
  
    try {
      const response = await fetch("https://redlightguard.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId,
          account: formData.account,
          password: formData.password
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "登入失敗，請檢查帳號密碼！");
      }
  
      alert("✅ 登入成功！");
      triggerStarRain(); // 🌠 星星動畫
  
      setTimeout(() => {
        navigate("/upload"); // ✅ 成功後跳轉
      }, 1500);
      
    } catch (error) {
      console.error("❌ 登入失敗：", error);
      alert(error.message);
    }
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

          {/* 註冊連結 */}
          <p className="register-link">還沒有帳號？ <span onClick={() => navigate('/register')}>註冊</span></p>
        </div>
      </div>
      <ColorPicker />
    </>
  );
};

export default LoginPage;
