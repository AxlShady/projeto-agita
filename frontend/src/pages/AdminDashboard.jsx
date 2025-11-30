import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; 
import AthleteDetails from './AthleteDetails.jsx'; 
import * as api from '../services/apiService.js';

// Abas
import TabCadastro from '../components/dashboard/TabCadastro.jsx';
import TabEventos from '../components/dashboard/TabEventos.jsx'; 
import TabNotas from '../components/dashboard/TabNotas.jsx';
import TabPagamentos from '../components/dashboard/TabPagamentos.jsx';

const testUser = { 
  id: 1, 
  username: 'Admin', 
  user_type: 'admin' 
};

function AdminDashboard({ user = testUser, onLogout = () => console.log('Logout!') }) {
  
  const [activeTab, setActiveTab] = useState('cadastro'); 
  const [athletes, setAthletes] = useState([]); 
  const [events, setEvents] = useState([]); 
  const [selectedAthleteId, setSelectedAthleteId] = useState(null); 
  
  useEffect(() => {
      const fetchData = async () => {
        try {
          const athletesData = await api.fetchAthletes();
          setAthletes(athletesData);
          
          const resEvents = await fetch("https://projeto-agita.onrender.com/events");
          const eventsData = await resEvents.json();
          setEvents(eventsData);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };
      fetchData();
  }, []);

  // Renderiza o conteúdo central
  const renderContent = () => {
    if (selectedAthleteId) {
        return <AthleteDetails userId={selectedAthleteId} onBack={() => setSelectedAthleteId(null)} />;
    }

    switch (activeTab) {
      case 'cadastro':
        return (
          <div className="fade-in">
             <h2 className="section-title">Cadastro de Atletas</h2>
             <TabCadastro 
                athletes={athletes} 
                onSelectAthlete={setSelectedAthleteId}
                onRegistrationSuccess={() => api.fetchAthletes().then(setAthletes)} 
             />
          </div>
        );

      case 'eventos':
        return (
            <div className="fade-in">
                <h2 className="section-title">Gestão de Eventos</h2>
                <TabEventos athletes={athletes} />
            </div>
        );

      case 'notas':
        return (
            <div className="fade-in">
                <h2 className="section-title">Lançamento de Notas</h2>
                {/* Passando athletes e events para o TabNotas */}
                <TabNotas athletes={athletes} events={events} />
            </div>
        );

      case 'pagamentos':
        return (
            <div className="fade-in">
                <h2 className="section-title">Gestão Financeira</h2>
                <TabPagamentos athletes={athletes} />
            </div>
        );

      default:
        return <div className="empty-state">Selecione uma opção.</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      
      {/* --- CABEÇALHO SUPERIOR (Igual ao Atleta) --- */}
      <header className="admin-header">
        <div className="header-logo">
            <h2>AGITA <span>Admin</span></h2>
        </div>
        
        <nav className="admin-nav">
          <button 
            onClick={() => setActiveTab('cadastro')} 
            className={activeTab === 'cadastro' ? 'active' : ''}
          >
            Atletas
          </button>
          <button 
            onClick={() => setActiveTab('eventos')} 
            className={activeTab === 'eventos' ? 'active' : ''}
          >
            Eventos
          </button>
          <button 
            onClick={() => setActiveTab('notas')} 
            className={activeTab === 'notas' ? 'active' : ''}
          >
            Notas
          </button>
          <button 
            onClick={() => setActiveTab('pagamentos')} 
            className={activeTab === 'pagamentos' ? 'active' : ''}
          >
            Pagamentos
          </button>
        </nav>

        <div className="header-user">
          <span>Olá, <strong>{user.username}</strong></span>
          <button onClick={onLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="admin-content">
       {renderContent()}
      </main>

    </div>
  );
}

export default AdminDashboard;