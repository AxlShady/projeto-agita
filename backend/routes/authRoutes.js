const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Registro (Cadastro)
// Rota de Login
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;