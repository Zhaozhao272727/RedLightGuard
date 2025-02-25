import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
  const { themeColor } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = themeColor;  // 背景根據主題顏色變化！
  }, [themeColor]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>RedLightGuard 🚦</h1>
      <p>這是登入頁面！</p>
    </div>
  );
};

export default LoginPage;
