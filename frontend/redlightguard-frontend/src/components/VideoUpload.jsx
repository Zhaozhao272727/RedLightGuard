import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RippleButton from "./RippleButton";
import ToastMessage from "./ToastMessage";
import "../styles/UploadPage.css";
import API_BASE_URL from "../config"; // ✅ 引入後端 API

const VideoUpload = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]); // 多個影片檔案
  const [videoURLs, setVideoURLs] = useState([]);         // 影片預覽 URL
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  // 🚀 從 Supabase Auth 取得的 user_id
  const [userId, setUserId] = useState("");

  // 🚀 在元件載入時，檢查 localStorage 是否有 user_id
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedToken = localStorage.getItem("access_token");

    if (!storedUserId || !storedToken) {
      // 若沒有 userId 或 token，代表尚未登入
      setToast({ message: "❌ 請先登入再上傳影片！", type: "error" });
      navigate("/login");
    } else {
      setUserId(storedUserId);
    }
    // eslint-disable-next-line
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    for (let file of files) {
      if (file.size > 50 * 1024 * 1024) {
        setToast({ message: `🚨 ${file.name} 超過 50MB，請選擇較小的影片！`, type: "error" });
        return;
      }
      
      // ✅ 檢查是否已有相同檔名
      if (selectedFiles.some((existingFile) => existingFile.name === file.name)) {
        setToast({ message: `⚠️ ${file.name} 已選擇，請勿重複上傳！`, type: "warning" });
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

  const handleUpload = async () => {
    // 再次確認 user_id 是否存在
    if (!userId) {
      setToast({ message: "❌ 尚未登入，無法上傳！", type: "error" });
      return;
    }
    if (selectedFiles.length === 0) {
      setToast({ message: "❌ 請選擇至少 1 部影片！", type: "error" });
      return;
    }

    setIsUploading(true);
    setUploaded(false);
    setUploadProgress({});

    let successCount = 0;

    // 🚀 逐檔上傳
    for (let index = 0; index < selectedFiles.length; index++) {
      const file = selectedFiles[index];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId); // 後端會使用這個

      try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          successCount++;
          setUploadProgress((prev) => ({ ...prev, [index]: 100 }));
        } else {
          console.error("❌ 上傳失敗", result);
          setUploadProgress((prev) => ({ ...prev, [index]: "❌" }));
          setToast({ message: `❌ 上傳失敗：${result.detail || "未知錯誤"}`, type: "error" });
        }
      } catch (error) {
        console.error("❌ 伺服器錯誤", error);
        setUploadProgress((prev) => ({ ...prev, [index]: "❌" }));
        setToast({ message: `❌ 伺服器錯誤，請稍後再試`, type: "error" });
      }
    }

    setIsUploading(false);
    if (successCount === selectedFiles.length) {
      setUploaded(true);
      setToast({ message: "✅ 所有影片上傳成功！", type: "success" });
    }
  };

  return (
    <div className="upload-card">
      <h2 className="main-title">🚦 RedLightGuard</h2>
      <h3 className="upload-title">影片上傳區</h3>

      {/* 顯示當前使用者 ID （可選） */}
      {userId && (
        <p style={{ color: "gray", fontSize: "0.9rem" }}>
          目前登入的 User ID：<strong>{userId}</strong>
        </p>
      )}

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
                    <div
                      className="progress-bar"
                      style={{
                        width: `${uploadProgress[index] === "❌" ? 100 : uploadProgress[index]}%`,
                        backgroundColor: uploadProgress[index] === "❌" ? "red" : "green",
                      }}
                    />
                  </div>
                  <p className="progress-text">
                    {uploadProgress[index] === "❌" ? "❌ 失敗" : `${uploadProgress[index]}%`}
                  </p>
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

        <input
          id="file-input"
          type="file"
          accept="video/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <span className="file-name">
          {selectedFiles.length > 0 ? `${selectedFiles.length} 部影片選擇完成` : "未選擇任何檔案"}
        </span>
      </div>

      <p className="file-size-limit">
        📏 影片大小限制：<strong>50MB 以下</strong>
      </p>

      {/* 上傳按鈕 */}
      <RippleButton
        className="upload-button"
        onClick={handleUpload}
        disabled={isUploading || selectedFiles.length === 0}
      >
        {isUploading ? "📤 上傳中..." : "🚀 上傳影片"}
      </RippleButton>

      {uploaded && (
        <RippleButton className="upload-button" onClick={() => navigate("/analysis")}>
          🔍 前往分析
        </RippleButton>
      )}

      {toast && (
        <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default VideoUpload;
