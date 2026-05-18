require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');
const app = express();

// 1. Conexión a Base de Datos (Mover arriba)
mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

const origenesPermitidos = [
    'https://gamepin.top',
    'https://www.gamepin.top',
    'http://localhost:5173',
    'http://localhost:3000'
];



app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origenesPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Prevención de inyecciones NoSQL optimizada
app.use(mongoSanitize());

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/donations', require('./routes/donations'));

// Servir Frontend en Producción (Cloud Run)
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});