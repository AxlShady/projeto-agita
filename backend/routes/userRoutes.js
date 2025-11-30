const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Listar atletas (dropdowns e tabelas)
router.get('/athletes', userController.getAthletes);

// Detalhes de um atleta específico
router.get('/:id/details', userController.getUserDetails);

// --- NOVA ROTA: Editar atleta ---
router.put('/:id', userController.updateUser);

module.exports = router;