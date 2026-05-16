require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
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

const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach(key => {
        if (/^\$/.test(key) || key.includes('.')) {
            delete obj[key];
        } else if (obj[key] && typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
        } else if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
        }
    });
};

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

app.use((req, res, next) => {
    sanitizeObject(req.body);
    sanitizeObject(req.params);
    next();
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/donations', require('./routes/donations'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});