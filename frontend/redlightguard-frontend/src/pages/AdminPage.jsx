import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';
import '../styles/AdminPage.css';

const StatusTag = ({ status }) => {
  const statusColors = {
    "No Red Light": "green",
    "Red Light Violation": "red",
    "Pending": "yellow",
  };
  return <span className={`status-label ${statusColors[status]}`}>{status}</span>;
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [uploadSearch, setUploadSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectedUploads, setSelectedUploads] = useState(new Set());
  const [themeColor, setThemeColor] = useState("#e57373");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    document.documentElement.style.setProperty("--button-color", themeColor);
    document.documentElement.style.setProperty("--hover-glow-color", themeColor);
  }, [themeColor]);

  useEffect(() => {
    setUsers([
      { id: 1, name: 'Alice', account: 'alice123', registerDate: '2024-01-15' },
      { id: 2, name: 'Bob', account: 'bob456', registerDate: '2024-02-10' },
      { id: 3, name: 'Charlie', account: 'charlie789', registerDate: '2024-03-05' },
    ]);

    setUploads([
      { id: 1, userId: 1, fileName: 'video1.mp4', status: 'No Red Light', thumbnail: 'path-to-thumbnail1' },
      { id: 2, userId: 2, fileName: 'video2.mp4', status: 'Red Light Violation', thumbnail: 'path-to-thumbnail2' },
      { id: 3, userId: 3, fileName: 'video3.mp4', status: 'Pending', thumbnail: 'path-to-thumbnail3' },
    ]);
  }, []);

  const deleteSelectedUsers = () => {
    if (selectedUsers.size === 0) {
      alert("請先選取用戶！");
      return;
    }
    if (window.confirm(`確定刪除 ${selectedUsers.size} 位用戶？`)) {
      setUsers(users.filter(user => !selectedUsers.has(user.id)));
      setSelectedUsers(new Set());
    }
  };

  const deleteSelectedUploads = () => {
    if (selectedUploads.size === 0) {
      alert("請先選取影片！");
      return;
    }
    if (window.confirm(`確定刪除 ${selectedUploads.size} 筆影片紀錄？`)) {
      setUploads(uploads.filter(upload => !selectedUploads.has(upload.id)));
      setSelectedUploads(new Set());
    }
  };

  const filteredUsers = users.filter((user) => {
    const userDate = new Date(user.registerDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || userDate >= start) && (!end || userDate <= end);
  });

  return (
    <div className="admin-container">
      <h1 className="admin-title">🔑 Admin Dashboard</h1>

      {/* 🎨 小球選擇區 */}
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
                  setSelectedUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.has(user.id) ? newSet.delete(user.id) : newSet.add(user.id);
                    return newSet;
                  })
                }
              />
              <span className="clickable-name" onClick={() => navigate(`/admin/user/${user.id}`)}>
                {user.name} ({user.account})
              </span>
            </li>
          ))}
        </ul>
        <button className="delete-btn batch-delete" onClick={deleteSelectedUsers}>批量刪除</button>
      </section>

      {/* 📤 影片上傳區塊 */}
      <section className="admin-section">
        <h2>📤 Uploads ({uploads.length})</h2>
        <ul className="scrollable-list">
          {uploads.map((upload) => (
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
              <img src={upload.thumbnail} alt="thumbnail" className="video-thumbnail" />
              <span>User {upload.userId} - {upload.fileName} <StatusTag status={upload.status} /></span>
            </li>
          ))}
        </ul>
        <button className="delete-btn batch-delete" onClick={deleteSelectedUploads}>批量刪除</button>
      </section>

      <button className="log-btn" onClick={() => navigate("/error-logs")}>📌 查看錯誤日誌</button>

    </div>
  );
};

export default AdminPage;
