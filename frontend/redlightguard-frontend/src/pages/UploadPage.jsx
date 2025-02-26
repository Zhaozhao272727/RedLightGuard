import React from "react";
import StarButton from '../components/StarButton';
import VideoUpload from "../components/VideoUpload";
import ColorPicker from "../components/ColorPicker";
import StarryBackground from "../components/StarryBackground"; // 🌠 光點效果

import "../styles/UploadPage.css";

const UploadPage = () => {
  return (
    <div className="upload-page">
      <StarryBackground /> {/* 🌠 緩慢飄動的光點效果 */}
      <ColorPicker /> {/* 🎨 主題顏色小球 */}
      <VideoUpload /> {/* 📤 影片上傳功能 */}
    </div>
  );
};

export default UploadPage;
