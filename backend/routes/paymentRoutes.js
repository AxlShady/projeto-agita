// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Mapeia as rotas

// Para GET /payments-report
router.get('/report', paymentController.getPaymentsReport);

// Para GET /payments-report/:userId
router.get('/report/:userId', paymentController.getPaymentsByUserId);

// Para POST /payments/create
router.post('/create', paymentController.createPayment);

// Para PUT /payments/:id/status
router.put('/:id/status', paymentController.updatePaymentStatus);

// Para DELETE /payments/:id
router.delete('/:id', paymentController.deletePayment);

module.exports = router;