import React, { useState, useEffect } from "react";
import "../styles/AnalysisPage.css"; // ✅ 正確的 CSS
import "../styles/ColorPicker.css";  // ✅ 確保變色小球的樣式載入
import ColorPicker from "../components/ColorPicker";
import API_BASE_URL from "../config"; // ✅ 如需呼叫後端，可用此常數

const AnalysisPage = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌟 可改為 fetch(`${API_BASE_URL}/analysis`) 或 /predict, 視後端實際接口而定
    // 這裡保留你的 setTimeout 模擬結果
    setTimeout(() => {
      setAnalysisResults([
        {
          id: 1,
          name: "video1.mp4",
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          status: "違規",
          violationSegments: ["00:15 - 00:30"],
          model: "LSTM",
        },
        {
          id: 2,
          name: "video2.mp4",
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          status: "無違規",
          violationSegments: [],
          model: "Transformer",
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="analysis-container">
      {/* 🌟 變色小球 */}
      <ColorPicker />

      <h2>📊 影片分析結果</h2>

      {loading ? (
        <p>⏳ 正在加載分析結果...</p>
      ) : (
        <ul className="video-list">
          {analysisResults.map((video) => (
            <li key={video.id} className="video-item">
              <h3>🎥 {video.name}</h3>
              <video id={`video-${video.id}`} width="100%" controls>
                <source src={video.url} type="video/mp4" />
                您的瀏覽器不支援影片播放。
              </video>

              {/* 🔥 每個影片的模型選擇區 */}
              <div className="model-selection">
                <label>
                  <input type="radio" value="LSTM" checked={video.model === "LSTM"} readOnly />
                  LSTM
                </label>
                <label>
                  <input
                    type="radio"
                    value="Transformer"
                    checked={video.model === "Transformer"}
                    readOnly
                  />
                  Transformer
                </label>
                <label>
                  <input type="radio" value="Custom" checked={video.model === "Custom"} readOnly />
                  自訂模型
                </label>
              </div>

              <p className="result">
                **審核結果：**{" "}
                {video.status === "違規" ? (
                  <span className="violation">❌ 違規</span>
                ) : (
                  <span className="no-violation">✅ 無違規</span>
                )}
              </p>

              {/* 🛠️ 違規時間段的按鈕 */}
              {video.status === "違規" && (
                <div className="violation-actions">
                  {video.violationSegments.map((segment, idx) => (
                    <button key={idx} className="seek-button">⏩ {segment}</button>
                  ))}
                  <button className="reanalyze-button">🔄 重新分析</button>
                  <button className="download-button">⬇ 下載</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnalysisPage;
