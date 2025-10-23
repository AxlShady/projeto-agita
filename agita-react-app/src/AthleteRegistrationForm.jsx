import React, { useState } from 'react';

function AthleteRegistrationForm({ onRegistrationSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Preencha todos os campos.');
            return;
        }

        try {
            // Rota que o server.js vai usar para criar o usuário
            const response = await fetch('http://localhost:3001/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.status === 201) {
                setMessage(`SUCESSO! Novo atleta ${username} registrado com ID: ${data.userId}.`);
                setUsername('');
                setPassword('');
                // Chama a função para atualizar a lista de atletas (para o dropdown de Notas/Pagamentos)
                if (onRegistrationSuccess) {
                    onRegistrationSuccess();
                }
            } else {
                setMessage(`ERRO: ${data.message || 'Falha no registro.'}`);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
            setMessage('Erro ao conectar com o servidor para registro.');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
            <h2>Cadastrar Novo Atleta (Seguro)</h2>
            <form onSubmit={handleRegistration}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nome de Usuário:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Senha Inicial:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#002244', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Registrar Atleta
                </button>
            </form>
            {message && <p style={{ marginTop: '10px', color: message.includes('SUCESSO') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
}

export default AthleteRegistrationForm;