import React, { useState, useEffect } from 'react';
import '../styles/RegisterPage.css';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';
import API_BASE_URL from '../config'; // 連結後端

const RegisterPage = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.documentElement.style.setProperty('--background-color', theme);
    }, [theme]);

    const validateInput = (field, value) => {
        const regex = /^[a-zA-Z0-9_@.]*$/;
        if (!regex.test(value)) {
            return '只能輸入英數字、底線、@ 和點 🚫';
        }
        if (field === 'password' && value.length < 6) {
            return '密碼需至少 6 碼 🔒';
        }
        if (field === 'confirmPassword' && value !== formData.password) {
            return '密碼不一致！🚫';
        }
        return '';
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setErrors({ ...errors, [field]: validateInput(field, value) });
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (Object.values(errors).some((err) => err) || Object.values(formData).some((val) => !val.trim())) {
            alert('請修正錯誤並填寫完整！🚫');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                })
            });

            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                throw new Error(data.detail || data.message || '註冊失敗！請檢查資料');
            }

            alert('✅ 註冊成功！請確認 Email');
            navigate('/login');

        } catch (error) {
            setLoading(false);
            console.error('❌ 註冊失敗：', error);
            alert(error.message);
        }
    };

    return (
        <>
            <div className="register-container">
                <div className="register-card">
                    <h2 className="register-title">註冊</h2>
                    <form className="register-form" onSubmit={handleRegister}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="username" 
                                placeholder="帳號（ID）"
                                value={formData.username}
                                onChange={handleChange('username')}
                                required
                            />
                            {errors.username && <p className="error-message">{errors.username}</p>}
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="電子郵件"
                                value={formData.email}
                                onChange={handleChange('email')}
                                required
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="密碼"
                                value={formData.password}
                                onChange={handleChange('password')}
                                required
                            />
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="確認密碼"
                                value={formData.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                required
                            />
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" className="register-button" disabled={loading}>
                            {loading ? '註冊中...' : '註冊'}
                        </button>
                    </form>
                </div>
            </div>
            <ColorPicker />
        </>
    );
};

export default RegisterPage;
