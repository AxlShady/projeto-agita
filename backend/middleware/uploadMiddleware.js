const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
//...
// Configuração do Multer (para upload de arquivos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Adiciona um timestamp
    }
}); 

const upload = multer({ storage: storage }); 

module.exports = upload; 
