const db = require('../models/db');

// --- 1. CRIAR PAGAMENTO (Admin) ---
const createPayment = (req, res) => {
    // Recebemos vários nomes possíveis para garantir que pegamos o dado
    const { user_id, reference, reference_month, description, amount, due_date, status } = req.body;

    // LÓGICA ESPERTA: Se veio 'reference', usa ele. Se veio 'reference_month', usa ele.
    const finalReference = reference || reference_month || description || "Mensalidade";

    if (!user_id || !amount || !due_date) {
        return res.status(400).json({ message: 'Preencha os dados obrigatórios.' });
    }

    const sql = "INSERT INTO payments (user_id, reference_month, amount, due_date, status) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [user_id, finalReference, amount, due_date, status || 'Pendente'], (err, result) => {
        if (err) {
            console.error("Erro ao criar pagamento:", err);
            return res.status(500).json({ message: 'Erro no banco de dados.' });
        }
        res.status(201).json({ message: 'Pagamento registrado com sucesso!' });
    });
};

// --- 2. LISTAR TODOS (Admin) ---
const getAllPayments = (req, res) => {
    const sql = `
        SELECT p.*, u.username 
        FROM payments p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.due_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro interno.' });
        res.status(200).json(results);
    });
};

// --- 3. LISTAR POR ATLETA (Painel do Atleta) ---
const getPaymentsByAthlete = (req, res) => {
    const { userId } = req.params;
    
    const sql = "SELECT * FROM payments WHERE user_id = ? ORDER BY due_date DESC";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar pagamentos do atleta:", err);
            return res.status(500).json({ message: 'Erro interno.' });
        }
        res.status(200).json(results);
    });
};

// --- 4. DELETAR ---
const deletePayment = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM payments WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao deletar.' });
        res.json({ message: 'Pagamento removido.' });
    });
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentsByAthlete,
    deletePayment
};