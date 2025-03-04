import React, { useState, useEffect } from "react";
import "../styles/AnalysisPage.css"; // ✅ 正確的 CSS
import "../styles/ColorPicker.css";  // ✅ 確保變色小球的樣式載入
import ColorPicker from "../components/ColorPicker";
import API_BASE_URL from "../config"; // ✅ 引入 API_BASE_URL

const AnalysisPage = () => {
  const [analysisResults, setAnalysisResults] = useState([]); // ✅ 預設空陣列，避免 `undefined`
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // ✅ 取得 `userId`
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      console.error("❌ 未找到 user_id，請先登入！");
      return;
    }
    setUserId(storedUserId);

    const fetchVideos = async () => {
      try {
        const encodedUserId = encodeURIComponent(storedUserId);
        const response = await fetch(`${API_BASE_URL}/user/videos?user_id=${encodedUserId}`);

        const data = await response.json();
        console.log("🎬 取得影片列表:", data); // 🔥 Debug: 確認 API 回傳

        // ✅ 確保 `videos` 是陣列
        if (!data.videos || !Array.isArray(data.videos)) {
          console.error("❌ 影片列表格式錯誤，設定為空陣列！");
          setAnalysisResults([]); // 避免 `.map()` 出錯
          return;
        }

        setAnalysisResults(data.videos);
        setLoading(false);
      } catch (error) {
        console.error("❌ 取得影片失敗:", error);
        setAnalysisResults([]); // 失敗時確保是陣列
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // 🚀 重新分析影片（呼叫 `/videos/cut` API）
  const handleReanalyze = async (video) => {
    if (!userId) {
      alert("❌ 未登入，請先登入再分析！");
      return;
    }

    // ✅ 確保 `violationSegments` 存在
    if (!video.violationSegments || video.violationSegments.length === 0) {
      alert("❌ 此影片沒有違規時間段！");
      return;
    }

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
      ) : analysisResults.length > 0 ? ( // ✅ 確保有資料才 `.map()`
        <ul className="video-list">
          {analysisResults.map((video, index) => (
            <li key={index} className="video-item">
              <h3>🎥 {video.name}</h3>
              <video id={`video-${index}`} width="100%" controls>
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
              {video.status === "違規" && video.violationSegments && (
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
      ) : (
        <p>🚫 沒有可顯示的影片</p>
      )}
    </div>
  );
};

export default AnalysisPage;