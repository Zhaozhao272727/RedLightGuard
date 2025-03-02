import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RippleButton from "./RippleButton";
import ToastMessage from "./ToastMessage";
import "../styles/UploadPage.css";

const VideoUpload = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]); // 多個影片檔案
  const [videoURLs, setVideoURLs] = useState([]); // 影片預覽 URL
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploaded, setUploaded] = useState(false); // 是否全部上傳完成

  const handleChooseFile = () => {
    document.getElementById("file-input").click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      if (file.size > 50 * 1024 * 1024) {
        setToast({ message: `🚨 ${file.name} 超過 50MB，請選擇較小的影片！`, type: "error" });
        return;
      }
    }

    if (files.length + selectedFiles.length > 5) {
      setToast({ message: "⚠️ 最多只能上傳 5 部影片！", type: "error" });
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);
    setVideoURLs([...videoURLs, ...files.map((file) => URL.createObjectURL(file))]);
    setUploaded(false);
  };

  const handleDeleteVideo = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoURLs((prev) => prev.filter((_, i) => i !== index));
    setUploaded(false);
    setToast({ message: "🗑️ 影片已刪除！", type: "info" });
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      setToast({ message: "❌ 請選擇至少 1 部影片！", type: "error" });
      return;
    }

    setIsUploading(true);
    setUploaded(false);
    const progress = {};
    selectedFiles.forEach((_, index) => (progress[index] = 0));
    setUploadProgress(progress);

    selectedFiles.forEach((_, index) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev, [index]: prev[index] + 10 };
          if (newProgress[index] >= 100) {
            clearInterval(interval);
            if (Object.values(newProgress).every((p) => p === 100)) {
              setUploaded(true);
              setToast({ message: "✅ 所有影片上傳成功！", type: "success" });
            }
          }
          return newProgress;
        });
      }, 500);
    });

    setIsUploading(false);
  };

  return (
    <div className="upload-card">
      <h2 className="main-title">🚦 RedLightGuard</h2>
      <h3 className="upload-title">影片上傳區</h3>

      {/* 影片預覽區塊 */}
      {videoURLs.length > 0 && (
        <div className="video-preview-container">
          {videoURLs.map((url, index) => (
            <div key={index} className="video-item">
              <video src={url} controls />
              <p className="file-name">{selectedFiles[index]?.name || "未命名影片"}</p>

              {uploadProgress[index] !== undefined && (
                <div className="progress-container">
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${uploadProgress[index]}%` }}></div>
                  </div>
                  <p className="progress-text">{uploadProgress[index]}%</p>
                </div>
              )}

              <RippleButton className="delete-button" onClick={() => handleDeleteVideo(index)}>
                🗑️ 刪除影片
              </RippleButton>
            </div>
          ))}
        </div>
      )}

      {/* 📂 檔案選擇區塊 */}
      <div className="file-upload-section">
        <RippleButton className="choose-file-button" onClick={handleChooseFile}>
          📂 選擇檔案 <span>（最多五部）</span>
        </RippleButton>

        <input id="file-input" type="file" accept="video/*" multiple style={{ display: "none" }} onChange={handleFileChange} />
        <span className="file-name">{selectedFiles.length > 0 ? `${selectedFiles.length} 部影片選擇完成` : "未選擇任何檔案"}</span>
      </div>

      <p className="file-size-limit">📏 影片大小限制：<strong>50MB 以下</strong></p>

      {/* 上傳按鈕 */}
      <RippleButton className="upload-button" onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0}>
        {isUploading ? "上傳中..." : "上傳影片"}
      </RippleButton>

      {uploaded && (
        <RippleButton className="upload-button" onClick={() => navigate("/analysis")}>
          前往分析
        </RippleButton>
      )}

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default VideoUpload;
