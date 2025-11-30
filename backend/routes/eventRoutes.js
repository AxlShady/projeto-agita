const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Rota para criar eventos (Admin)
router.post('/', eventController.createEvent);

// Rota para listar TODOS (Admin)
router.get('/', eventController.getAllEvents);

// --- NOVA ROTA: Listar eventos de um atleta específico ---
// Exemplo de uso: GET /events/athlete/5 (onde 5 é o ID do atleta)
router.get('/athlete/:userId', eventController.getEventsByAthlete);

router.post('/subscribe', eventController.subscribeAthlete);

module.exports = router;