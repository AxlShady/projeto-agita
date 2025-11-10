// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para GET /users/athletes
router.get('/athletes', userController.getAthleteUsers);

// Rota para GET /users/:id/details
router.get('/:id/details', userController.getUserDetails);

module.exports = router;