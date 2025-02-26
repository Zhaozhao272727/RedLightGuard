import React from "react";
import VideoUpload from "../components/VideoUpload";
import ColorPicker from "../components/ColorPicker"; // 🎨 主題顏色小球
import "../styles/UploadPage.css";                    // 📄 上傳頁面樣式

const UploadPage = () => {
  return (
    <div className="upload-page">
      <ColorPicker /> {/* 🎨 主題顏色小球 */}
      <VideoUpload /> {/* 📤 影片上傳元件 */}
    </div>
  );
};

export default UploadPage;
