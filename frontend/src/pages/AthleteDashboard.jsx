import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AthleteDashboard.css'; 

function AthleteDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dados"); 
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [grades, setGrades] = useState([]); 
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Buscando dados...
      fetch(`http://localhost:3001/events/athlete/${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => setEvents(data || []))
        .catch((err) => console.error(err));

      fetch(`http://localhost:3001/grades/athlete/${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => setGrades(data || []))
        .catch((err) => console.error(err));

      fetch(`http://localhost:3001/payments/athlete/${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => setPayments(data || []))
        .catch((err) => console.error(err));

    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusClass = (status) => {
      if (!status) return '';
      const s = status.toLowerCase();
      return s === 'pago' ? 'status-pago' : s === 'pendente' ? 'status-pendente' : 'status-atrasado';
  };

  if (!user) return <div className="loading-container">Carregando...</div>;

  return (
    <div className="athlete-dashboard">
      
      {/* CABEÇALHO */}
      <header className="athlete-header">
        <div className="header-logo">
          <h2>AGITA <span>Atleta</span></h2>
        </div>
        
        <nav className="header-nav">
          <button className={activeTab === 'dados' ? 'active' : ''} onClick={() => setActiveTab('dados')}>Meus Dados</button>
          <button className={activeTab === 'notas' ? 'active' : ''} onClick={() => setActiveTab('notas')}>Notas</button>
          <button className={activeTab === 'pagamentos' ? 'active' : ''} onClick={() => setActiveTab('pagamentos')}>Pagamentos</button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Eventos</button>
        </nav>

        <div className="header-user">
          <span>Olá, <strong>{user.username}</strong></span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="athlete-content">
        
        {/* MEUS DADOS */}
        {activeTab === 'dados' && (
           <div className="content-pane fade-in">
             <h3 className="page-title">Meus Dados Cadastrais</h3>
             <div className="card profile-card">
                <div className="info-row">
                    <label>Nome Completo</label>
                    <p className="text-primary">{user.username}</p>
                </div>
                <div className="info-row">
                    <label>Matrícula</label>
                    <p>#{user.id}</p>
                </div>
                <div className="info-row">
                    <label>Categoria</label>
                    <p className="text-highlight">{user.category || 'Não definida'}</p>
                </div>
                <div className="info-row no-border">
                    <label>Situação</label>
                    <p className="text-success">Ativo</p>
                </div>
             </div>
           </div>
        )}

        {/* NOTAS */}
        {activeTab === 'notas' && (
            <div className="content-pane fade-in">
                <h3 className="page-title">Minhas Avaliações</h3>
                {grades.length > 0 ? (
                    <div className="card table-container">
                        <table className="agita-table">
                            <thead>
                                <tr>
                                    <th>Evento</th>
                                    <th>Aparelho</th>
                                    <th>Data</th>
                                    <th>Nota</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade) => (
                                    <tr key={grade.id}>
                                        <td>{grade.event_name || 'Evento'}</td>
                                        <td>{grade.apparatus_id}</td>
                                        <td>{new Date(grade.evaluation_date).toLocaleDateString()}</td>
                                        <td><span className="grade-badge">{grade.score}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : ( <div className="empty-state">Nenhuma nota lançada ainda.</div> )}
            </div>
        )}

        {/* PAGAMENTOS */}
        {activeTab === 'pagamentos' && (
            <div className="content-pane fade-in">
                <h3 className="page-title">Histórico Financeiro</h3>
                {payments.length > 0 ? (
                    <div className="card table-container">
                        <table className="agita-table">
                            <thead>
                                <tr>
                                    <th>Referência</th>
                                    <th>Valor</th>
                                    <th>Vencimento</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((pay) => (
                                    <tr key={pay.id}>
                                        <td>{pay.reference_month}</td>
                                        <td className="text-bold">R$ {pay.amount}</td>
                                        <td>{new Date(pay.due_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(pay.status)}`}>
                                                {pay.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : ( <div className="empty-state">Nenhum pagamento registrado.</div> )}
            </div>
        )}

        {/* EVENTOS */}
        {activeTab === 'events' && (
          <div className="content-pane fade-in">
            <h3 className="page-title">Minhas Competições</h3>
            <div className="events-grid">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="card event-card">
                    <h4>{event.name || event.title}</h4>
                    <p><strong>Data:</strong> {new Date(event.event_date || event.date).toLocaleDateString()}</p>
                    <p><strong>Local:</strong> {event.location}</p>
                    {event.description && <p className="description">{event.description}</p>}
                  </div>
                ))
              ) : ( <div className="empty-state">Nenhum evento programado.</div> )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AthleteDashboard;