'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setUserData(null);

    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      setUserData(response.data);
    } catch (err) {
      setError('Username atau password salah.');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '80px auto',
      padding: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff',
      fontFamily: 'Arial',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>🔐 Login to Your Account</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}

      {userData && (
        <div style={{
          marginTop: '30px',
          padding: '15px',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>User Info</h3>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
          <img src={userData.image} alt="User" style={{ width: '60px', borderRadius: '50%' }} />
          <p><strong>Token:</strong> {userData.token || 'N/A'}</p>

          <Link href="/playlist">
            <button style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              Go to Stock 
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}