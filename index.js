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

const vercelPattern = /^https:\/\/lootmods(?:-[a-z0-9-]+)?\.vercel\.app$/;
const runPattern = /^https:\/\/lootmods-.*\.run\.app$/;

app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        if (
            !origin || 
            origenesPermitidos.includes(origin) || 
            vercelPattern.test(origin) || 
            runPattern.test(origin)
        ) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Prevención de inyecciones NoSQL optimizada (compatible con Express 5)
app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    if (req.query) mongoSanitize.sanitize(req.query, { replaceWith: '_' });
    next();
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/donations', require('./routes/donations'));

// Servir Frontend en Producción (Cloud Run)
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});