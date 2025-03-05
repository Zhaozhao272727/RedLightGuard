import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ColorPicker from "../components/ColorPicker";
import "../styles/AdminPage.css";
import API_BASE_URL from "../config"; // ✅ 統一 API 設定

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);   // 用戶列表
  const [uploads, setUploads] = useState([]); // 影片列表

  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectedUploads, setSelectedUploads] = useState(new Set());

  const [themeColor, setThemeColor] = useState("#e57373");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    document.documentElement.style.setProperty("--button-color", themeColor);
    document.documentElement.style.setProperty("--hover-glow-color", themeColor);
  }, [themeColor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("❌ 請先登入！");
          navigate("/login");
          return;
        }

        // 🚀 從後端獲取用戶列表
        const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!usersResponse.ok) throw new Error("❌ 無法獲取用戶清單");
        const usersData = await usersResponse.json();
        setUsers(usersData.data || []);

        // 🚀 從後端獲取所有影片
        const videosResponse = await fetch(`${API_BASE_URL}/admin/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!videosResponse.ok) throw new Error("❌ 無法獲取影片列表");
        const videosData = await videosResponse.json();
        setUploads(videosData.data || []);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="admin-container">
      <h1 className="admin-title">🔑 Admin Dashboard</h1>
      <ColorPicker onColorChange={setThemeColor} />

      {/* 📅 日期篩選區 */}
      <div className="filter-container">
        <label>篩選日期區間：</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <span> - </span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* 👥 用戶區塊 */}
      <section className="admin-section">
        <h2>👥 Users ({users.length})</h2>
        <ul className="scrollable-list">
          {users.map((user) => (
            <li key={user.id} className="admin-item">
              <Link to={`/admin/user/${user.id}`} className="clickable-user">
                👤 {user.username} ({user.email})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 📤 影片上傳區塊 */}
      <section className="admin-section">
        <h2>📤 Uploads ({uploads.length})</h2>
        <ul className="scrollable-list">
          {uploads.map((upload) => (
            <li key={upload.id} className="admin-item">
              <span>🎥 {upload.filename} - <strong>{upload.status}</strong></span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
