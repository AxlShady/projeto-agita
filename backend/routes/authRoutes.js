const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Garante que AMBAS as rotas estão aqui
router.post('/login', authController.login);
router.post('/register', authController.createUser);

module.exports = router;