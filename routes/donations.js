const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

const authMiddleware = require('../middleware/authMiddleware');

// Guardar una nueva donación
router.post('/', async (req, res) => {
    try {
        const { nombre, monto, moneda, metodo } = req.body;
        
        // Guardamos la intención de donación (por defecto es 'pendiente')
        const nuevaDonacion = new Donation({ nombre, monto, moneda });
        await nuevaDonacion.save();

        // Devolvemos éxito normal para que el frontend muestre el QR
        res.status(201).json(nuevaDonacion);
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la donación' });
    }
});

// [ADMIN] Obtener donaciones pendientes
router.get('/admin/pendientes', authMiddleware, async (req, res) => {
    try {
        const pendientes = await Donation.find({ estado: 'pendiente' }).sort({ fecha: -1 });
        res.json(pendientes);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener donaciones pendientes' });
    }
});

// [ADMIN] Marcar donación como completada
router.put('/:id/completar', authMiddleware, async (req, res) => {
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
