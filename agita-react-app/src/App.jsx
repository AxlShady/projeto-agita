import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard.jsx';
import AthleteDashboard from './AthleteDashboard';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('Login bem-sucedido! Bem-vindo, ' + data.user.username + '!');
        setIsLoggedIn(true);
        setUserType(data.user.user_type);
        setUserId(data.user.id);
      } else {
        setMessage(data.message || 'Erro no login.');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
      console.error('Erro de conexão:', error);
    }
  };

  if (isLoggedIn) {
    if (userType === 'admin') {
      return <AdminDashboard userId={userId} />;
    }
    if (userType === 'atleta') {
      return <AthleteDashboard userId={userId} />;
    }
  }

  return (
    <div className="login-container">
      <h1>Login AGITA</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p className="login-message">{message}</p>
    </div>
  );
}

export default App;