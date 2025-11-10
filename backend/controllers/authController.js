const db = require('../models/db');
const bcrypt = require('bcrypt');

// --- FUNÇÃO LOGIN ---
const login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const user = results[0];

        // --- DETETIVES DE DEBUG (Adicionados por mim) ---
        // Isso vai mostrar no terminal do backend exatamente o que está sendo comparado.
        console.log('--- 🕵️ DEBUG LOGIN ---');
        console.log('Senha vinda do Frontend:', password, `(Tamanho: ${password.length})`);
        console.log('Hash vindo do Banco:', user.password, `(Tamanho: ${user.password.length})`);
        // --- FIM DOS DETETIVES ---

        bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
            if (bcryptErr) {
                return res.status(500).json({ message: 'Erro ao verificar a senha.' });
            }
            if (isMatch) {
                const userData = {
                    id: user.id,
                    username: user.username,
                    user_type: user.user_type
                };
                res.status(200).json({ message: 'Login bem-sucedido!', user: userData });
            } else {
                res.status(401).json({ message: 'Senha incorreta.' });
            }
        });
    });
};

// --- FUNÇÃO CRIAR USUÁRIO ---
const createUser = (req, res) => {
    const { username, password, user_type } = req.body;
    if (!username || !password || !user_type) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
        if (hashErr) {
            return res.status(500).json({ message: 'Erro ao processar a senha.' });
        }
        const sql = "INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)";
        db.query(sql, [username, hashedPassword, user_type], (dbErr, result) => {
            if (dbErr) {
                if (dbErr.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Este nome de usuário já existe.' });
                }
                return res.status(500).json({ message: 'Erro ao registrar usuário.' });
            }
            res.status(201).json({ message: 'Usuário criado com sucesso!', userId: result.insertId });
        });
    });
};
// --- FIM DA FUNÇÃO ---

// Garanta que AMBAS estão sendo exportadas
module.exports = {
    login,
    createUser
};
// (A linha com erro "});" foi removida daqui)