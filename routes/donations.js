const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { sanitizeHTML } = require('../utils/sanitize');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Obtener donaciones del usuario logueado
router.get('/mis-donaciones', authMiddleware, async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user.id, estado: 'completado' }).sort({ fecha: -1 });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tus donaciones' });
    }
});

// Guardar una nueva donación
router.post('/', async (req, res) => {
    try {
        const { nombre, monto, moneda, metodo } = req.body;
        
        const sanitizedNombre = sanitizeHTML(nombre || 'Anónimo');
        
        let userId = null;
        const token = req.header('x-auth-token');
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                // Ignorar token inválido
            }
        }
        
        // Guardamos la intención de donación (por defecto es 'pendiente')
        const nuevaDonacion = new Donation({ userId, nombre: sanitizedNombre, monto, moneda });
        await nuevaDonacion.save();

        // Devolvemos éxito normal para que el frontend muestre el QR
        res.status(201).json(nuevaDonacion);
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la donación' });
    }
});

// [ADMIN] Obtener donaciones pendientes
router.get('/admin/pendientes', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pendientes = await Donation.find({ estado: 'pendiente' }).sort({ fecha: -1 });
        res.json(pendientes);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener donaciones pendientes' });
    }
});

// [ADMIN] Marcar donación como completada
router.put('/:id/completar', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.id, 
            { estado: 'completado' }, 
            { new: true }
        );
        res.json(donation);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar donación' });
    }
});

// [ADMIN] Rechazar donación
router.put('/:id/rechazar', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.id, 
            { estado: 'rechazado' }, 
            { new: true }
        );
        res.json(donation);
    } catch (err) {
        res.status(500).json({ error: 'Error al rechazar donación' });
    }
});

// Obtener las últimas 10 donaciones COMPLETADAS
router.get('/latest', async (req, res) => {
    try {
        const donations = await Donation.find({ estado: 'completado' }).sort({ fecha: -1 }).limit(10);
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener donaciones' });
    }
});

module.exports = router;
