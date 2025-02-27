import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [uploadSearch, setUploadSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectedUploads, setSelectedUploads] = useState(new Set());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setUsers([
      { id: 1, name: "Alice", account: "alice123", registerDate: "2024-01-15" },
      { id: 2, name: "Bob", account: "bob456", registerDate: "2024-02-10" },
      { id: 3, name: "Charlie", account: "charlie789", registerDate: "2024-03-05" },
    ]);

    setUploads([
      { id: 1, userId: 1, fileName: "video1.mp4", status: "No Red Light" },
      { id: 2, userId: 2, fileName: "video2.mp4", status: "Red Light Violation" },
      { id: 3, userId: 3, fileName: "video3.mp4", status: "No Red Light" },
    ]);
  }, []);

  const deleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const deleteUpload = (uploadId) => {
    setUploads(uploads.filter((upload) => upload.id !== uploadId));
  };

  const deleteSelectedUsers = () => {
    if (selectedUsers.size === 0) {
      alert("請先選取用戶！");
      return;
    }
    const confirmDelete = window.confirm(`確定刪除 ${selectedUsers.size} 位用戶？`);
    if (!confirmDelete) return;
    setUsers(users.filter((user) => !selectedUsers.has(user.id)));
    setSelectedUsers(new Set());
  };

  const deleteSelectedUploads = () => {
    if (selectedUploads.size === 0) {
      alert("請先選取影片！");
      return;
    }
    const confirmDelete = window.confirm(`確定刪除 ${selectedUploads.size} 筆影片紀錄？`);
    if (!confirmDelete) return;
    setUploads(uploads.filter((upload) => !selectedUploads.has(upload.id)));
    setSelectedUploads(new Set());
  };

  const filteredUsers = users.filter((user) => {
    const userDate = new Date(user.registerDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || userDate >= start) && (!end || userDate <= end);
  });

  const filteredUploads = uploads.filter(
    (upload) =>
      upload.fileName.toLowerCase().includes(uploadSearch.toLowerCase()) ||
      upload.status.toLowerCase().includes(uploadSearch.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h1 className="admin-title">🔑 Admin Dashboard</h1>

      {/* 👥 用戶區塊 */}
      <section className="admin-section">
        <h2>👥 Users ({filteredUsers.length})</h2>
        <input
          type="text"
          placeholder="搜尋用戶名稱或帳號"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-container">
          <label>篩選日期區間：</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span> - </span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <ul className="scrollable-list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="admin-item">
              <label className="checkbox-label" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="large-checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() =>
                    setSelectedUsers((prev) => {
                      const newSet = new Set(prev);
                      newSet.has(user.id) ? newSet.delete(user.id) : newSet.add(user.id);
                      return newSet;
                    })
                  }
                />
              </label>
              <span onClick={() => navigate(`/admin/user/${user.id}`)}>
                {user.name} ({user.account}) - {user.registerDate}
              </span>
              <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteUser(user.id); }}>刪除</button>
            </li>
          ))}
        </ul>
        <button className="delete-btn batch-delete" onClick={deleteSelectedUsers}>批量刪除</button>
      </section>

      {/* 📤 影片上傳區塊 */}
      <section className="admin-section">
        <h2>📤 Uploads ({filteredUploads.length})</h2>
        <input
          type="text"
          placeholder="搜尋檔案名稱或狀態"
          value={uploadSearch}
          onChange={(e) => setUploadSearch(e.target.value)}
          className="search-input"
        />
        <ul className="scrollable-list">
          {filteredUploads.map((upload) => (
            <li key={upload.id} className="admin-item">
              <label className="checkbox-label" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="large-checkbox"
                  checked={selectedUploads.has(upload.id)}
                  onChange={() =>
                    setSelectedUploads((prev) => {
                      const newSet = new Set(prev);
                      newSet.has(upload.id) ? newSet.delete(upload.id) : newSet.add(upload.id);
                      return newSet;
                    })
                  }
                />
              </label>
              <span>User {upload.userId} - {upload.fileName} ({upload.status})</span>
              <button className="delete-btn" onClick={() => deleteUpload(upload.id)}>刪除</button>
            </li>
          ))}
        </ul>
        <button className="delete-btn batch-delete" onClick={deleteSelectedUploads}>批量刪除</button>
      </section>
    </div>
  );
};

export default AdminPage;
