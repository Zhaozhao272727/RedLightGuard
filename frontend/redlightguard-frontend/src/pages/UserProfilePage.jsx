import React, { useEffect, useState } from "react";
import ColorPicker from "../components/ColorPicker";
import { useNavigate } from "react-router-dom";
import "../styles/UserProfilePage.css";
import API_BASE_URL from "../config"; // ✅ 統一 API 設定

const UserProfilePage = () => {
  const [videos, setVideos] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
  });

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("❌ 請先登入！");
          navigate("/login");
          return;
        }

        // 🚀 從後端拉取用戶資訊
        const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileResponse.ok) throw new Error("❌ 無法獲取用戶資訊");
        const profileData = await profileResponse.json();

        setUserInfo(profileData.data); // 確保 API 返回的數據正確
        setNewUsername(profileData.data.username);
        setNewEmail(profileData.data.email);

        // 🚀 從後端拉取用戶影片
        const videosResponse = await fetch(`${API_BASE_URL}/user/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!videosResponse.ok) throw new Error("❌ 無法獲取影片列表");
        const videosData = await videosResponse.json();
        setVideos(videosData.data || []);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  // 🚀 更新帳號資訊
  const handleSaveUserInfo = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername, email: newEmail }),
      });

      if (!response.ok) throw new Error("❌ 更新失敗，請稍後再試");

      const data = await response.json();
      setUserInfo(data.data);
      setIsEditing(false);
      alert("✅ 用戶資訊已更新！");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🚀 修改密碼
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("❌ 請輸入舊密碼和新密碼！");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) throw new Error("❌ 密碼更新失敗");

      setOldPassword("");
      setNewPassword("");
      setIsChangingPassword(false);
      alert("✅ 密碼已更新！");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🚀 刪除影片（新增二次確認）
  const handleDeleteVideo = async (videoId) => {
    const confirmDelete = window.confirm("⚠️ 確定要刪除這個影片嗎？此操作無法恢復！");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_BASE_URL}/user/videos/${videoId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("❌ 刪除失敗，請稍後再試");

        setVideos(videos.filter((video) => video.id !== videoId));
        alert("🗑️ 影片已刪除！");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="user-profile-container">
      <ColorPicker />

      <h2 className="page-title">📌 用戶中心</h2>

      <div className="account-info-card">
        <h3>👤 用戶資訊</h3>
        {isEditing ? (
          <>
            <input
              type="text"
              className="input-field"
              placeholder="新用戶名"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="email"
              className="input-field"
              placeholder="新電子郵件"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <div className="user-buttons">
              <button className="btn save-btn" onClick={handleSaveUserInfo}>
                💾 儲存
              </button>
              <button className="btn cancel-btn" onClick={() => setIsEditing(false)}>
                ❌ 取消
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>用戶名：</strong> {userInfo.username}
            </p>
            <p>
              <strong>Email：</strong> {userInfo.email}
            </p>
            <div className="user-buttons">
              <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ 編輯
              </button>
              <button className="btn password-btn" onClick={() => setIsChangingPassword(true)}>
                🔑 修改密碼
              </button>
            </div>
          </>
        )}

        {isChangingPassword && (
          <>
            <input
              type="password"
              className="input-field"
              placeholder="舊密碼"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              className="input-field"
              placeholder="新密碼"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="user-buttons">
              <button className="btn save-btn" onClick={handleChangePassword}>
                🔑 修改密碼
              </button>
              <button className="btn cancel-btn" onClick={() => setIsChangingPassword(false)}>
                ❌ 取消
              </button>
            </div>
          </>
        )}
      </div>

      <h3>📂 我的影片</h3>
      {videos.length === 0 ? (
        <p className="no-videos">目前沒有上傳的影片 📭</p>
      ) : (
        <div className="video-list">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <h3>{video.title}</h3>
              <video controls className="video-player">
                <source src={video.url} type="video/mp4" />
              </video>
              <div className="video-buttons">
                <button className="btn action-btn" onClick={() => window.open(video.url)}>
                  📥 下載
                </button>
                <button className="btn delete-btn" onClick={() => handleDeleteVideo(video.id)}>
                  🗑️ 刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn back-btn" onClick={() => navigate("/upload")}>
        🔙 返回上傳
      </button>
    </div>
  );
};

export default UserProfilePage;
