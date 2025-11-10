// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ AQUI ESTÁ A CORREÇÃO:
        // 1. Salva o usuário no "lembrete" do navegador (localStorage)
        localStorage.setItem('user', JSON.stringify(data.user));

        // 2. Avisa o App.js para atualizar o estado (como você já fazia)
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Falha no login.');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError('Não foi possível conectar ao servidor. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login - AGITA</h2>

        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
}

export default Login;