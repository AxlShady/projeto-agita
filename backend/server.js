// 1. Imports de Módulos
const express = require('express');
const cors = require('cors');
const path = require('path');

// 2. Imports de Rotas (Corrigido, sem 'src/')
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');

// 3. Inicialização e Configuração
const app = express();
const port = process.env.PORT || 3001;

// 4. Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Uso das Rotas
app.use('/api', authRoutes);
app.use('/events', eventRoutes);
app.use('/grades', gradeRoutes); 
app.use('/grades-report', gradeRoutes);
app.use('/payments', paymentRoutes);
app.use('/payments-report', paymentRoutes);
app.use('/documents', documentRoutes);
app.use('/users', userRoutes);
app.use('/', dataRoutes);

// 6. Inicialização do Servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});