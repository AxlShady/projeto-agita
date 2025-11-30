import React, { useState, useEffect } from 'react';
import './AthleteDetails.css'; // Você precisará criar este CSS
import ReportTable from '../components/ReportTable.jsx'; // Usaremos para a tabela de notas

// Este componente é exibido pelo AdminDashboard quando um atleta é selecionado
function AthleteDetails({ userId, onBack }) {
  
  // Estados para os dados específicos deste atleta
  const [athleteInfo, setAthleteInfo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [payments, setPayments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para buscar TODOS os dados do atleta de uma vez
  useEffect(() => {
    const fetchAthleteData = async () => {
      setLoading(true);
      setError('');
      try {
        // Usamos Promise.all para carregar tudo em paralelo
        const [
          detailsRes,
          docsRes,
          gradesRes,
          paymentsRes
        ] = await Promise.all([
          fetch(`https://projeto-agita.onrender.com/users/${userId}/details`),
          fetch(`https://projeto-agita.onrender.com/documents/${userId}`),
          fetch(`https://projeto-agita.onrender.com/grades-report/${userId}`),
          fetch(`https://projeto-agita.onrender.com/payments-report/${userId}`)
        ]);

        // Verificamos se todas as requisições foram OK
        if (!detailsRes.ok || !docsRes.ok || !gradesRes.ok || !paymentsRes.ok) {
          throw new Error('Falha ao carregar um ou mais recursos do atleta.');
        }

        // Processamos os dados
        setAthleteInfo(await detailsRes.json());
        setDocuments(await docsRes.json());
        setGrades(await gradesRes.json());
        setPayments(await paymentsRes.json());

      } catch (err) {
        console.error('Erro ao buscar detalhes do atleta:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAthleteData();
  }, [userId]); // Re-carrega se o userId mudar

  // --- Funções de Ação (copiadas do AdminDashboard, mas agindo no estado local) ---

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Tem certeza que deseja excluir este documento? O arquivo será apagado permanentemente.')) return;
    try {
      const response = await fetch(`https://projeto-agita.onrender.com/documents/${docId}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setDocuments(documents.filter(d => d.id !== docId)); // Atualiza estado local
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (err) { alert('Erro de conexão ao excluir documento.'); }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta nota?')) return;
    try {
      const response = await fetch(`https://projeto-agita.onrender.com/grades/${gradeId}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setGrades(grades.filter(g => g.id !== gradeId)); // Atualiza estado local
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (err) { alert('Erro de conexão ao tentar excluir nota.'); }
  };

  const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`https://projeto-agita.onrender.com/payments/${paymentId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      const data = await response.json();
      if (response.ok) {
        setPayments(payments.map(p => p.id === paymentId ? { ...p, status: newStatus } : p )); // Atualiza estado local
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (err) { alert('Erro de conexão ao atualizar status.'); }
  };
  
  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta cobrança?')) return;
    try {
      const response = await fetch(`https://projeto-agita.onrender.com/payments/${paymentId}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setPayments(payments.filter(p => p.id !== paymentId)); // Atualiza estado local
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (err) { alert('Erro de conexão ao excluir pagamento.'); }
  };


  // --- Renderização ---

  if (loading) {
    return <div className="loading">Carregando detalhes do atleta...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="athlete-details-container tab-content">
      {/* Botão de Voltar */}
      <button onClick={onBack} className="back-button">&larr; Voltar para a lista de atletas</button>
      
      <h2 className="section-title">
        Detalhes do Atleta: {athleteInfo ? athleteInfo.username : `(ID: ${userId})`}
      </h2>

      {/* Seção de Documentos */}
      <div className="details-section form-card">
        <h3>Documentos Enviados ({documents.length})</h3>
        <div className="list-container document-list">
          <div className="list-item header">
            <span className="col-type">Tipo</span>
            <span className="col-date">Data</span>
            <span className="col-link">Arquivo</span>
            <span className="col-actions">Ações</span>
          </div>
          {documents.length > 0 ? (
            documents.map(doc => (
              <div key={doc.id} className="list-item">
                <span className="col-type">{doc.document_type}</span>
                <span className="col-date">{new Date(doc.upload_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                <span className="col-link">
                  <a href={`https://projeto-agita.onrender.com/uploads/${doc.filename}`} target="_blank" rel="noopener noreferrer">
                    Ver Arquivo
                  </a>
                </span>
                <span className="col-actions">
                  <button onClick={() => handleDeleteDocument(doc.id)} className="button-danger small">Excluir</button>
                </span>
              </div>
            ))
          ) : (
            <p>Nenhum documento encontrado para este atleta.</p>
          )}
        </div>
      </div>

      {/* Seção de Histórico de Notas */}
      <div className="details-section form-card">
        <h3>Histórico de Notas ({grades.length})</h3>
        <ReportTable 
          reportType="grades" 
          data={grades} 
          onDelete={handleDeleteGrade} 
        />
      </div>

      {/* Seção de Histórico de Pagamentos */}
      <div className="details-section form-card">
        <h3>Histórico de Pagamentos ({payments.length})</h3>
        <div className="list-container payment-list">
          <div className="list-item header">
            <span className="col-month">Mês</span>
            <span className="col-date">Vencimento</span>
            <span className="col-status">Status</span>
            <span className="col-actions">Ações</span>
          </div>
          {payments.length > 0 ? (
            payments.map(payment => (
              <div key={payment.id} className="list-item">
                <span className="col-month">{payment.payment_month}</span>
                <span className="col-date">{new Date(payment.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                <span className="col-status">
                  <select 
                    value={payment.status} 
                    onChange={(e) => handleUpdatePaymentStatus(payment.id, e.target.value)}
                    className={`status-${payment.status.toLowerCase()}`}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Atrasado">Atrasado</option>
                  </select>
                </span>
                <span className="col-actions">
                  <button onClick={() => handleDeletePayment(payment.id)} className="button-danger small">Excluir</button>
                </span>
              </div>
            ))
          ) : (
            <p>Nenhum pagamento encontrado para este atleta.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AthleteDetails;