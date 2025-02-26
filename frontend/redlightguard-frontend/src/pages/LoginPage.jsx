import React from 'react';
import '../styles/LoginPage.css';
import { useTheme } from '../context/ThemeContext';
import ColorPicker from "../components/ColorPicker";  // ✅ 沒大括號
import RippleButton from "../components/RippleButton";
import InputField from "../components/InputField";

const LoginPage = () => {
  const { theme } = useTheme();

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">登入 RedLightGuard</h2>
          <form className="login-form">
            <InputField placeholder="用戶 ID" />
            <InputField placeholder="名字" />
            <InputField placeholder="帳號" />
            <RippleButton type="button">登入</RippleButton>
          </form>
        </div>
      </div>
      <ColorPicker />
    </>
  );
};

export default LoginPage;  // ✅ 改成這個才對！

