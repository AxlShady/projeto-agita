// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/list', eventController.getEventList); // <-- Esta é a rota que faltava
router.post('/create', eventController.createEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;