import React, { useState } from 'react';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`歡迎，${name}！你的用戶 ID 是：${userId}，帳號是：${account}`);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
  <h2>登入 RedLightGuard</h2>
  <input
    type="text"
    placeholder="用戶 ID"
    value={userId}
    onChange={(e) => setUserId(e.target.value)}
    style={styles.input}
  />
  <input
    type="text"
    placeholder="名字"
    value={name}
    onChange={(e) => setName(e.target.value)}
    style={styles.input}
  />
  <input
    type="text"
    placeholder="帳號"
    value={account}
    onChange={(e) => setAccount(e.target.value)}
    style={styles.input}
  />
  <button type="submit" style={styles.button}>登入</button>
</form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    padding: '0.5rem',
    margin: '0.5rem 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '0.5rem',
    borderRadius: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default LoginForm;
