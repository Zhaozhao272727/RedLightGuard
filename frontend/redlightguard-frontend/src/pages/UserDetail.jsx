import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UserDetail.css";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 取得用戶 ID
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [userVideos, setUserVideos] = useState([]);

  useEffect(() => {
    console.log("正在載入用戶資料...");
    
    // 🚀 取得用戶資料
    fetch(`${API_BASE_URL}/users/${id}`)
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        setOriginalUserData(data);
      })
      .catch(error => console.error("❌ 無法獲取用戶資料:", error));

    // 🎥 取得該用戶上傳的影片
    fetch("${API_BASE_URL}/videos")
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.data) {
          const videos = data.data.data.filter(video => video.user_id === id);
          setUserVideos(videos);
        }
      })
      .catch(error => console.error("❌ 無法獲取影片資料:", error));
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserData(originalUserData); // 恢復原始資料
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: userData.account,
          password: userData.password,
          extra1: userData.extra1,
          extra2: userData.extra2,
          extra3: userData.extra3,
        }),
      });

      if (!response.ok) throw new Error("更新失敗");

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
        <i className="user-icon">👤</i> 用戶詳情 - <span>{userData.account}</span>
      </h2>

      <form className="user-detail-form" onSubmit={handleSave}>
        <div className="user-detail-row">
          <label className="user-detail-label">用戶 ID（不可修改）</label>
          <input className="user-detail-input" type="text" value={userData.id} disabled />
        </div>

        <div className="user-detail-row">
          <label className="user-detail-label">帳號</label>
          <input className="user-detail-input" type="text" name="account" value={userData.account} onChange={handleChange} disabled={!isEditing} />
        </div>

        <div className="user-detail-row">
          <label className="user-detail-label">密碼</label>
          <input className="user-detail-input" type="password" name="password" value={userData.password} onChange={handleChange} disabled={!isEditing} />
        </div>

        <div className="user-detail-row">
          <label className="user-detail-label">註冊日期（不可修改）</label>
          <input className="user-detail-input" type="text" value={userData.registerDate} disabled />
        </div>

        <div className="user-detail-buttons">
          {isEditing ? (
            <>
              <button type="submit" className="user-detail-button user-detail-save">儲存</button>
              <button type="button" className="user-detail-button user-detail-cancel" onClick={handleCancel}>取消</button>
            </>
          ) : (
            <button type="button" className="user-detail-button user-detail-edit" onClick={handleEdit}>編輯</button>
          )}
          <button type="button" className="user-detail-button user-detail-back" onClick={() => navigate(-1)}>返回</button>
        </div>
      </form>

      {/* 🎥 顯示該用戶上傳的影片 */}
      <h3>📤 上傳的影片</h3>
      <ul>
        {userVideos.length > 0 ? (
          userVideos.map(video => (
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
