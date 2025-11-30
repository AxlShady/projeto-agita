const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Verifica se o controller carregou certo (ajuda a achar erros)
if (!gradeController) {
    console.error("ERRO CRÍTICO: gradeController não foi importado corretamente.");
}

// --- Rota para CRIAR nota (POST) ---
// Certifique-se que gradeController.createGrade existe
router.post('/', gradeController.createGrade);

// --- Rota para LISTAR TODAS as notas (GET) ---
router.get('/', gradeController.getAllGrades);

// --- Rota para LISTAR notas de um ATLETA ESPECÍFICO (GET) ---
// Esta foi a função nova que adicionamos. Se o controller antigo estiver salvo, isso dá erro.
router.get('/athlete/:userId', gradeController.getGradesByAthlete);

// --- Rota para DELETAR nota (DELETE) ---
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;