import React, { useEffect, useState } from "react";
import ColorPicker from "../components/ColorPicker";
import { useNavigate } from "react-router-dom";
import "../styles/UserProfilePage.css";

const UserProfilePage = () => {
    const [videos, setVideos] = useState([]);
    const [userInfo, setUserInfo] = useState({ username: "Zhaozhao", email: "zhaozhao@example.com" });
    const [newUsername, setNewUsername] = useState(userInfo.username);
    const [newEmail, setNewEmail] = useState(userInfo.email);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 🚀 模擬 API 獲取影片
        setVideos([
            { id: 1, title: "原始影片", url: "https://example.com/original.mp4", isOriginal: true },
            { id: 2, title: "裁切影片 1", url: "https://example.com/cut1.mp4", isOriginal: false }
        ]);
    }, []);

    // 🚀 更新帳號資訊
    const handleSaveUserInfo = () => {
        setUserInfo({ username: newUsername, email: newEmail });
        setIsEditing(false);
        alert("✅ 用戶資訊已更新！");
    };

    // 🚀 修改密碼
    const handleChangePassword = () => {
        if (!oldPassword || !newPassword) {
            alert("❌ 請輸入舊密碼和新密碼！");
            return;
        }
        setOldPassword("");
        setNewPassword("");
        setIsChangingPassword(false);
        alert("✅ 密碼已更新！");
    };

    // 🚀 刪除影片（新增二次確認）
    const handleDeleteVideo = (videoId) => {
        const confirmDelete = window.confirm("⚠️ 確定要刪除這個影片嗎？此操作無法恢復！");
        if (confirmDelete) {
            setVideos(videos.filter(video => video.id !== videoId));
            alert("🗑️ 影片已刪除！");
        }
    };

    return (
        <div className="user-profile-container">
            <ColorPicker />

            {/* 🏷️ **標題** */}
            <h2 className="page-title">📌 用戶中心</h2>

            {/* 👤 **用戶資訊** */}
            <div className="account-info-card">
                <h3>👤 用戶資訊</h3>
                {isEditing ? (
                    <>
                        <input type="text" className="input-field" placeholder="新用戶名" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                        <input type="email" className="input-field" placeholder="新電子郵件" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        <div className="user-buttons">
                            <button className="btn save-btn" onClick={handleSaveUserInfo}>💾 儲存</button>
                            <button className="btn cancel-btn" onClick={() => setIsEditing(false)}>❌ 取消</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p><strong>用戶名：</strong> {userInfo.username}</p>
                        <p><strong>Email：</strong> {userInfo.email}</p>
                        <div className="user-buttons">
                            <button className="btn edit-btn" onClick={() => setIsEditing(true)}>✏️ 編輯</button>
                            <button className="btn password-btn" onClick={() => setIsChangingPassword(true)}>🔑 修改密碼</button>
                        </div>
                    </>
                )}

                {/* 🔒 **修改密碼區塊（間距更均勻）** */}
{isChangingPassword && (
    <>
        <input type="password" className="input-field" placeholder="舊密碼" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <input type="password" className="input-field" placeholder="新密碼" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <div className="user-buttons">
            <button className="btn save-btn" onClick={handleChangePassword}>🔑 修改密碼</button>
            <button className="btn cancel-btn" onClick={() => setIsChangingPassword(false)}>❌ 取消</button>
        </div>
    </>
)}

            </div>

            {/* 🎥 **影片列表** */}
            <h3>📂 我的影片</h3>
            {videos.length === 0 ? (
                <p className="no-videos">目前沒有上傳的影片 📭</p>
            ) : (
                <div className="video-list">
                    {videos.map(video => (
                        <div key={video.id} className="video-card">
                            <h3>{video.title}</h3>
                            <video controls className="video-player">
                                <source src={video.url} type="video/mp4" />
                            </video>
                            <div className="video-buttons">
                                <button className="btn action-btn" onClick={() => window.open(video.url)}>📥 下載</button>
                                {video.isOriginal && (
                                    <button className="btn action-btn" onClick={() => alert("🚀 重新分析中...")}>🔄 重新分析</button>
                                )}
                                <button className="btn delete-btn" onClick={() => handleDeleteVideo(video.id)}>🗑️ 刪除</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="btn back-btn" onClick={() => navigate("/upload")}>🔙 返回上傳</button>
        </div>
    );
};

export default UserProfilePage;
