// controllers/eventController.js

const db = require('../models/db'); // Importa o banco

// Lógica de GET /events
const getAllEvents = (req, res) => {
    const sql = "SELECT * FROM events ORDER BY event_date DESC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de GET /events/list
const getEventList = (req, res) => {
    const sql = "SELECT id, title FROM events ORDER BY event_date DESC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de POST /events/create
const createEvent = (req, res) => {
    const { title, event_date, location, description } = req.body;
    if (!title || !event_date || !location) {
        return res.status(400).json({ message: 'Título, data e local são obrigatórios.' });
    }
    const sql = "INSERT INTO events (title, event_date, location, description) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, event_date, location, description || null], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar evento.' });
        }
        res.status(201).json({ 
            message: 'Evento criado com sucesso!', 
            eventId: result.insertId,
            newEvt: { id: result.insertId, title, event_date, location, description }
        });
    });
};

// Lógica de DELETE /events/:id
const deleteEvent = (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID do evento é obrigatório.' });
    }
    const sql = "DELETE FROM events WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ message: 'Não é possível excluir este evento, pois ele já possui notas lançadas. Remova as notas primeiro.' });
            }
            return res.status(500).json({ message: 'Erro ao excluir evento.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }
        res.status(200).json({ message: 'Evento excluído com sucesso!' });
    });
};

// Exporta todas as funções
module.exports = {
    getAllEvents,
    getEventList,
    createEvent,
    deleteEvent
};