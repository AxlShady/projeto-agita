// controllers/gradeController.js

const db = require('../models/db'); // Importa o banco

// Lógica de GET /grades-report
const getGradesReport = (req, res) => {
    const sql = `
    SELECT g.id, 
           u.username as atleta_nome, 
           e.title as evento_nome, 
           ac.name as categoria_idade, 
           ap.name as aparelho_nome, 
           g.score, 
           g.evaluation_date 
    FROM grades g
    JOIN users u ON g.user_id = u.id
    JOIN events e ON g.event_id = e.id
    JOIN age_categories ac ON g.age_category_id = ac.id
    JOIN apparatus ap ON g.apparatus_id = ap.id
    ORDER BY g.evaluation_date DESC, u.username ASC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de GET /grades-report/:userId
const getGradesByUserId = (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT g.id, u.username, e.title as event_name, ac.name as category_name, 
               ap.name as apparatus_name, g.score, g.evaluation_date 
        FROM grades g
        JOIN users u ON g.user_id = u.id
        JOIN events e ON g.event_id = e.id
        JOIN age_categories ac ON g.age_category_id = ac.id
        JOIN apparatus ap ON g.apparatus_id = ap.id
        WHERE g.user_id = ?
        ORDER BY g.evaluation_date DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de POST /grades/create
const createGrade = (req, res) => {
    const { user_id, age_category_id, apparatus_id, event_id, score, evaluation_date } = req.body;
    if (!user_id || !age_category_id || !apparatus_id || !event_id || !score || !evaluation_date) {
        return res.status(400).json({ message: 'Todos os campos do formulário são obrigatórios.' });
    }
    const sql = "INSERT INTO grades (user_id, age_category_id, apparatus_id, event_id, score, evaluation_date) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [user_id, age_category_id, apparatus_id, event_id, score, evaluation_date];
    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(404).json({ message: 'ID de atleta, evento, categoria ou aparelho não encontrado.' });
            }
            return res.status(500).json({ message: 'Erro ao salvar a nota no banco.' });
        }
        res.status(201).json({ message: 'Nota lançada com sucesso!', gradeId: result.insertId });
    });
};

// Lógica de DELETE /grades/:id
const deleteGrade = (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID da nota é obrigatório.' });
    }
    const sql = "DELETE FROM grades WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao excluir nota.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nota não encontrada.' });
        }
        res.status(200).json({ message: 'Nota excluída com sucesso!' });
    });
};

// Exporta todas as funções
module.exports = {
    getGradesReport,
    getGradesByUserId,
    createGrade,
    deleteGrade
};