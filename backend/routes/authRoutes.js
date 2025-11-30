const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Registro (Cadastro)
// Verifica se a função 'register' existe antes de usar
router.post('/register', authController.register);

// Rota de Login
router.post('/login', authController.login);

module.exports = router;