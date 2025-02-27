import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPage.css"; // 繼承 AdminPage 樣式

const ErrorLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // 📌 模擬日誌資料
    setLogs([
      { id: 1, type: "Upload Error", message: "影片上傳失敗：格式不支援", timestamp: "2025-02-27 14:30:00" },
      { id: 2, type: "Processing Error", message: "影片裁切過程中發生錯誤", timestamp: "2025-02-27 14:35:00" },
      { id: 3, type: "Model Error", message: "模型判斷失敗：無法載入參數", timestamp: "2025-02-27 14:40:00" },
    ]);
  }, []);

  const clearLogs = () => {
    if (window.confirm("確定要清空所有錯誤日誌嗎？")) {
      setLogs([]);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">📌 錯誤日誌</h1>
      <button className="back-btn" onClick={() => navigate("/admin")}>⬅ 返回管理頁</button>

      <section className="admin-section">
        <h2>🔍 日誌記錄 ({logs.length})</h2>
        <ul className="scrollable-list">
          {logs.map((log) => (
            <li key={log.id} className="log-item">
              <span className={`log-type ${log.type.replace(" ", "-").toLowerCase()}`}>
                [{log.type}]
              </span>
              <span className="log-message">{log.message}</span>
              <span className="log-time">{log.timestamp}</span>
            </li>
          ))}
        </ul>
        <button className="delete-btn batch-delete" onClick={clearLogs}>清空日誌</button>
      </section>
    </div>
  );
};

export default ErrorLogs;
