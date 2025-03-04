import React, { useEffect, useState } from 'react';
import '../styles/LoginPage.css';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';
import confetti from 'canvas-confetti'; // 🎉 星星灑落動畫
import API_BASE_URL from '../config'; // ✅ 使用 API_BASE_URL

const LoginPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ account: '', password: '' });
  const [errors, setErrors] = useState({ account: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', theme);
  }, [theme]);

  const validateInput = (field, value) => {
    const regex = /^[a-zA-Z0-9_@.]*$/; // 允許英數字、底線、@、點（支援 email）
    if (!regex.test(value)) {
      return '只能輸入英數字、底線、@ 和點 🚫';
    }
    if (field === 'password' && value.length < 6) {
      return '密碼需至少 6 碼 🔒';
    }
    return '';
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setErrors({ ...errors, [field]: validateInput(field, value) });
    setFormData({ ...formData, [field]: value });
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

    // 前端簡單驗證
    if (Object.values(errors).some((err) => err) || Object.values(formData).some((val) => !val.trim())) {
      alert('請修正錯誤並填寫完整！🚫');
      return;
    }

    setLoading(true);
    try {
      // 🚀 發送登入請求
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 後端預期 email, password
          email: formData.account,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.detail || '登入失敗，請檢查帳號密碼！');
      }

      alert('✅ 登入成功！');
      triggerStarRain(); // 星星灑落

      // 🚀 將 user_id、access_token 存入 localStorage
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('access_token', data.access_token);

      // 延遲 1.5 秒後前往上傳頁
      setTimeout(() => {
        navigate('/upload');
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error('❌ 登入失敗：', error);
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
                placeholder="帳號（Email）"
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
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? '登入中...' : '登入'}
            </button>
          </form>

          {/* 註冊連結 */}
          <p className="register-link">
            還沒有帳號？ <span onClick={() => navigate('/register')}>註冊</span>
          </p>
        </div>
      </div>
      <ColorPicker />
    </>
  );
};

export default LoginPage;
