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
        url: "https://drive.google.com/uc?id=1RlA0ahPrqQW5fyRFw34HRcWAlRz-PyB0", // ✅ 轉換為可嵌入影片的 URL
        downloadUrl: "https://drive.google.com/file/d/1RlA0ahPrqQW5fyRFw34HRcWAlRz-PyB0/view?usp=sharing",
        status: "違規",
        violationSegments: ["00:10 - 00:20"]
      },
      {
        name: "utomp3.com - 這紅綠燈會引誘人闖紅燈檢舉成功_360P.mp4",
        url: "https://drive.google.com/uc?id=1mOCqvpIXaeKw_dJKssxSkOoeXNfmNdb2",
        downloadUrl: "https://drive.google.com/file/d/1mOCqvpIXaeKw_dJKssxSkOoeXNfmNdb2/view?usp=sharing",
        status: "違規",
        violationSegments: ["00:05 - 00:07", "01:00 - 01:05"]
      },
      {
        name: "『療癒片』記得禮讓行人.mp4",
        url: "https://drive.google.com/uc?id=1A4lT0YK2A8XAHmb_qtBCOO08ctmdQ5NT",
        downloadUrl: "https://drive.google.com/file/d/1A4lT0YK2A8XAHmb_qtBCOO08ctmdQ5NT/view?usp=sharing",
        status: "無違規",
        violationSegments: []
      }
    ];

    // 假裝在 loading 中，1.2 秒後載入這份假資料
    setTimeout(() => {
      setAnalysisResults(fakeData);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="analysis-container">
      {/* 🌟 變色小球 */}
      <ColorPicker />

      <h2>📊 影片分析結果（假資料展示）</h2>

      {loading ? (
        <p>⏳ 正在加載分析結果...</p>
      ) : analysisResults.length > 0 ? (
        <ul className="video-list">
          {analysisResults.map((video, index) => (
            <li key={index} className="video-item">
              <h3>🎥 {video.name}</h3>
              
              {/* ✅ 修正 video id 語法，確保唯一 */}
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

              {/* 🛠️ 違規時間段按鈕 (保留 ⏩ 供展示) */}
              {video.status === "違規" && video.violationSegments.length > 0 && (
                <div className="violation-actions">
                  {video.violationSegments.map((segment, idx) => (
                    <button key={idx} className="seek-button">
                      ⏩ {segment}
                    </button>
                  ))}
                </div>
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
