import React, { useState, useEffect } from "react";
import "../styles/AnalysisPage.css"; // ✅ 正確的 CSS
import "../styles/ColorPicker.css";  // ✅ 確保變色小球的樣式載入
import ColorPicker from "../components/ColorPicker";
import API_BASE_URL from "../config"; // ✅ 引入 API_BASE_URL

const AnalysisPage = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // 取得用戶 ID
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      alert("❌ 請先登入！");
      window.location.href = "/login"; // 直接導回登入頁
      return;
    }
    setUserId(storedUserId);

    // 🚀 向後端請求用戶的影片分析結果
    const fetchAnalysisResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/videos?user_id=${storedUserId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.detail || "無法取得影片分析結果");

        setAnalysisResults(data); // 設定結果
      } catch (error) {
        console.error("❌ 錯誤：", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisResults();
  }, []);

  // 🚀 重新分析影片（呼叫 `/videos/cut` API）
  const handleReanalyze = async (video) => {
    if (!userId) return;

    const [start, end] = video.violationSegments[0].split(" - ").map((time) => {
      const [min, sec] = time.split(":").map(Number);
      return min * 60 + sec;
    });

    try {
      const response = await fetch(`${API_BASE_URL}/videos/cut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          filename: video.name,
          start: start,
          end: end,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "裁剪失敗");

      alert("✅ 重新分析成功！新影片：" + data.new_url);
    } catch (error) {
      console.error("❌ 重新分析錯誤：", error);
      alert(error.message);
    }
  };

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
                  <button className="reanalyze-button" onClick={() => handleReanalyze(video)}>
                    🔄 重新分析
                  </button>
                  <a className="download-button" href={video.url} download>
                    ⬇ 下載
                  </a>
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
