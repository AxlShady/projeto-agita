// controllers/userController.js
const db = require('../models/db');

// Lógica de GET /users/athletes
const getAthleteUsers = (req, res) => {
    const sql = "SELECT id, username FROM users WHERE user_type = 'atleta' ORDER BY username ASC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de GET /users/:id/details
const getUserDetails = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT id, username, user_type FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(results[0]);
    });
};

// Exporta as funções
module.exports = {
    getAthleteUsers,
    getUserDetails
};