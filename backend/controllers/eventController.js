const db = require('../models/db');

// --- 1. CRIAR EVENTO ---
const createEvent = (req, res) => {
    // ACEITA OS DOIS: Se o front mandar 'name' ou 'title', nós pegamos
    const { name, title, date, location, description } = req.body;
    
    // Define qual usar (se veio title usa title, senão usa name)
    const finalTitle = title || name;

    // Validação
    if (!finalTitle || !date || !location) {
        return res.status(400).json({ message: 'Preencha nome/título, data e local.' });
    }

    // SQL corrigido para usar a coluna 'title' do banco
    const sql = "INSERT INTO events (title, event_date, location, description) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [finalTitle, date, location, description], (err, result) => {
        if (err) {
            console.error("Erro SQL:", err);
            return res.status(500).json({ message: 'Erro interno ao criar evento.' });
        }
        res.status(201).json({ 
            message: 'Evento criado com sucesso', 
            newEvt: { 
                id: result.insertId, 
                title: finalTitle, 
                event_date: date, 
                location, 
                description 
            } 
        });
    });
};

// --- 2. LISTAR TODOS ---
const getAllEvents = (req, res) => {
    const sql = "SELECT * FROM events ORDER BY event_date ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar eventos' });
        res.status(200).json(results);
    });
};

// --- 3. LISTAR POR ATLETA ---
const getEventsByAthlete = (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT events.* FROM events 
        INNER JOIN event_participants ON events.id = event_participants.event_id 
        WHERE event_participants.user_id = ?
        ORDER BY events.event_date ASC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro interno.' });
        res.status(200).json(results);
    });
};

// --- 4. INSCREVER ATLETA ---
const subscribeAthlete = (req, res) => {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) return res.status(400).json({ message: 'Selecione dados.' });

    const checkSql = "SELECT * FROM event_participants WHERE user_id = ? AND event_id = ?";
    db.query(checkSql, [userId, eventId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao verificar.' });
        if (results.length > 0) return res.status(409).json({ message: 'Já inscrito.' });

        const insertSql = "INSERT INTO event_participants (user_id, event_id) VALUES (?, ?)";
        db.query(insertSql, [userId, eventId], (errInsert) => {
            if (errInsert) return res.status(500).json({ message: 'Erro ao inscrever.' });
            res.status(201).json({ message: 'Sucesso!' });
        });
    });
};

module.exports = { createEvent, getAllEvents, getEventsByAthlete, subscribeAthlete };