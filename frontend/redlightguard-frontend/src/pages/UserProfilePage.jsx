import React, { useEffect, useState } from 'react';
import ColorPicker from '../components/ColorPicker'; // 🎨 引入主題顏色小球
import '../styles/UserProfilePage.css'; // ✨ 確保 CSS 正確引用
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const [videos, setVideos] = useState([]);
    const [userInfo, setUserInfo] = useState({ username: "", email: "" });
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // 🚀 未來串 API 拿用戶資料
        setUserInfo({ username: "User123", email: "user@example.com" });

        // 🚀 未來串 API 拿影片資料
        setVideos([
            { id: 1, title: '原始影片', url: 'https://example.com/original.mp4' },
            { id: 2, title: '裁切影片 1', url: 'https://example.com/cut1.mp4' }
        ]);
    }, []);

    return (
        <div className="user-profile-container">
            {/* 🎨 加入主題顏色小球 */}
            <ColorPicker />

            {/* 🆕 用戶詳情卡片（顯示在最上方） */}
            <div className="account-info-card">
                <h2>👤 用戶資訊</h2>
                <input type="text" className="input-field" placeholder="新用戶名" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
<input type="email" className="input-field" placeholder="新電子郵件" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <input type="text" placeholder="新用戶名" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                <input type="email" placeholder="新電子郵件" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <button className="update-btn">更新帳號資訊</button>
                
                <input type="password" className="input-field" placeholder="舊密碼" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                <input type="password" className="input-field" placeholder="新密碼" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button className="update-btn">修改密碼</button>
            </div>

            {/* 🎬 影片區塊 */}
            <h2 className="section-title">📂 我的影片</h2>
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
                            <button className="download-btn" onClick={() => window.open(video.url)}>
                                下載影片 📥
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button className="back-btn" onClick={() => navigate('/upload')}>🔙 返回上傳</button>
        </div>
    );
};

export default UserProfilePage;
