import React, { useState, useEffect } from "react";
import "../styles/AnalysisPage.css"; // ✅ 確保正確引用 CSS

const AnalysisPage = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 模擬獲取分析結果
    setTimeout(() => {
      setAnalysisResults([
        {
          id: 1,
          name: "video1.mp4",
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          status: "違規",
          violationSegments: ["00:15 - 00:30"],
          model: "LSTM", // 預設選擇
        },
        {
          id: 2,
          name: "video2.mp4",
          url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          status: "無違規",
          violationSegments: [],
          model: "Transformer", // 預設選擇
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  const handleModelChange = (videoId, selectedModel) => {
    setAnalysisResults((prevResults) =>
      prevResults.map((video) =>
        video.id === videoId ? { ...video, model: selectedModel } : video
      )
    );
  };

  const handleDownload = (videoUrl) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "video.mp4"; // 可更改名稱
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analysis-container">
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
                  <input
                    type="radio"
                    value="LSTM"
                    checked={video.model === "LSTM"}
                    onChange={() => handleModelChange(video.id, "LSTM")}
                  />
                  LSTM
                </label>
                <label>
                  <input
                    type="radio"
                    value="Transformer"
                    checked={video.model === "Transformer"}
                    onChange={() => handleModelChange(video.id, "Transformer")}
                  />
                  Transformer
                </label>
                <label>
                  <input
                    type="radio"
                    value="Custom"
                    checked={video.model === "Custom"}
                    onChange={() => handleModelChange(video.id, "Custom")}
                  />
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

              {video.status === "違規" && (
                <div className="violation-actions">
                  <button className="seek-button">⏩ 00:15 - 00:30</button>
                  <button className="reanalyze-button">🔄 重新分析</button>
                  <button
                    className="download-button"
                    onClick={() => handleDownload(video.url)}
                  >
                    ⬇ 下載
                  </button>
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
