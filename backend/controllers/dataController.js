// controllers/dataController.js
const db = require('../models/db');

// Lógica de GET /age-categories
const getAgeCategories = (req, res) => {
    const sql = "SELECT * FROM age_categories ORDER BY name ASC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de GET /apparatus
const getApparatus = (req, res) => {
    const sql = "SELECT * FROM apparatus ORDER BY name ASC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de POST /categories/create
const createCategory = (req, res) => {
    // Seu server.js original tinha /* ... (Lógica de INSERT em age_categories) ... */
    // Vamos assumir que você queira criar uma categoria de idade
    const { name } = req.body;
    if (!name) {
         return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
    }

    const sql = "INSERT INTO age_categories (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) {
             if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Essa categoria já existe.' });
             }
             return res.status(500).json({ message: 'Erro ao criar categoria.' });
        }
        res.status(201).json({ message: 'Categoria criada com sucesso!', categoryId: result.insertId });
    });
};

// Exporta as funções
module.exports = {
    getAgeCategories,
    getApparatus,
    createCategory
};