// backend/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Rota para GET /age-categories
router.get('/age-categories', dataController.getAgeCategories);

// Rota para GET /apparatus
router.get('/apparatus', dataController.getApparatus);

// Rota para POST /categories/create
router.post('/categories/create', dataController.createCategory);

module.exports = router;