require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();

const origenesPermitidos = [
    'https://gamepin.top',
    'https://www.gamepin.top',
    'http://localhost:5173',
    'http://localhost:3000'
];

const mongoSanitize = require('express-mongo-sanitize');

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

// Sanitización de datos contra inyecciones NoSQL
app.use(mongoSanitize());

// Middleware para prevenir scripts básicos (XSS) en los inputs
app.use((req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
            }
        }
    }
    next();
});

app.use('/api/', apiLimiter);

mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión:', err));

const { apiLimiter, authLimiter } = require('./middleware/rateLimit');

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/content', require('./routes/content'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});