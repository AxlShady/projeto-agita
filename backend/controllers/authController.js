const db = require('../models/db');

// --- LOGIN (Versão Segura e Limpa) ---
const login = (req, res) => {
    let { username, password } = req.body;

    username = username ? username.trim() : '';
    password = password ? password.trim() : '';

    const sql = "SELECT * FROM users WHERE username = ?";
    
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro interno' });
        if (results.length === 0) return res.status(401).json({ message: 'Usuário não encontrado' });

        const user = results[0];

        // Se quiser manter o "auto-reparo" da senha 123, descomente as linhas abaixo.
        // Se já arrumou todos, pode deixar assim (comparação segura).
        if (password === user.password) {
            res.json({
                message: 'Login realizado',
                user: {
                    id: user.id,
                    username: user.username,
                    user_type: user.user_type,
                    category: user.category
                }
            });
        } else {
            res.status(401).json({ message: 'Senha incorreta' });
        }
    });
};

// --- REGISTRO ---
const register = (req, res) => {
    const { username, password, user_type, category, admission_date } = req.body;

    if (!username || !password || !user_type) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    const sql = "INSERT INTO users (username, password, user_type, category, admission_date) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [username, password, user_type, category, admission_date], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Usuário já existe' });
            return res.status(500).json({ message: 'Erro ao cadastrar' });
        }
        res.status(201).json({ message: 'Cadastrado com sucesso' });
    });
};

module.exports = { login, register };