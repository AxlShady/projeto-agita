const db = require('../models/db');

// --- 1. LANÇAR NOTA (CREATE) ---
const createGrade = (req, res) => {
    // Recebemos do front como 'category' e 'apparatus' e 'date_graded'
    const { user_id, event_id, category, apparatus, score, date_graded } = req.body;

    if (!user_id || !event_id || !score) {
        return res.status(400).json({ message: 'Preencha atleta, evento e nota.' });
    }

    // --- AQUI ESTÁ A CORREÇÃO BASEADA NO SEU PRINT ---
    // Usamos os nomes exatos: age_category_id, apparatus_id, evaluation_date
    const sql = `
        INSERT INTO grades (user_id, event_id, age_category_id, apparatus_id, score, evaluation_date) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Nota Importante: Se 'category' for texto (ex: "Mirim") e o banco esperar número (ID),
    // isso pode dar erro de tipo. Mas vamos tentar com os nomes certos primeiro.
    db.query(sql, [user_id, event_id, category, apparatus, score, date_graded], (err, result) => {
        if (err) {
            console.error("Erro SQL ao lançar nota:", err);
            // Retorna o erro exato do banco para sabermos se é problema de ID vs Texto
            return res.status(500).json({ message: 'Erro no banco: ' + err.sqlMessage });
        }
        res.status(201).json({ message: 'Nota lançada com sucesso!' });
    });
};

// --- 2. LISTAR TODAS AS NOTAS (Com JOIN para pegar nomes) ---
const getAllGrades = (req, res) => {
    // Ajustado para ler 'evaluation_date'
    const sql = `
        SELECT 
            g.id, 
            g.score, 
            g.apparatus_id as apparatus, 
            g.age_category_id as category, 
            g.evaluation_date as date_graded,
            u.username, 
            e.title as event_name 
        FROM grades g
        LEFT JOIN users u ON g.user_id = u.id
        LEFT JOIN events e ON g.event_id = e.id
        ORDER BY g.evaluation_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar notas:", err);
            return res.status(500).json({ message: 'Erro ao buscar notas' });
        }
        res.status(200).json(results);
    });
};

// --- 3. DELETAR NOTA ---
const deleteGrade = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM grades WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao deletar.' });
        res.json({ message: 'Nota deletada.' });
    });
};

// --- 4. LISTAR POR ATLETA (Para o Painel do Atleta) ---
const getGradesByAthlete = (req, res) => {
    const { userId } = req.params;
    
    // Ajustado para ler 'evaluation_date'
    const sql = `
        SELECT g.*, e.title as event_name 
        FROM grades g
        LEFT JOIN events e ON g.event_id = e.id 
        WHERE g.user_id = ?
        ORDER BY g.evaluation_date DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro interno' });
        res.status(200).json(results);
    });
};

module.exports = {
    createGrade,
    getAllGrades,
    deleteGrade,
    getGradesByAthlete
};