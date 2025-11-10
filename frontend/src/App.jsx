import React, { useState, useEffect } from 'react'; // <-- 1. IMPORTAMOS O useEffect

import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AthleteDashboard from './pages/AthleteDashboard.jsx';
import './App.css';

function App() {
  
  const [currentUser, setCurrentUser] = useState(null);

  // --- ✅ CORREÇÃO DO F5 (INÍCIO) ---
  // Este useEffect roda UMA VEZ (graças ao "[]" no final)
  // assim que o App.js é carregado (ex: no F5)
  useEffect(() => {
    // 1. Tenta pegar o usuário que foi "lembrado" no localStorage
    const storedUser = localStorage.getItem('user');
    
    // 2. Se encontrou alguém...
    if (storedUser) {
      // 3. Coloca ele no estado (loga o usuário)
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []); // <-- O [] vazio garante que isso rode só no início
  // --- ✅ CORREÇÃO DO F5 (FIM) ---


  // Esta função é chamada pelo Login.jsx (já está correta)
  // O Login.jsx salva no localStorage, e aqui atualizamos o estado
  const handleLoginSuccess = (userData) => {
    console.log("Usuário logado no App.jsx:", userData);
    setCurrentUser(userData);
  };

  // Esta função será usada para o botão de "Sair"
  const handleLogout = () => {
    console.log("Deslogando...");

    // --- ✅ CORREÇÃO DO LOGOUT ---
    // 1. Limpa o "lembrete" do localStorage
    localStorage.removeItem('user'); 
    // 2. Limpa o estado do React
    setCurrentUser(null);
    // (O 'if' abaixo vai automaticamente mostrar a tela de Login)
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---
  // (Esta parte já está 100% correta)

  // Se não há usuário logado, mostre a tela de Login
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Se há um usuário logado, decidimos qual painel mostrar
  switch (currentUser.user_type) {
    case 'admin':
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    
    case 'atleta':
      return <AthleteDashboard user={currentUser} onLogout={handleLogout} />;
    
    default:
      return (
        <div>
          <p>Tipo de usuário desconhecido: {currentUser.user_type}</p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      );
  }
}

export default App;