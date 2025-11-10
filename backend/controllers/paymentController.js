// controllers/paymentController.js

const db = require('../models/db'); // Importa o banco

// Lógica de GET /payments-report
const getPaymentsReport = (req, res) => {
    const sql = `
        SELECT p.id, u.username, p.payment_month, p.status, p.due_date, p.proof_filename 
        FROM payments p
        JOIN users u ON p.user_id = u.id
        WHERE u.user_type = 'atleta'
        ORDER BY p.due_date DESC, u.username ASC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de GET /payments-report/:userId
const getPaymentsByUserId = (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT p.id, u.username, p.payment_month, p.status, p.due_date, p.proof_filename 
        FROM payments p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.due_date DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de POST /payments/create
const createPayment = (req, res) => {
    const { user_id, payment_month, status, due_date } = req.body;
    if (!user_id || !payment_month || !status || !due_date) {
        return res.status(400).json({ message: 'Atleta, Mês, Status e Data de Vencimento são obrigatórios.' });
    }
    const sql = "INSERT INTO payments (user_id, payment_month, status, due_date) VALUES (?, ?, ?, ?)";
    const values = [user_id, payment_month, status, due_date];
    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY' || err.message.includes('unique_payment')) {
                return res.status(409).json({ message: 'Este atleta já possui uma cobrança para este mês.' });
            }
            return res.status(500).json({ message: 'Erro ao criar pagamento.' });
        }
        res.status(201).json({ message: 'Pagamento criado com sucesso!', paymentId: result.insertId });
    });
};

// Lógica de PUT /payments/:id/status
const updatePaymentStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['Pendente', 'Pago', 'Atrasado'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido. Use Pendente, Pago ou Atrasado.' });
    }
    const sql = "UPDATE payments SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar status.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pagamento não encontrado.' });
        }
        res.status(200).json({ message: `Status do pagamento atualizado para ${status}!` });
    });
};

// Lógica de DELETE /payments/:id
const deletePayment = (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID do pagamento é obrigatório.' });
    }
    const sql = "DELETE FROM payments WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao excluir pagamento.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pagamento não encontrado.' });
        }
        res.status(200).json({ message: 'Pagamento excluído com sucesso!' });
    });
};

// Exporta todas as funções
module.exports = {
    getPaymentsReport,
    getPaymentsByUserId,
    createPayment,
    updatePaymentStatus,
    deletePayment
};