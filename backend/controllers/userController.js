const db = require('../models/db');

// Lista apenas quem é atleta
const getAthletes = (req, res) => {
    const sql = "SELECT id, username, category, admission_date FROM users WHERE user_type = 'atleta' ORDER BY username ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar atletas.' });
        res.status(200).json(results);
    });
};

// Detalhes de um usuário
const getUserDetails = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT id, username, user_type, category, admission_date FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro interno.' });
        if (results.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
        res.status(200).json(results[0]);
    });
};

// --- ATUALIZAÇÃO SEGURA (COM CORREÇÃO DE DATA VAZIA) ---
const updateUser = (req, res) => {
    const { id } = req.params;
    let { category, admission_date } = req.body;

    // TRUQUE: Se a data vier vazia (""), transforma em NULL para o banco não dar erro
    if (!admission_date || admission_date === '') {
        admission_date = null;
    }

    const sql = "UPDATE users SET category = ?, admission_date = ? WHERE id = ?";
    
    db.query(sql, [category, admission_date, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar:", err);
            return res.status(500).json({ message: 'Erro ao atualizar dados.' });
        }
        res.status(200).json({ message: 'Dados atualizados com sucesso!' });
    });
};

module.exports = {
    getAthletes,
    getUserDetails,
    updateUser
};