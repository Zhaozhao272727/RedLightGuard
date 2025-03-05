import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ColorPicker from "../components/ColorPicker";
import "../styles/AdminPage.css";
import API_BASE_URL from "../config"; // ✅ 統一改為預設匯入

// 🚀 狀態標籤
const StatusTag = ({ status }) => {
  const statusColors = {
    "No Red Light": "green",
    "Red Light Violation": "red",
    "Pending": "yellow",
  };
  return <span className={`status-label ${statusColors[status] || "gray"}`}>{status}</span>;
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // 用戶列表
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

        // 🚀 拉取用戶列表
        const usersResponse = await fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!usersResponse.ok) throw new Error("❌ 無法獲取用戶清單");
        const usersData = await usersResponse.json();
        setUsers(usersData.data || []);

        // 🚀 拉取影片列表
        const videosResponse = await fetch(`${API_BASE_URL}/videos`, {
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

  // 🔍 過濾影片
  const filteredUploads = uploads.filter((upload) => {
    if (!startDate || !endDate) return true;
    const uploadDate = new Date(upload.uploaded_at);
    return uploadDate >= new Date(startDate) && uploadDate <= new Date(endDate);
  });

  // 🔍 過濾用戶
  const filteredUsers = users.filter((user) => {
    if (!startDate || !endDate) return true;
    const userDate = new Date(user.created_at);
    return userDate >= new Date(startDate) && userDate <= new Date(endDate);
  });

  // 🗑️ 刪除用戶
  const deleteSelectedUsers = async () => {
    if (selectedUsers.size === 0) {
      alert("請先選取用戶！");
      return;
    }
    if (!window.confirm(`確定刪除 ${selectedUsers.size} 位用戶？`)) return;

    try {
      const token = localStorage.getItem("access_token");
      await Promise.all(
        [...selectedUsers].map((userId) =>
          fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setUsers(users.filter((user) => !selectedUsers.has(user.id)));
      setSelectedUsers(new Set());
      alert("✅ 已刪除選取用戶！");
    } catch (error) {
      alert("❌ 刪除失敗，請稍後再試");
    }
  };

  // 🗑️ 刪除影片
  const deleteSelectedUploads = async () => {
    if (selectedUploads.size === 0) {
      alert("請先選取影片！");
      return;
    }
    if (!window.confirm(`確定刪除 ${selectedUploads.size} 筆影片紀錄？`)) return;

    try {
      const token = localStorage.getItem("access_token");
      await Promise.all(
        [...selectedUploads].map((videoId) =>
          fetch(`${API_BASE_URL}/videos/${videoId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setUploads(uploads.filter((upload) => !selectedUploads.has(upload.id)));
      setSelectedUploads(new Set());
      alert("✅ 已刪除選取影片！");
    } catch (error) {
      alert("❌ 刪除失敗，請稍後再試");
    }
  };

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
        <h2>👥 Users ({filteredUsers.length})</h2>
        <ul className="scrollable-list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="admin-item">
              <input
                type="checkbox"
                checked={selectedUsers.has(user.id)}
                onChange={() =>
                  setSelectedUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.has(user.id) ? newSet.delete(user.id) : newSet.add(user.id);
                    return newSet;
                  })
                }
              />
              <Link to={`/admin/user/${user.id}`} className="clickable-user">
                👤 {user.username} ({user.email})
              </Link>
            </li>
          ))}
        </ul>
        <button className="delete-btn batch-delete" onClick={deleteSelectedUsers}>
          批量刪除
        </button>
      </section>

      {/* 📤 影片上傳區塊 */}
      <section className="admin-section">
        <h2>📤 Uploads ({filteredUploads.length})</h2>
        <ul className="scrollable-list">
          {filteredUploads.map((upload) => {
            const uploader = users.find((user) => user.id.trim() === upload.user_id.trim());
            return (
              <li key={upload.id} className="admin-item">
                <input
                  type="checkbox"
                  checked={selectedUploads.has(upload.id)}
                  onChange={() =>
                    setSelectedUploads((prev) => {
                      const newSet = new Set(prev);
                      newSet.has(upload.id) ? newSet.delete(upload.id) : newSet.add(upload.id);
                      return newSet;
                    })
                  }
                />
                <img src={upload.thumbnail} alt="thumbnail" className="video-thumbnail" />
                <span>
                  🎥 {upload.filename} <StatusTag status={upload.status} />
                </span>
                <br />
                👤 上傳者: {uploader ? uploader.username : "未知用戶"}
              </li>
            );
          })}
        </ul>
        <button className="delete-btn batch-delete" onClick={deleteSelectedUploads}>
          批量刪除
        </button>
      </section>

      <button className="log-btn" onClick={() => navigate("/error-logs")}>
        📌 查看錯誤日誌
      </button>
    </div>
  );
};

export default AdminPage;
