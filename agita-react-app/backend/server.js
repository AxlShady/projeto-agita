const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

// Configuração do Multer (para upload de arquivos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '_12_07_25!',
    database: 'agita_db'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

app.get('/', (req, res) => {
    res.send('Servidor do back-end da AGITA funcionando!');
});

// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';

    db.query(sql, [username], (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).json({ message: 'Nome de usuário ou senha inválidos.' });
        }

        const user = result[0];
        const hashedPassword = user.password; 

        // TENTA COMPARAÇÃO BCrypt
        bcrypt.compare(password, hashedPassword, (bcryptErr, isMatch) => {
            
            // Aceita a senha em texto puro se for igual (para o admin inicial)
            if (isMatch || hashedPassword === password) { 
                return res.status(200).json({ 
                    message: 'Login bem-sucedido', 
                    user: { id: user.id, username: user.username, user_type: user.user_type } 
                });
            } else {
                return res.status(401).json({ message: 'Nome de usuário ou senha inválidos.' });
            }
        });
    });
});

// Rota para o Administrador registrar um novo atleta (Com BCrypt)
app.post('/users/create', (req, res) => {
    const { username, password } = req.body;
    const user_type = 'atleta';
    const saltRounds = 10; 

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno ao processar a senha.' });
        }
        
        const sql = "INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)";
        
        db.query(sql, [username, hash, user_type], (err, result) => { 
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Nome de usuário já existe.' });
                }
                return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
            }
            res.status(201).json({ 
                message: 'Novo atleta registrado com sucesso!', 
                userId: result.insertId 
            });
        });
    });
});


// --- ROTAS DE BUSCA DE DADOS ---

app.get('/users/athletes', (req, res) => {
    const sql = "SELECT id, username FROM users WHERE user_type = 'atleta'";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/age-categories', (req, res) => {
    const sql = 'SELECT id, name FROM age_categories';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/apparatus', (req, res) => {
    const sql = 'SELECT id, name FROM apparatus';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/events/list', (req, res) => {
    const sql = 'SELECT id, title FROM events';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/events', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json(result);
    });
});

// ROTA 1: Buscar documentos por ID de usuário (Atleta)
app.get('/documents/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT * FROM documents WHERE user_id = ?';
    
    db.query(sql, userId, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json(result);
    });
});

// ROTA 2: Buscar TODOS os documentos (Admin)
app.get('/documents', (req, res) => {
    const sql = 'SELECT * FROM documents';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json(result);
    });
});


// --- ROTAS DE CRIAÇÃO (POST) ---

app.post('/events/create', (req, res) => {
    const { title, eventDate, location, description } = req.body;
    const sql = 'INSERT INTO events (title, event_date, location, description) VALUES (?, ?, ?, ?)';
    const values = [title, eventDate, location, description];
    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send('Erro interno do servidor');
            return;
        }
        res.status(200).json({ message: 'Evento criado com sucesso!' });
    });
});

app.post('/grades/create', (req, res) => {
    const { user_id, event_id, age_category_id, apparatus_id, score, evaluation_date } = req.body;
    const sql = 'INSERT INTO grades (user_id, event_id, age_category_id, apparatus_id, score, evaluation_date) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [user_id, event_id, age_category_id, apparatus_id, score, evaluation_date];
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor ao registrar nota' });
        }
        res.status(200).json({ message: 'Nota registrada com sucesso!' });
    });
});

app.post('/categories/create', (req, res) => {
    const { category_name } = req.body;
    const sql = 'INSERT INTO age_categories (name) VALUES (?)'; 
    db.query(sql, [category_name], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json({ message: 'Categoria criada com sucesso!' });
    });
});

app.post('/payments/create', (req, res) => {
    const { user_id, payment_month, status, due_date, proof_filename } = req.body; 
    const sql = 'INSERT INTO payments (user_id, payment_month, status, due_date, proof_filename) VALUES (?, ?, ?, ?, ?)';
    const values = [user_id, payment_month, status, due_date, proof_filename];
    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Pagamento para este mês já registrado.' });
            }
            return res.status(500).json({ message: 'Erro interno ao registrar pagamento' });
        }
        res.status(200).json({ message: 'Pagamento registrado com sucesso!' });
    });
});

app.post('/documents/upload-proof', upload.single('proof'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo de comprovante enviado.' });
    }
    res.status(200).json({ filename: req.file.filename });
});

app.post('/documents/upload', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }
    const { user_id, document_type } = req.body;
    const filename = req.file.filename;
    const upload_date = new Date().toISOString().slice(0, 10);
    const sql = 'INSERT INTO documents (user_id, document_type, filename, upload_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [user_id, document_type, filename, upload_date], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno ao salvar documento.' });
        }
        res.status(200).json({ message: 'Documento enviado com sucesso!' });
    });
});


// --- ROTAS DE EXCLUSÃO (DELETE) ---

app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }
        res.status(200).json({ message: 'Evento apagado com sucesso!' });
    });
});

app.delete('/documents/:id', (req, res) => {
    const { id } = req.params;
    const sqlSelect = 'SELECT filename FROM documents WHERE id = ?';
    
    db.query(sqlSelect, id, (err, result) => {
        if (err || result.length === 0) {
            const sqlDelete = 'DELETE FROM documents WHERE id = ?';
            db.query(sqlDelete, id, () => {
                 res.status(200).json({ message: 'Documento e registro apagados com sucesso!' });
            });
            return;
        }
        
        const filename = result[0].filename;
        const filePath = path.join(__dirname, 'uploads', filename);
        
        fs.unlink(filePath, () => {
            const sqlDelete = 'DELETE FROM documents WHERE id = ?';
            db.query(sqlDelete, id, () => {
                res.status(200).json({ message: 'Documento e registro apagados com sucesso!' });
            });
        });
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});