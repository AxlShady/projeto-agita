import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import FileUpload from './FileUpload';
import AthleteRegistrationForm from './AthleteRegistrationForm.jsx'; // Importação do novo formulário

function AdminDashboard(props) {
  // --- Estados para Formulários de Criação ---
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  
  // --- Estados para Dados Mestre e Listas ---
  const [events, setEvents] = useState([]); 
  const [documents, setDocuments] = useState([]);
  const [athletes, setAthletes] = useState([]); // Lista de atletas para Dropdowns
  const [ageCategories, setAgeCategories] = useState([]);
  const [apparatusList, setApparatusList] = useState([]);
  const [eventsList, setEventsList] = useState([]); // Lista de eventos simplificada para Dropdown
  
  // --- Estados para Lançamento de Notas / Pagamentos ---
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [selectedAgeCategory, setSelectedAgeCategory] = useState('');
  const [selectedApparatus, setSelectedApparatus] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [score, setScore] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10)); 
  const [paymentStatus, setPaymentStatus] = useState('Pago'); 
  const [proofFile, setProofFile] = useState(null); 


  // --- FUNÇÕES DE BUSCA ---
  
  const fetchEvents = async () => { 
    try {
      const response = await fetch('http://localhost:3001/events');
      if (response.status === 200) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const fetchDocuments = async () => { 
    try {
      const response = await fetch('http://localhost:3001/documents');
      if (response.status === 200) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  const fetchAthletes = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/athletes');
      if (response.status === 200) {
        const data = await response.json();
        setAthletes(data);
        // Garante que o dropdown selecione um atleta válido (o primeiro, se houver)
        if (data.length > 0 && !selectedAthlete) {
            setSelectedAthlete(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
    }
  };

  const fetchAgeCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/age-categories');
      if (response.status === 200) {
        const data = await response.json();
        setAgeCategories(data);
        if (data.length > 0) setSelectedAgeCategory(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchApparatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/apparatus');
      if (response.status === 200) {
        const data = await response.json();
        setApparatusList(data);
        if (data.length > 0) setSelectedApparatus(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar aparelhos:', error);
    }
  };

  const fetchEventsList = async () => {
    try {
      const response = await fetch('http://localhost:3001/events/list');
      if (response.status === 200) {
        const data = await response.json();
        setEventsList(data);
        if (data.length > 0) setSelectedEvent(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar lista de eventos:', error);
    }
  };
  // --- Fim Funções de Busca ---


  // Carrega todos os dados ao iniciar o componente
  useEffect(() => {
    fetchEvents();
    fetchDocuments();
    fetchAthletes();
    fetchAgeCategories();
    fetchApparatus();
    fetchEventsList();
  }, []);

  // --- FUNÇÕES DE AÇÃO ---

  // Manter suas funções de ação (handleCreateEvent, handleDeleteEvent, etc.) aqui.
  // Como são longas, o código final apenas as invoca, mas você deve mantê-las.
  
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const newEvent = { title, eventDate, location, description, };
    try {
      const response = await fetch('http://localhost:3001/events/create', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(newEvent), });
      if (response.status === 200) {
        alert('Evento criado com sucesso!');
        setTitle(''); setEventDate(''); setLocation(''); setDescription('');
        fetchEvents();
      } else {
        alert('Erro ao criar evento.');
      }
    } catch (error) { console.error('Erro ao conectar com o servidor:', error); alert('Erro ao conectar com o servidor.'); }
  };
  
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/categories/create', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ category_name: categoryName }), });
      if (response.status === 200) {
        alert('Categoria criada com sucesso!');
        setCategoryName('');
        fetchAgeCategories();
      } else {
        alert('Erro ao criar categoria.');
      }
    } catch (error) { console.error('Erro ao conectar com o servidor:', error); alert('Erro ao conectar com o servidor.'); }
  };

  const handleDeleteEvent = async (id) => { 
    if (window.confirm('Tem certeza que deseja apagar este evento?')) {
      try {
        const response = await fetch(`http://localhost:3001/events/${id}`, { method: 'DELETE', });
        if (response.status === 200) {
          alert('Evento apagado com sucesso!');
          fetchEvents(); 
        } else {
          alert('Erro ao apagar evento.');
        }
      } catch (error) { console.error('Erro ao conectar com o servidor:', error); alert('Erro ao conectar com o servidor.'); }
    }
  };

  const handleDeleteDocument = async (id) => { 
    if (window.confirm('Tem certeza que deseja apagar este documento e o arquivo físico?')) {
      try {
        const response = await fetch(`http://localhost:3001/documents/${id}`, { method: 'DELETE', });
        if (response.status === 200) {
          alert('Documento apagado com sucesso!');
          fetchDocuments(); 
        } else {
          alert('Erro ao apagar documento.');
        }
      } catch (error) { console.error('Erro ao conectar com o servidor:', error); alert('Erro ao conectar com o servidor.'); }
    }
  };

  const handleCreateGrade = async (e) => { 
    e.preventDefault();
    // ... Lógica de criação de nota (manter código existente) ...
    if (!selectedAthlete || !selectedEvent || !selectedAgeCategory || !selectedApparatus || !score) { alert('Por favor, preencha todos os campos da nota.'); return; }
    const gradeData = { user_id: parseInt(selectedAthlete), event_id: parseInt(selectedEvent), age_category_id: parseInt(selectedAgeCategory), apparatus_id: parseInt(selectedApparatus), score: parseFloat(score), evaluation_date: new Date().toISOString().slice(0, 10) };
    try {
        const response = await fetch('http://localhost:3001/grades/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gradeData), });
        if (response.status === 200) { alert('Nota registrada com sucesso!'); setScore(''); } else { const errorData = await response.json(); alert(errorData.message || 'Erro ao registrar nota.'); }
    } catch (error) { console.error('Erro ao conectar com o servidor:', error); alert('Erro ao conectar com o servidor.'); }
  };

  // FUNÇÃO FINAL DE PAGAMENTO
  const handleCreatePayment = async (e) => {
    e.preventDefault();
    
    if (!selectedAthlete) { alert('Por favor, selecione uma atleta.'); return; }

    let savedProofFilename = null;
    if (proofFile) {
        const formData = new FormData();
        formData.append('proof', proofFile);
        try {
            const proofResponse = await fetch('http://localhost:3001/payments/upload-proof', { method: 'POST', body: formData, });
            const proofData = await proofResponse.json();
            if (proofResponse.status === 200) { savedProofFilename = proofData.filename; } else { alert(`Erro ao fazer upload do comprovante: ${proofData.message}`); return; }
        } catch (error) { console.error('Erro de conexão no upload:', error); alert('Erro ao conectar com o servidor no upload de comprovante.'); return; }
    }

    const paymentData = {
        user_id: selectedAthlete,
        payment_month: new Date(paymentDate).toLocaleString('pt-BR', { month: 'long', year: 'numeric' }), 
        status: paymentStatus,
        due_date: paymentDate, 
        proof_filename: savedProofFilename 
    };

    try {
        const response = await fetch('http://localhost:3001/payments/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paymentData), });
        const errorData = await response.json();

        if (response.status === 200) {
            alert('Pagamento registrado com sucesso!');
            setProofFile(null); setPaymentDate(new Date().toISOString().slice(0, 10)); setPaymentStatus('Pago'); 
        } else {
            alert(errorData.message || 'Erro ao registrar pagamento.');
        }
    } catch (error) { console.error('Erro ao conectar com o servidor:', error); alert('Erro ao conectar com o servidor.'); }
  };


  return (
    <div className="admin-dashboard">
      <h1>Bem-vindo, Administrador!</h1>
      <p>Gerencie eventos e documentos da AGITA aqui.</p>

      {/* --- NOVO: Componente de Registro de Atleta --- */}
      <AthleteRegistrationForm onRegistrationSuccess={fetchAthletes} /> 
      
      {/* --- FORMULÁRIO DE NOTAS --- */}
      <hr style={{ margin: '40px 0' }} />
      <h2 style={{ color: '#ff6600' }}>Lançamento de Notas</h2>
      <form onSubmit={handleCreateGrade} style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        
        {/* Atleta */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="athlete">Atleta:</label>
          <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione uma Atleta</option>
            {athletes.map(a => (
              <option key={a.id} value={a.id}>{a.username}</option>
            ))}
          </select>
        </div>
        
        {/* Evento/Competição */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="event">Evento/Competição:</label>
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione um Evento</option>
            {eventsList.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        {/* Categoria (Idade) */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="ageCategory">Categoria (Idade):</label>
          <select value={selectedAgeCategory} onChange={(e) => setSelectedAgeCategory(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione a Categoria</option>
            {ageCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Aparelho */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="apparatus">Aparelho:</label>
          <select value={selectedApparatus} onChange={(e) => setSelectedApparatus(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione o Aparelho</option>
            {apparatusList.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        
        {/* Nota */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="score">Nota (0.00 a 10.00):</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            max="10" 
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#002244', color: 'white', border: 'none', borderRadius: '4px' }}>Registrar Nota</button>
      </form>
      
      {/* --- CADASTRAR CATEGORIA DE NOTA --- */}
      <hr style={{ margin: '40px 0' }} />
      <h2>Cadastrar Categoria de Nota</h2>
      <form onSubmit={handleCreateCategory} style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div>
          <label htmlFor="categoryName">Nome da Categoria (Ex: Corda, Fita):</label>
          <input 
            type="text" 
            id="categoryName" 
            value={categoryName} 
            onChange={(e) => setCategoryName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#002244', color: 'white', border: 'none', borderRadius: '4px' }}>Criar Categoria</button>
      </form>

      {/* --- FORMULÁRIO DE EVENTOS --- */}
      <hr style={{ margin: '40px 0' }} />
      <h2>Criar Novo Evento</h2>
      <form onSubmit={handleCreateEvent} style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div>
          <label htmlFor="title">Título do Evento:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div>
          <label htmlFor="eventDate">Data:</label>
          <input type="date" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div>
          <label htmlFor="location">Local:</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div>
          <label htmlFor="description">Descrição:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px' }}/>
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#002244', color: 'white', border: 'none', borderRadius: '4px' }}>Criar Evento</button>
      </form>
      
      {/* --- GERENCIAR PAGAMENTOS (NOVO) --- */}
      <hr style={{ margin: '40px 0' }} />
      <h2>Gerenciar Pagamentos</h2>
      <form onSubmit={handleCreatePayment} style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        
        {/* Atleta: Reusa o estado 'selectedAthlete' e a lista 'athletes' */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="athletePayment">Atleta:</label>
          <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione uma Atleta</option>
            {athletes.map(a => (
              <option key={a.id} value={a.id}>{a.username}</option>
            ))}
          </select>
        </div>
        
        {/* Data do Pagamento */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="paymentDate">Data do Pagamento:</label>
          <input 
            type="date" 
            value={paymentDate} 
            onChange={(e) => setPaymentDate(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Upload de Comprovante (OPCIONAL) */}
        <div style={{ marginBottom: '20px' }}>
          <label>Comprovante (Opcional):</label>
          <input 
            type="file" 
            onChange={(e) => setProofFile(e.target.files[0])} 
          />
          {proofFile && <p style={{ fontSize: '0.9em', color: 'green' }}>Arquivo selecionado: {proofFile.name}</p>}
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '4px' }}>Registrar Pagamento</button>
      </form>


      {/* --- LISTA DE EVENTOS --- */}
      <hr style={{ margin: '40px 0' }} />
      <h2>Lista de Eventos</h2>
      <div className="events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-item">
              <h3>{event.title}</h3>
              <p>
                <strong>Data:</strong> {event.event_date}
              </p>
              <p>
                <strong>Local:</strong> {event.location}
              </p>
              <p>
                <strong>Descrição:</strong> {event.description}
              </p>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="delete-button"
              >
                Excluir Evento
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum evento criado ainda.</p>
        )}
      </div>

      <hr style={{ margin: '40px 0' }} />

      <FileUpload onUploadSuccess={fetchDocuments} />

      <hr style={{ margin: '40px 0' }} />

      <h2>Documentos Enviados</h2>
      <div className="documents-list">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <h3>{doc.filename}</h3>
              <p>
                <strong>Tipo:</strong> {doc.document_type}
              </p>
              <p>
                <strong>Data:</strong> {doc.upload_date}
              </p>
              <button
                onClick={() => handleDeleteDocument(doc.id)}
                className="delete-button"
              >
                Excluir Documento
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum documento enviado ainda.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard; 

teste 