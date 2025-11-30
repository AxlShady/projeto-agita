// frontend/src/models/db.js

const mysql = require('mysql2');

// Configuração do Banco de Dados
const db = mysql.createConnection({
    host: 'centerbeam.proxy.rlwy.net',
    port: 41067,
    user: 'root',
    password: 'czfNILjRdUSXzIYtyZdBLMTAkpThRQMO', // Sua senha
    database: 'railway'
});

// Conecta ao Banco de Dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados MySQL com o ID ' + db.threadId);
});

// ESTA É A LINHA MAIS IMPORTANTE!
// Ela exporta a variável 'db' (a conexão) para que outros arquivos
// (como o userController) possam usá-la.
module.exports = db;