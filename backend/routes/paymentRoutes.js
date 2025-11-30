const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Se paymentController estiver undefined ou vazio, avisa no terminal
if (!paymentController || !paymentController.getPaymentsByAthlete) {
    console.error("ERRO CRÍTICO: paymentController não exportou as funções corretamente!");
}

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/athlete/:userId', paymentController.getPaymentsByAthlete); // <--- O erro estava aqui
router.delete('/:id', paymentController.deletePayment);

module.exports = router;