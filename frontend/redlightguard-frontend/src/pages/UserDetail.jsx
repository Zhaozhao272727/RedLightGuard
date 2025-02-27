import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDetail.css";

const UserDetail = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // **🌟 預設假資料，防止 API 還沒做時畫面掛掉**
  const defaultUser = {
    id: 1,
    account: "user1",
    password: "",
    registerDate: "2024-01-15",
    extra1: "",
    extra2: "",
    extra3: "",
  };

  const [userData, setUserData] = useState(defaultUser);
  const [originalUserData, setOriginalUserData] = useState(defaultUser);

  useEffect(() => {
    console.log("正在載入用戶資料...");
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/1");

        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`);
        }

        const text = await response.text();
        console.log("API 回應內容：", text);

        const data = JSON.parse(text);
        if (data) {
          setUserData(data);
          setOriginalUserData(data);
        }
      } catch (error) {
        console.error("❌ 獲取 API 用戶資料失敗，使用預設假資料", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    console.log("取消按鈕被點擊 🚨");
    console.log("恢復原始 userData:", originalUserData);
    setUserData(originalUserData); // ✅ 恢復原始資料
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${userData.id}`, {
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
      alert("更新成功！🎉");
    } catch (error) {
      console.error("❌ 更新失敗", error);
      alert("更新失敗，請重試！");
    }
  };

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

        <div className="user-detail-row">
          <label className="user-detail-label">預留欄位 1</label>
          <input className="user-detail-input" type="text" name="extra1" value={userData.extra1} onChange={handleChange} disabled={!isEditing} />
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
    </div>
  );
};

export default UserDetail;
