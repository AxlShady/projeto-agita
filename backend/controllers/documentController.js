// controllers/documentController.js

const db = require('../models/db');
const fs = require('fs');
const path = require('path');

// Lógica de GET /documents
const getAllDocuments = (req, res) => {
    const sql = `
        SELECT d.id, u.username, d.document_type, d.filename, d.upload_date 
        FROM documents d
        JOIN users u ON d.user_id = u.id
        ORDER BY d.upload_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de GET /documents/:userId
const getDocumentsByUserId = (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM documents WHERE user_id = ? ORDER BY upload_date DESC";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        res.status(200).json(results);
    });
};

// Lógica de POST /documents/upload
const uploadDocument = (req, res) => {
    const { user_id, document_type, upload_date } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    const filename = req.file.filename;
    if (!user_id || !document_type || !upload_date) {
        fs.unlink(req.file.path, (err) => {
            if(err) console.error("Erro ao limpar arquivo órfão:", err);
        });
        return res.status(400).json({ message: 'Atleta, Tipo de Documento e Data são obrigatórios.' });
    }
    const sql = "INSERT INTO documents (user_id, document_type, filename, upload_date) VALUES (?, ?, ?, ?)";
    db.query(sql, [user_id, document_type, filename, upload_date], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao registrar documento.' });
        }
        res.status(201).json({ message: 'Documento enviado com sucesso!', documentId: result.insertId });
    });
};

// Lógica de POST /documents/upload-proof (incompleta no seu original, mas vamos mapear)
const uploadProof = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo de comprovante enviado.' });
    }
    // No seu código original, esta rota não fazia nada com o banco.
    // Vamos apenas confirmar o upload.
    res.status(201).json({ 
        message: 'Comprovante enviado com sucesso!', 
        filename: req.file.filename 
    });
};


// Lógica de DELETE /documents/:id
const deleteDocument = (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID do documento é obrigatório.' });
    }
    const sqlSelect = "SELECT filename FROM documents WHERE id = ?";
    db.query(sqlSelect, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao procurar documento.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Documento não encontrado no banco.' });
        }
        const filename = results[0].filename;
        const sqlDelete = "DELETE FROM documents WHERE id = ?";
        db.query(sqlDelete, [id], (errDelete, resultDelete) => {
            if (errDelete) {
                return res.status(500).json({ message: 'Erro ao deletar registro do banco.' });
            }
            // __dirname no controller é 'backend/controllers'
            // Precisamos subir um nível para 'backend' e então 'uploads'
            const filePath = path.join(__dirname, '../uploads', filename); 
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.warn(`Não foi possível excluir o arquivo: ${filePath}. Pode já ter sido removido.`, unlinkErr);
                } else {
                    console.log(`Arquivo físico ${filePath} excluído.`);
                }
            });
            res.status(200).json({ message: 'Documento e registro excluídos com sucesso!' });
        });
    });
};

module.exports = {
    getAllDocuments,
    getDocumentsByUserId,
    uploadDocument,
    uploadProof,
    deleteDocument
}; 