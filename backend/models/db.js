const mysql = require('mysql2');


const connectionConfig = process.env.DATABASE_URL || {
    host: 'centerbeam.proxy.rlwy.net',
    port: 41067,
    user: 'root',
    password: 'czfNILjRdUSXzIYtyZdBLMTAkpThRQMO', 
    database: 'railway'
};

const db = mysql.createConnection(connectionConfig);

db.connect(err => {
    if (err) {
        console.error('Erro Crítico: Não foi possível conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Sucesso: Conectado ao banco de dados MySQL!');
});

module.exports = db; 