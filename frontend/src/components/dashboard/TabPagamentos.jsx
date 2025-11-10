// frontend/src/components/dashboard/TabPagamentos.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.js';

// O estado inicial do formulário vive AQUI agora
const initialPaymentForm = {
  user_id: '',
  payment_month: '',
  due_date: new Date().toISOString().split('T')[0],
  status: 'Pendente'
};

// Recebe a lista de atletas como prop do AdminDashboard
function TabPagamentos({ athletes = [] }) { 

  // --- Estados da Aba PAGAMENTOS ---
  const [paymentsReport, setPaymentsReport] = useState([]);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [paymentMessage, setPaymentMessage] = useState('');
  
  // --- Busca os dados necessários para esta aba ---
  useEffect(() => {
    console.log("TabPagamentos montado. Buscando dados...");
    // Não precisa buscar atletas, já recebemos como prop!
    api.fetchPaymentsReport().then(setPaymentsReport);
  }, []); // O [] garante que isso roda só uma vez

  // --- Funções de Ação de PAGAMENTOS ---
  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    setPaymentMessage('Gerando cobrança...');
    
    api.createPayment(paymentForm)
        .then(data => {
            setPaymentMessage(data.message);
            setPaymentForm(initialPaymentForm);
            api.fetchPaymentsReport().then(setPaymentsReport); // Re-busca
        })
        .catch(err => {
            setPaymentMessage(`Erro: ${err.message || 'Falha ao criar pagamento.'}`);
        });
  };

  const handleUpdatePaymentStatus = (paymentId, newStatus) => {
    api.updatePaymentStatus(paymentId, newStatus)
        .then(data => {
            setPaymentsReport(paymentsReport.map(p => p.id === paymentId ? { ...p, status: newStatus } : p ));
        })
        .catch(err => {
            alert(`Erro: ${err.message}`);
            api.fetchPaymentsReport().then(setPaymentsReport); // Reverte (re-busca)
        });
  };

  const handleDeletePayment = (paymentId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta cobrança?')) return;
    
    api.deletePayment(paymentId)
        .then(data => {
            alert(data.message || 'Pagamento excluído.');
            setPaymentsReport(paymentsReport.filter(p => p.id !== paymentId));
        })
        .catch(err => {
            alert(`Erro: ${err.message}`);
        });
  };

  // --- JSX de Renderização ---
  return (
    <div className="tab-content">
      <div className="form-card">
        <h2 className="section-title">Gerar Cobrança (Pagamento)</h2>
        {/* O JSX usa as funções LOCAIS (handleCreatePayment, etc.) */}
        <form onSubmit={handleCreatePayment} className="payment-form">
          <div className="form-row">
            <div className="form-group">
              <label>Atleta</label>
              {/* Usamos a prop 'athletes' vinda do AdminDashboard */}
              <select name="user_id" value={paymentForm.user_id} onChange={handlePaymentFormChange} required>
                <option value="">Selecione um atleta</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Mês de Referência (Ex: Nov/2025)</label>
              <input type="text" name="payment_month" value={paymentForm.payment_month} onChange={handlePaymentFormChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Vencimento</label>
              <input type="date" name="due_date" value={paymentForm.due_date} onChange={handlePaymentFormChange} required />
            </div>
            <div className="form-group">
              <label>Status Inicial</label>
              <select name="status" value={paymentForm.status} onChange={handlePaymentFormChange} required>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>
          </div>
          <button type="submit" className="button-primary">Criar Cobrança</button>
          {paymentMessage && <p className="feedback-message">{paymentMessage}</p>}
        </form>
      </div>
      
      <hr className="separator" />
      
      <h2 className="section-title">Status de Pagamentos ({paymentsReport.length})</h2>
      <div className="list-container payment-list">
        <div className="list-item header">
          <span className="col-username">Atleta</span>
          <span className="col-month">Mês</span>
          <span className="col-date">Vencimento</span>
          <span className="col-status">Status</span>
          <span className="col-actions">Ações</span>
        </div>
        {paymentsReport.length > 0 ? (
          paymentsReport.map(payment => (
            <div key={payment.id} className="list-item">
              <span className="col-username">{payment.username}</span>
              <span className="col-month">{payment.payment_month}</span>
              <span className="col-date">{new Date(payment.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
              <span className="col-status">
                <select value={payment.status} onChange={(e) => handleUpdatePaymentStatus(payment.id, e.target.value)} className={`status-${payment.status.toLowerCase()}`}>
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
        ) : ( <p>Nenhum pagamento registrado.</p> )}
      </div>
    </div>
  );
}

export default TabPagamentos;