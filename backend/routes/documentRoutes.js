// routes/documentRoutes.js

const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const upload = require('../middleware/uploadMiddleware'); // <-- Importamos o multer!

// Rotas GET
router.get('/', documentController.getAllDocuments);
router.get('/:userId', documentController.getDocumentsByUserId);

// Rotas POST (usando o middleware de upload)
router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.post('/upload-proof', upload.single('proof'), documentController.uploadProof);

// Rota DELETE
router.delete('/:id', documentController.deleteDocument);

module.exports = router; 