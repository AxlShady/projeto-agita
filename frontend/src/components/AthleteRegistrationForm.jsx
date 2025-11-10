import React, { useState } from 'react';
// (Adicione um CSS se desejar, ex: import './AthleteRegistrationForm.css';)

function AthleteRegistrationForm({ onRegistrationSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Para feedback de sucesso ou erro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Limpa mensagens anteriores

    const userData = {
      username,
      password,
      user_type: 'atleta' 
    };

    try {
      // --- ✅ CORREÇÃO AQUI ---
      // A URL estava errada (/users/create). A correta é /register.
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Atleta "${username}" cadastrado com sucesso!`);
        setUsername(''); // Limpa o formulário
        setPassword('');
        
        if (onRegistrationSuccess) {
          onRegistrationSuccess(); // Avisa o AdminDashboard para atualizar a lista
        }
      } else {
        setMessage(`Erro: ${data.message || 'Falha ao cadastrar.'}`);
      }
    } catch (err) {
      console.error('Erro de rede:', err);
      // Isso não deve mais acontecer, pois a URL está correta
      setMessage('Erro de conexão. O back-end está rodando?');
    }
  };

  return (
    <div className="form-card">
      <h2 className="section-title">Cadastrar Novo Atleta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="athlete-username">Nome de Usuário (Login)</label>
          <input
            type="text"
            id="athlete-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="athlete-password">Senha Inicial</label>
          <input
            type="password"
            id="athlete-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button-primary">Cadastrar Atleta</button>
        {message && <p className="feedback-message">{message}</p>}
      </form>
    </div>
  );
}

export default AthleteRegistrationForm;