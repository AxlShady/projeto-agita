import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import FileUpload from './FileUpload';
import AthleteRegistrationForm from './AthleteRegistrationForm.jsx';
import AthleteDetails from './AthleteDetails.jsx'; 
import ReportTable from './ReportTable.jsx'; // Importa o componente de tabela

function AdminDashboard(props) {
  // ... (Estados de Controle e Dados) ...
  const [activeTab, setActiveTab] = useState('cadastro'); 
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  
  const [events, setEvents] = useState([]); 
  const [documents, setDocuments] = useState([]);
  const [athletes, setAthletes] = useState([]); 
  const [ageCategories, setAgeCategories] = useState([]);
  const [apparatusList, setApparatusList] = useState([]);
  const [eventsList, setEventsList] = useState([]); 
  
  const [gradesReport, setGradesReport] = useState([]); 
  const [paymentsReport, setPaymentsReport] = useState([]); 

  const [selectedAthleteId, setSelectedAthleteId] = useState(null); 
  
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [selectedAgeCategory, setSelectedAgeCategory] = useState('');
  const [selectedApparatus, setSelectedApparatus] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [score, setScore] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10)); 
  const [paymentStatus, setPaymentStatus] = useState('Pago'); 
  const [proofFile, setProofFile] = useState(null); 


  // --- FUNÇÕES DE BUSCA ---
  // (Mantenha suas funções de busca existentes aqui)
  const fetchEvents = async () => { /* ... */ };
  const fetchDocuments = async () => { /* ... */ };
  const fetchAthletes = async () => { /* ... */ };
  const fetchAgeCategories = async () => { /* ... */ };
  const fetchApparatus = async () => { /* ... */ };
  const fetchEventsList = async () => { /* ... */ };

  // NOVAS FUNÇÕES DE BUSCA DE RELATÓRIOS
  const fetchGradesReport = async () => { /* ... */ };
  const fetchPaymentsReport = async () => { /* ... */ };
  
  // Carrega todos os dados ao iniciar o componente
  useEffect(() => {
    fetchEvents();
    fetchDocuments();
    fetchAthletes();
    fetchAgeCategories();
    fetchApparatus();
    fetchEventsList();
    fetchGradesReport(); // Busca relatório de notas
    fetchPaymentsReport(); // Busca relatório de pagamentos
  }, []);

  // --- FUNÇÕES DE AÇÃO ---
  // (Mantenha suas funções de ação existentes aqui)
  const handleCreateEvent = async (e) => { /* ... */ };
  const handleCreateCategory = async (e) => { /* ... */ };
  const handleDeleteEvent = async (id) => { /* ... */ };
  const handleDeleteDocument = async (id) => { /* ... */ };
  const handleCreateGrade = async (e) => { /* ... */ };
  const handleCreatePayment = async (e) => { /* ... */ };


  // --- FUNÇÃO DE RENDERIZAÇÃO DO CONTEÚDO (NOVAS ABAS) ---
  const renderContent = () => {
    
    // 1. SE UM ATLETA FOI SELECIONADO NA LISTA, RENDERIZA A TELA DE DETALHES PESSOAIS
    if (selectedAthleteId) {
        return <AthleteDetails userId={selectedAthleteId} onBack={() => setSelectedAthleteId(null)} />;
    }

    switch (activeTab) {
      case 'cadastro':
        return (
          <div className="tab-content">
            {/* 1. CADASTRO DE NOVO ATLETA */}
            <AthleteRegistrationForm onRegistrationSuccess={fetchAthletes} />
            
            <hr className="separator" />
            
            {/* 2. LISTA DE ATLETAS E NAVEGAÇÃO (VISÃO CENTRALIZADA) */}
            <h2 className="section-title">Atletas Cadastrados ({athletes.length})</h2>
            <div className="athletes-list">
              {athletes.length > 0 ? (
                athletes.map((athlete) => (
                  <div 
                    key={athlete.id} 
                    className="athlete-item"
                    onClick={() => setSelectedAthleteId(athlete.id)} 
                  >
                    <strong>Matrícula {athlete.id}:</strong> {athlete.username} 
                    <span className="details-link">Visualizar Detalhes →</span>
                  </div>
                ))
              ) : (
                <p>Nenhum atleta cadastrado ainda.</p>
              )}
            </div>

            <hr className="separator" />

            {/* 3. CRIAÇÃO DE CATEGORIA - MANTIDA AQUI PARA SIMPLIFICAR */}
            <div className="form-card">
              <h2>Cadastrar Categoria de Nota</h2>
              <form onSubmit={handleCreateCategory}>
                  <label>Nome da Categoria:<input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required /></label>
                  <button type="submit">Criar Categoria</button>
              </form>
              <h3 className="section-title" style={{ color: '#002244', borderBottom: 'none' }}>Categorias Existentes</h3>
              <ul className="category-list">
                  {ageCategories.map(cat => (<li key={cat.id}>{cat.name}</li>))}
              </ul>
            </div>
          </div>
        );

      case 'eventos': // ABA DE GERENCIAR EVENTOS E CRIAÇÃO (CORREÇÃO DE LAYOUT)
        return (
            <div className="tab-content">
                <h2 className="section-title">Gerenciamento de Eventos e Criação</h2>

                <div className="forms-container">
                    {/* CRIAÇÃO DE CATEGORIA */}
                    <div className="form-card">
                        <h2>Cadastrar Categoria de Nota</h2>
                        <form onSubmit={handleCreateCategory}>
                            <label>Nome da Categoria:<input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required /></label>
                            <button type="submit">Criar Categoria</button>
                        </form>
                        <h3 className="section-title" style={{ color: '#002244', borderBottom: 'none' }}>Categorias Existentes</h3>
                        <ul className="category-list">
                            {ageCategories.map(cat => (<li key={cat.id}>{cat.name}</li>))}
                        </ul>
                    </div>
                    
                    {/* CRIAÇÃO E LISTAGEM DE EVENTO */}
                    <div className="form-card">
                        <h2>Criar Novo Evento</h2>
                        <form onSubmit={handleCreateEvent}>
                            <label htmlFor="title">Título do Evento:</label><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            <label htmlFor="eventDate">Data:</label><input type="date" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                            <label htmlFor="location">Local:</label><input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                            <label htmlFor="description">Descrição:</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            <button type="submit">Criar Evento</button>
                        </form>
                        <h3 className="section-title" style={{ color: '#002244', borderBottom: 'none' }}>Eventos Cadastrados</h3>
                        <ul className="existing-events-list">
                            {events.map(event => (
                                <li key={event.id}>
                                    <span>{event.title} - {event.location}</span>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="delete-button">Excluir</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );


      case 'notas': // ABA LANÇAR NOTAS E VER HISTÓRICO
        return (
          <div className="tab-content">
            <div className="form-card">
              <h2 className="section-title">Lançamento de Notas</h2>
              <form onSubmit={handleCreateGrade}>
                {/* Atleta */}
                <label htmlFor="athlete">Atleta:</label><select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required><option value="">Selecione uma Atleta</option>{athletes.map(a => (<option key={a.id} value={a.id}>{a.username}</option>))}</select>
                {/* Evento/Competição */}
                <label htmlFor="event">Evento/Competição:</label><select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required><option value="">Selecione um Evento</option>{eventsList.map(e => (<option key={e.id} value={e.id}>{e.title}</option>))}</select>
                {/* Categoria (Idade) */}
                <label htmlFor="ageCategory">Categoria (Idade):</label><select value={selectedAgeCategory} onChange={(e) => setSelectedAgeCategory(e.target.value)} required><option value="">Selecione a Categoria</option>{ageCategories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select>
                {/* Aparelho */}
                <label htmlFor="apparatus">Aparelho:</label><select value={selectedApparatus} onChange={(e) => setSelectedApparatus(e.target.value)} required><option value="">Selecione o Aparelho</option>{apparatusList.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}</select>
                {/* Nota */}
                <label htmlFor="score">Nota (0.00 a 10.00):</label><input type="number" step="0.01" min="0" max="10" value={score} onChange={(e) => setScore(e.target.value)} required />
                <button type="submit">Registrar Nota</button>
              </form>
            </div>

            <hr className="separator" />
            <h2 className="section-title">Histórico de Notas ({gradesReport.length})</h2>
            <ReportTable reportType="grades" data={gradesReport} onDelete={() => { /* Implementar DELETE Notas */ }} />
          </div>
        );
      
      case 'pagamentos':
        return (
            <div className="tab-content">
                <div className="form-card">
                    <h2>Gerenciar Pagamentos</h2>
                    <form onSubmit={handleCreatePayment}>
                        <label htmlFor="athletePayment">Atleta:</label><select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required><option value="">Selecione uma Atleta</option>{athletes.map(a => (<option key={a.id} value={a.id}>{a.username}</option>))}</select>
                        <label htmlFor="paymentDate">Data do Pagamento:</label><input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
                        <label htmlFor="paymentStatus">Status:</label><select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} required><option value="Pago">Pago</option><option value="Pendente">Pendente</option><option value="Atrasado">Atrasado</option></select>
                        <label>Comprovante (Opcional):</label><input type="file" onChange={(e) => setProofFile(e.target.files[0])} />{proofFile && <p className="file-info">Arquivo selecionado: {proofFile.name}</p>}
                        <button type="submit">Registrar Pagamento</button>
                    </form>
                </div>
                
                <hr className="separator" />
                <h2 className="section-title">Status de Pagamentos ({paymentsReport.length})</h2>
                <ReportTable reportType="payments" data={paymentsReport} onDelete={() => { /* Implementar DELETE Pagamentos */ }} />
            </div>
        );

      case 'documentos':
        return (
            <div className="tab-content">
                <FileUpload onUploadSuccess={fetchDocuments} />
                <hr className="separator" />
                <h2 className="section-title">Documentos Enviados (Todos os Atletas)</h2>
                <div className="documents-list">
                    {documents.length > 0 ? (
                        <ul className="document-list-ul">
                            {documents.map(doc => (
                                <li key={doc.id} className="document-item">
                                    <div className="document-info">
                                        <strong>{doc.filename}</strong> ({doc.document_type}) - Atleta ID: {doc.user_id}
                                    </div>
                                    <button onClick={() => handleDeleteDocument(doc.id)} className="delete-button">Excluir Documento</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum documento enviado ainda.</p>
                    )}
                </div>
            </div>
        );
        
      default:
        return <div>Selecione uma opção no menu.</div>;
    }
  };


  return (
    <div className="admin-dashboard">
      <h1>Bem-vindo, Administrador!</h1>
      <p>Gerencie eventos e documentos da AGITA aqui.</p>

      {/* --- MENU DE NAVEGAÇÃO DE ABAS --- */}
      <div className="tab-container">
        <button className={activeTab === 'cadastro' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('cadastro')}>
          Cadastro/Gerenciamento
        </button>
        <button className={activeTab === 'eventos' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('eventos')}>
          Gerenciar Eventos
        </button>
        <button className={activeTab === 'notas' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('notas')}>
          Lançar Notas
        </button>
        <button className={activeTab === 'pagamentos' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('pagamentos')}>
          Gerenciar Pagamentos
        </button>
        <button className={activeTab === 'documentos' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('documentos')}>
          Ver Documentos ({documents.length})
        </button>
      </div>

      {/* RENDERIZA O CONTEÚDO BASEADO NA ABA ATIVA */}
      {renderContent()}

    </div>
  );
}

export default AdminDashboard;  