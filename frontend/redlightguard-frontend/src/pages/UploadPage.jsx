import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import VideoUpload from "../components/VideoUpload";
import ColorPicker from "../components/ColorPicker";
import MouseBubbles from "../components/MouseBubbles";
import "../styles/UploadPage.css";

const UploadPage = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', theme.background);
  }, [theme]);

  return (
    <>
      <MouseBubbles />
      <main className="upload-page">
        <div className="upload-card">
          <h1 className="main-title">🚦 RedLightGuard</h1>
          <h2 className="upload-title">影片上傳區</h2>
          <VideoUpload />
        </div>
        <ColorPicker />
      </main>
    </>
  );
};

export default UploadPage;
