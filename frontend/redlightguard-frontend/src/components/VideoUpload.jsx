import React, { useState } from "react";
import RippleButton from "./RippleButton";
import "../styles/UploadPage.css";

const VideoUpload = () => {
  const [fileName, setFileName] = useState("未選擇任何檔案");

  const handleChooseFile = () => {
    document.getElementById("file-input").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "未選擇任何檔案");
  };

  return (
    <div className="upload-card">
      <h2 className="main-title">🚦 RedLightGuard</h2>
      <h3 className="upload-title">影片上傳區</h3>

      <div className="file-upload-section">
        <RippleButton className="choose-file-button" onClick={handleChooseFile}>
          📂 選擇檔案
        </RippleButton>

        <input
          id="file-input"
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <span className="file-name">{fileName}</span>
      </div>

      <RippleButton className="upload-button">上傳影片</RippleButton>
    </div>
  );
};

export default VideoUpload;
