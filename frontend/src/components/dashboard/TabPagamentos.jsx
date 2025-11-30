import React, { useState, useEffect } from 'react';

// Recebe 'athletes' do AdminDashboard
function TabPagamentos({ athletes }) {
    
    // --- Estados do Formulário ---
    const [selectedAthlete, setSelectedAthlete] = useState('');
    const [referenceMonth, setReferenceMonth] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Pendente');
    const [message, setMessage] = useState('');

    // --- Estado da Lista de Pagamentos ---
    const [payments, setPayments] = useState([]);

    // --- Busca Pagamentos Existentes ---
    const fetchPayments = async () => {
        try {
            // Rota para listar todos os pagamentos (para o histórico do Admin)
            const res = await fetch("http://localhost:3001/payments");
            if (res.ok) {
                const data = await res.json();
                setPayments(data);
            }
        } catch (err) {
            console.error("Erro ao buscar pagamentos:", err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // --- Função de Criar Cobrança (POST) ---
    const handleCreatePayment = async (e) => {
        e.preventDefault();
        setMessage('Criando cobrança...');

        if (!selectedAthlete || !referenceMonth || !amount || !dueDate) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const paymentData = {
            user_id: selectedAthlete,
            reference: referenceMonth, // O Controller aceita 'reference' para mapear para reference_month
            amount: amount,
            due_date: dueDate,
            status: status
        };

        try {
            // Endereço CORRETO para o backend
            const response = await fetch("http://localhost:3001/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Cobrança gerada com sucesso!");
                setAmount('');
                setReferenceMonth('');
                fetchPayments(); // Atualiza a tabela
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(data.message || "Erro ao criar cobrança.");
            }
        } catch (error) {
            console.error("Erro de conexão/API:", error);
            setMessage("Erro 404 na API (Servidor não encontrado ou rota incorreta).");
        }
    };

    // --- Função de Deletar ---
    const handleDeletePayment = async (id) => {
        if (!window.confirm("Deseja excluir este registro de pagamento?")) return;
        try {
            const response = await fetch(`http://localhost:3001/payments/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                alert("Pagamento excluído.");
                fetchPayments();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Função auxiliar para cor do status
    const getStatusClass = (status) => {
        if (!status) return '';
        switch(status.toLowerCase()) {
            case 'pago': return 'status-success';
            case 'pendente': return 'status-warning';
            case 'atrasado': return 'status-danger';
            default: return 'status-neutral';
        }
    };

    return (
        <div className="tab-content">
            
            <div className="forms-container">
                
                {/* --- CARD 1: GERAR COBRANÇA --- */}
                <div className="form-card half-width">
                    <h2>Gerar Cobrança (Pagamento)</h2>
                    <form onSubmit={handleCreatePayment}>
                        <div className="form-group">
                            <label>Atleta</label>
                            <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required>
                                <option value="">Selecione um atleta</option>
                                {athletes.map(atl => (
                                    <option key={atl.id} value={atl.id}>
                                        {atl.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Mês de Referência (Ex: Janeiro/2026)</label>
                            <input type="text" value={referenceMonth} onChange={(e) => setReferenceMonth(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Valor (R$)</label>
                            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Data de Vencimento</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Status Inicial</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pendente">Pendente</option>
                                <option value="Pago">Pago</option>
                                <option value="Atrasado">Atrasado</option>
                            </select>
                        </div>
                        
                        <button type="submit" className="btn-primary">Criar Cobrança</button>
                        {message && <p className="feedback-message">{message}</p>}
                    </form>
                </div>

                {/* --- CARD 2: HISTÓRICO FINANCEIRO --- */}
                <div className="form-card full-width">
                    <h3>Histórico de Pagamentos ({payments.length})</h3>
                    <div className="table-container">
                        {payments.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Atleta</th>
                                        <th>Referência</th>
                                        <th>Valor</th>
                                        <th>Vencimento</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(pay => (
                                        <tr key={pay.id}>
                                            <td>{pay.username || pay.user_id}</td>
                                            <td>{pay.reference_month}</td>
                                            <td>R$ {pay.amount}</td>
                                            <td>{new Date(pay.due_date).toLocaleDateString()}</td>
                                            <td><span className={`status-badge ${getStatusClass(pay.status)}`}>{pay.status}</span></td>
                                            <td>
                                                <button onClick={() => handleDeletePayment(pay.id)} className="button-danger">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Nenhum pagamento registrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabPagamentos;