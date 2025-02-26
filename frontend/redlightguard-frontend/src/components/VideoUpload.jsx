import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import RippleButton from "../components/RippleButton";
import "../styles/VideoUpload.css";

const VideoUpload = () => {
  const { theme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--button-color', theme.button);
  }, [theme]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      alert("請先選擇檔案！");
      return;
    }
    alert(`已成功上傳影片：${uploadedFile.name}`);
  };

  return (
    <div className="video-upload-container">
      <div className="file-upload-section">
        <label htmlFor="file-upload" className="select-file-label">
          📁 選擇檔案
        </label>
        <input
          id="file-upload"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <span className="file-name">
          {uploadedFile ? uploadedFile.name : "未選擇任何檔案"}
        </span>
      </div>

      <RippleButton className="upload-button" onClick={handleUpload}>
        上傳影片
      </RippleButton>
    </div>
  );
};

export default VideoUpload;
