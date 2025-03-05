import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config"; // ✅ 統一 API 設定
import "../styles/UserDetail.css";

const UserDetail = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // ✅ 確保 `useParams()` 取得的 key 與路由一致

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [userVideos, setUserVideos] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("❌ 請先登入！");
          navigate("/login");
          return;
        }

        // 🚀 從後端獲取用戶資料
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("❌ 無法獲取用戶資料");
        const data = await response.json();

        setUserData(data);
        setOriginalUserData(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };

    const fetchUserVideos = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // 🚀 從後端獲取該用戶上傳的影片
        const response = await fetch(`${API_BASE_URL}/user/${userId}/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("❌ 無法獲取用戶影片");
        const data = await response.json();

        setUserVideos(data.data || []);
      } catch (error) {
        console.error("❌ 無法獲取影片資料:", error);
      }
    };

    fetchUserData();
    fetchUserVideos();
  }, [userId, navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
        }),
      });

      if (!response.ok) throw new Error("❌ 更新失敗，請檢查資料或權限！");

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setOriginalUserData(updatedUser);

      setIsEditing(false);
      alert("✅ 更新成功！");
    } catch (error) {
      console.error("❌ 更新失敗", error);
      alert("❌ 更新失敗，請重試！");
    }
  };

  if (!userData) return <p>⏳ 載入中...</p>;

  return (
    <div className="user-detail-container">
      <h2 className="user-detail-title">
        <i className="user-icon">👤</i> 用戶詳情 - <span>{userData.username}</span>
      </h2>

      <form className="user-detail-form" onSubmit={handleSave}>
        <div className="user-detail-row">
          <label className="user-detail-label">用戶 ID（不可修改）</label>
          <input className="user-detail-input" type="text" value={userData.id} disabled />
        </div>

        <div className="user-detail-row">
          <label className="user-detail-label">帳號</label>
          <input
            className="user-detail-input"
            type="text"
            name="username"
            value={userData.username || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="user-detail-row">
          <label className="user-detail-label">Email</label>
          <input
            className="user-detail-input"
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="user-detail-row">
          <label className="user-detail-label">註冊日期（不可修改）</label>
          <input className="user-detail-input" type="text" value={userData.created_at || ""} disabled />
        </div>

        <div className="user-detail-buttons">
          {isEditing ? (
            <>
              <button type="submit" className="user-detail-button user-detail-save">
                儲存
              </button>
              <button
                type="button"
                className="user-detail-button user-detail-cancel"
                onClick={handleCancel}
              >
                取消
              </button>
            </>
          ) : (
            <button type="button" className="user-detail-button user-detail-edit" onClick={handleEdit}>
              編輯
            </button>
          )}
          <button type="button" className="user-detail-button user-detail-back" onClick={() => navigate(-1)}>
            返回
          </button>
        </div>
      </form>

      {/* 🎥 顯示該用戶上傳的影片 */}
      <h3>📤 上傳的影片</h3>
      <ul>
        {userVideos.length > 0 ? (
          userVideos.map((video) => (
            <li key={video.id}>
              🎥 {video.filename} - <strong>{video.status}</strong>
            </li>
          ))
        ) : (
          <p>這個用戶還沒有上傳影片。</p>
        )}
      </ul>
    </div>
  );
};

export default UserDetail;
