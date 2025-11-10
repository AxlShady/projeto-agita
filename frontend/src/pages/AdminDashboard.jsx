import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; 
import AthleteDetails from './AthleteDetails.jsx'; 
import * as api from '../services/apiService.js';

// Importa todas as abas
import TabCadastro from '../components/dashboard/TabCadastro.jsx';
import TabEventos from '../components/dashboard/TabEventos.jsx'; 
import TabNotas from '../components/dashboard/TabNotas.jsx';
import TabPagamentos from '../components/dashboard/TabPagamentos.jsx';
import TabDocumentos from '../components/dashboard/TabDocumentos.jsx';

// Todos os 'initialForm' foram movidos para seus respectivos componentes.

// Este é o usuário "falso" do teste
const testUser = { 
  id: 1, 
  username: 'admin_teste', 
  user_type: 'admin' 
};

function AdminDashboard({ user = testUser, onLogout = () => console.log('Logout!') }) {
  
  // --- Estados de Controle e Dados ---
  // Todos os estados das abas foram MOVIDOS para seus componentes filhos.
  const [activeTab, setActiveTab] = useState('cadastro'); 
  const [athletes, setAthletes] = useState([]); // O único estado que é compartilhado
  const [selectedAthleteId, setSelectedAthleteId] = useState(null); 
  
  // useEffect agora só busca os dados compartilhados
  useEffect(() => {
      console.log("AdminDashboard montado. Buscando dados compartilhados...");

      const fetchData = async () => {
        try {
          // Só busca os dados que TODOS os filhos precisam (atletas)
          const athletesData = await api.fetchAthletes();
          console.log("Atletas recebidos:", athletesData); 
          setAthletes(athletesData);
          
        } catch (error) {
          console.error("ERRO GRAVE ao buscar dados no useEffect:", error);
        }
      };

      fetchData();
  }, []); // O [] garante que isso só roda UMA VEZ

// --- FUNÇÕES DE AÇÃO ---
// TODAS as funções (handleCreateEvent, handleCreateGrade, etc.) 
// foram MOVIDAS para seus respectivos componentes de aba.

// --- FUNÇÃO DE RENDERIZAÇÃO DO CONTEÚDO (SUPER LIMPA) ---
  const renderContent = () => {
    
    if (selectedAthleteId) {
        return <AthleteDetails userId={selectedAthleteId} onBack={() => setSelectedAthleteId(null)} />;
    }

    switch (activeTab) {
      case 'cadastro':
        return (
          <TabCadastro 
            athletes={athletes} // Passa a lista de atletas
            onSelectAthlete={setSelectedAthleteId}
            onRegistrationSuccess={() => api.fetchAthletes().then(setAthletes)} // Função para atualizar a lista
          />
        );

      case 'eventos':
        return <TabEventos />; // Componente independente

      case 'notas':
        return <TabNotas athletes={athletes} />; // Passa a lista de atletas

      case 'pagamentos':
        return <TabPagamentos athletes={athletes} />; // Passa a lista de atletas

      case 'documentos': 
        return <TabDocumentos athletes={athletes} />; // Passa a lista de atletas

      default:
        return <div>Selecione uma opção no menu.</div>;
    }
  };

  // --- O JSX Principal (Sidebar e Conteúdo) ---
  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h3>AGITA - Admin</h3>
        <nav>
          <button onClick={() => setActiveTab('cadastro')} className={activeTab === 'cadastro' ? 'active' : ''}>Cadastro de Atletas</button>
          <button onClick={() => setActiveTab('eventos')} className={activeTab === 'eventos' ? 'active' : ''}>Eventos e Categorias</button>
          <button onClick={() => setActiveTab('notas')} className={activeTab === 'notas' ? 'active' : ''}>Lançar Notas</button>
          <button onClick={() => setActiveTab('pagamentos')} className={activeTab === 'pagamentos' ? 'active' : ''}>Pagamentos</button>
          <button onClick={() => setActiveTab('documentos')} className={activeTab === 'documentos' ? 'active' : ''}>Documentos</button>
        </nav>
        <div className="sidebar-footer">
          {user && <p>Logado como: <strong>{user.username}</strong></p>}
      <button onClick={onLogout} className="logout-button">Sair</button>
     </div>
      </div>
      <main className="main-content">
       {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;