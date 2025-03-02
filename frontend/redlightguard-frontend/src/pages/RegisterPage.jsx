import React, { useState, useEffect } from 'react';
import '../styles/RegisterPage.css';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';

const RegisterPage = () => {
    const { theme } = useTheme(); // 🟢 讀取主題顏色
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState("");

    useEffect(() => {
        document.documentElement.style.setProperty('--background-color', theme); // 🟢 設定背景色
    }, [theme]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("密碼不一致！🚫");
            return;
        }
        setError(""); // 清除錯誤
        alert("註冊成功！（這裡未來會連接後端）");
        navigate('/login'); // 註冊完成後跳轉登入
    };

    return (
        <>
            <div className="register-container">
                <div className="register-card">
                    <h2 className="register-title">註冊</h2>
                    <form className="register-form" onSubmit={handleRegister}>
                        <input type="text" name="username" placeholder="帳號（ID）" value={formData.username} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="電子郵件" value={formData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="密碼" value={formData.password} onChange={handleChange} required />
                        <input type="password" name="confirmPassword" placeholder="確認密碼" value={formData.confirmPassword} onChange={handleChange} required />
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="register-button">註冊</button>
                    </form>
                </div>
            </div>
            <ColorPicker /> {/* 🟢 加入變色小球 */}
        </>
    );
};

export default RegisterPage;
