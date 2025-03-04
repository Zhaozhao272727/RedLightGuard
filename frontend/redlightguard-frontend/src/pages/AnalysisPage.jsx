import React, { useState, useEffect } from "react";
import "../styles/AnalysisPage.css"; // ✅ 確保樣式載入
import "../styles/ColorPicker.css";  // ✅ 變色小球
import ColorPicker from "../components/ColorPicker";

const AnalysisPage = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 模擬取得假資料，2 違規 + 1 無違規
    const fakeData = [
      {
        name: "utomp3.com - 闖闖闖闖闖紅燈.mp4",
        url: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119419/x2kwveo5g8j1wwwgkbty.mp4",
        downloadUrl: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119419/x2kwveo5g8j1wwwgkbty.mp4",
        status: "違規",
        violationSegments: ["00:05 - 00:11"]
      },
      {
        name: "utomp3.com - 這紅綠燈會引誘人闖紅燈.mp4",
        url: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/ef3xpgef3hyfkcorpcdy.mp4",
        downloadUrl: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/ef3xpgef3hyfkcorpcdy.mp4",
        status: "違規",
        violationSegments: ["00:10 - 00:15", "00:15 - 00:20"]
      },
      {
        name: "『療癒片』記得禮讓行人.mp4",
        url: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/ef3xpgef3hyfkcorpcdy.mp4",
        downloadUrl: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/nwljx7iljyq8addtdwx0.mp4",
        status: "無違規",
        violationSegments: []
      }
    ];
    

    // 假裝在 loading 中，3.2 秒後載入這份假資料
    setTimeout(() => {
      setAnalysisResults(fakeData);
      setLoading(false);
    }, 3200);
  }, []);

  // 🛠️ 跳轉到違規時間段的函數
  const handleSeek = (videoId, segment) => {
    if (!segment) return; // 防止錯誤

    // 解析時間 "00:10 - 00:20" 取 "00:10"
    const startTime = segment.split(" - ")[0]; 
    const [minutes, seconds] = startTime.split(":").map(Number);
    const seekTime = minutes * 60 + seconds;

    // 找到影片元素並設定時間
    const videoElement = document.getElementById(videoId);
    if (videoElement) {
      videoElement.currentTime = seekTime;
      videoElement.play();
    }
  };

  return (
    <div className="analysis-container">
      {/* 🌟 變色小球 */}
      <ColorPicker />

      <h2>📊 影片分析結果</h2>

      {loading ? (
        <p>⏳ 正在加載分析結果...</p>
      ) : analysisResults.length > 0 ? (
        <ul className="video-list">
          {analysisResults.map((video, index) => (
            <li key={index} className="video-item">
              <h3>🎥 {video.name}</h3>

              {/* ✅ 修正 video id 確保唯一 */}
              <video id={`video-${index}`} width="100%" controls>
                <source src={video.url} type="video/mp4" />
                您的瀏覽器不支援影片播放。
              </video>

              <p className="result">
                **審核結果：**{" "}
                {video.status === "違規" ? (
                  <span className="violation">❌ 違規</span>
                ) : (
                  <span className="no-violation">✅ 無違規</span>
                )}
              </p>

              {/* 🛠️ 只顯示 1 個「跳轉按鈕」 */}
              {video.status === "違規" && video.violationSegments.length > 0 && (
                <button 
                  className="seek-button" 
                  onClick={() => handleSeek(`video-${index}`, video.violationSegments[0])}
                >
                  ⏩ 跳轉到違規時間
                </button>
              )}

              {/* 下載按鈕 ✅ 讓用戶可以下載 */}
              <a className="download-button" href={video.downloadUrl} target="_blank" rel="noopener noreferrer">
                ⬇ 下載影片
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>🚫 沒有可顯示的影片</p>
      )}
    </div>
  );
};

export default AnalysisPage;
