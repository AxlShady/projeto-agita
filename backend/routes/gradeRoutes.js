// backend/routes/gradeRoutes.js
const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// MUDANÇA IMPORTANTE:
// Antes: router.get('/report', ...)
// Agora: router.get('/', ...)
//
// O server.js já usa o prefixo /grades-report, 
// então a rota / vai corresponder a GET /grades-report
router.get('/', gradeController.getGradesReport); // <-- ROTA CORRIGIDA

router.get('/:userId', gradeController.getGradesByUserId); // Esta deve funcionar (era /report/:userId)
router.post('/create', gradeController.createGrade);
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;