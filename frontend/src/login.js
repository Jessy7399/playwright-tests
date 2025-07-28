import React, { useState } from 'react';
import './login.css';

//const BASE_URL = '';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      setMessage('❗ Passwords do not match');
      return;
    }

    const payload = isRegister
      ? { username, password, email }
      : { username, password };

    const endpoint = isRegister ? 'register' : 'login';

    try {
      const response = await fetch(`/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
     });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);

        if (isRegister) {
          setIsRegister(false);
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setIsLoggedIn(true);
        }
      } else {
        setMessage(`❌ ${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        )}

        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>

      <p className="toggle-text">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          className="toggle-link"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage('');
          }}
        >
          {isRegister ? 'Login' : 'Register'}
        </span>
      </p>

      {message && (
        <p className={`message ${message.startsWith('✅') ? 'success' : ''}`}>
          {message}
        </p>
      )}
    </div>
  );
}
