import React, { useState } from 'react';

function AthleteRegistrationForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Novos Estados
  const [category, setCategory] = useState('Mirim');
  const [admissionDate, setAdmissionDate] = useState('');
  
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://https://projeto-agita.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username, 
            password, 
            user_type: 'atleta',
            category: category,           // Enviando categoria
            admission_date: admissionDate // Enviando data
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Atleta cadastrado com sucesso!');
        setUsername('');
        setPassword('');
        setAdmissionDate('');
        if (onRegisterSuccess) onRegisterSuccess(); // Atualiza a lista se necessário
      } else {
        setMessage(data.message || 'Erro ao cadastrar.');
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="form-card">
      <h3>Cadastrar Novo Atleta</h3>
      <form onSubmit={handleRegister}>
        <label>Nome de Usuário (Login)</label>
        <input
          type="text"
          placeholder="Ex: ana.silva"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Senha Inicial</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Novos Campos */}
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>Categoria</label>
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                >
                    <option value="Mirim">Mirim</option>
                    <option value="Pré-Infantil">Pré-Infantil</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Juvenil">Juvenil</option>
                    <option value="Adulto">Adulto</option>
                </select>
            </div>

            <div style={{ flex: 1 }}>
                <label>Atleta Desde</label>
                <input
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
            </div>
        </div>

        <button type="submit" className="btn-submit" style={{ marginTop: '20px' }}>
          Cadastrar Atleta
        </button>
      </form>

      {message && <p className={`msg-feedback ${message.includes('sucesso') ? 'success' : 'error'}`}>{message}</p>}
    </div>
  );
}

export default AthleteRegistrationForm;