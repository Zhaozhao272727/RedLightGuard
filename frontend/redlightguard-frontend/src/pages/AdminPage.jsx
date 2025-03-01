import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ColorPicker from "../components/ColorPicker";
import "../styles/AdminPage.css";
import { API_BASE_URL } from "../config";


const statusMapping = {
  "pending": "Pending",
  "approved": "No Red Light",
  "rejected": "Red Light Violation",
};

const StatusTag = ({ status }) => {
  const displayStatus = statusMapping[status] || "Unknown";
  return <span className={`status-label ${displayStatus.toLowerCase()}`}>{displayStatus}</span>;
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]); // 🚀 用來存用戶清單
  const [selectedUploads, setSelectedUploads] = useState(new Set());
  const [themeColor, setThemeColor] = useState("#e57373");

  useEffect(() => {
    document.documentElement.style.setProperty("--button-color", themeColor);
    document.documentElement.style.setProperty("--hover-glow-color", themeColor);
  }, [themeColor]);

  // 🚀 先載入 users，再載入 videos，確保不會找不到對應的用戶
  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)  // ✅ 修正
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.data) {
          setUsers(data.data.data);
        }
      })
      .catch(error => console.error("❌ 無法獲取用戶清單:", error));

    fetch(`${API_BASE_URL}/videos`)  // ✅ 修正
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.data) {
          setUploads(data.data.data);
        }
      })
      .catch(error => console.error("❌ 無法獲取影片列表:", error));
}, []);


  // 🗑️ 刪除選取的影片
  const deleteSelectedUploads = () => {
    if (selectedUploads.size === 0) {
      alert("請先選取影片！");
      return;
    }
    if (window.confirm(`確定刪除 ${selectedUploads.size} 筆影片紀錄？`)) {
      selectedUploads.forEach(videoId => {
        fetch(`${API_BASE_URL}/videos/${videoId}`, { method: "DELETE" })
          .then(response => response.json())
          .then(() => {
            setUploads(uploads.filter(upload => !selectedUploads.has(upload.id)));
            setSelectedUploads(new Set());
          })
          .catch(error => console.error("❌ 刪除影片失敗:", error));
      });
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">🔑 Admin Dashboard</h1>

      {/* 🎨 小球選擇區 */}
      <ColorPicker onColorChange={setThemeColor} />

      {/* 📤 影片上傳區塊 */}
      <section className="admin-section">
        <h2>📤 Uploads ({uploads.length})</h2>
        <ul className="scrollable-list">
          {uploads.map((upload) => {
            const uploader = users.find(user => user.id === upload.user_id); // 找到上傳者
            return (
              <li key={upload.id} className="admin-item">
                <input
                  type="checkbox"
                  checked={selectedUploads.has(upload.id)}
                  onChange={() =>
                    setSelectedUploads(prev => {
                      const newSet = new Set(prev);
                      newSet.has(upload.id) ? newSet.delete(upload.id) : newSet.add(upload.id);
                      return newSet;
                    })
                  }
                />
                <span onClick={() => navigate(`/video/${upload.id}`)} className="clickable-name">
                  🎥 {upload.filename}
                </span>
                <StatusTag status={upload.status} />
                <br />
                👤 上傳者: {uploader ? uploader.username : "未知用戶"}
              </li>
            );
          })}
        </ul>
        <button className="delete-btn batch-delete" onClick={deleteSelectedUploads}>批量刪除</button>
      </section>
    </div>
  );
};

export default AdminPage;
