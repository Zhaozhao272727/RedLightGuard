import React, { useState, useEffect } from 'react';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [uploadSearch, setUploadSearch] = useState('');

  useEffect(() => {
    setUsers([
      { id: 1, name: 'Alice', account: 'alice123' },
      { id: 2, name: 'Bob', account: 'bob456' },
      { id: 3, name: 'Charlie', account: 'charlie789' },
    ]);

    setUploads([
      { id: 1, userId: 1, fileName: 'video1.mp4', status: 'No Red Light' },
      { id: 2, userId: 2, fileName: 'video2.mp4', status: 'Red Light Violation' },
      { id: 3, userId: 3, fileName: 'video3.mp4', status: 'No Red Light' },
    ]);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.account.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredUploads = uploads.filter(
    (upload) =>
      upload.fileName.toLowerCase().includes(uploadSearch.toLowerCase()) ||
      upload.status.toLowerCase().includes(uploadSearch.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h1 className="admin-title">🔑 Admin Dashboard</h1>

      <section className="admin-section">
        <h2>👥 Users ({filteredUsers.length})</h2>
        <input
          type="text"
          placeholder="搜尋用戶名稱或帳號"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="search-input"
        />
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id} className="admin-item">
              <span>{user.name} ({user.account})</span>
              <button className="delete-btn" onClick={() => deleteUser(user.id)}>刪除</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section">
        <h2>📤 Uploads ({filteredUploads.length})</h2>
        <input
          type="text"
          placeholder="搜尋檔案名稱或狀態"
          value={uploadSearch}
          onChange={(e) => setUploadSearch(e.target.value)}
          className="search-input"
        />
        <ul>
          {filteredUploads.map((upload) => (
            <li key={upload.id} className="admin-item">
              <span>
                User {upload.userId} - {upload.fileName} ({upload.status})
              </span>
              <button className="delete-btn" onClick={() => deleteUpload(upload.id)}>刪除</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;  // AdminPage.jsx
