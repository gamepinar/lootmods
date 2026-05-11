const express = require('express');
const router = express.Router();
const Content = require('../models/content');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Listar todo el contenido
router.get('/', async (req, res) => {
    try {
        const content = await Content.find().sort({ fechaCreacion: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el contenido", detalle: error.message });
    }
});

// Obtener contenido por ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Contenido no encontrado." });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el contenido." });
    }
});

// Crear nuevo contenido (Admin)
router.post('/', auth, admin, async (req, res) => {
    try {
        const nuevoContenido = new Content(req.body);
        await nuevoContenido.save();
        res.status(201).json({ mensaje: "¡Contenido subido con éxito!", item: nuevoContenido });
    } catch (error) {
        res.status(400).json({ error: "Error al subir el contenido, revisa los campos", detalle: error.message });
    }
});

// Editar contenido (Admin)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const contenidoActualizado = await Content.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!contenidoActualizado) {
            return res.status(404).json({ error: "Contenido no encontrado." });
        }
        res.json({ mensaje: "¡Contenido actualizado exitosamente!", item: contenidoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Hubo un error al intentar actualizar." });
    }
});

// Eliminar contenido (Admin)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const contenidoEliminado = await Content.findByIdAndDelete(req.params.id);
        if (!contenidoEliminado) {
            return res.status(404).json({ error: "Este contenido ya no existe." });
        }
        res.json({ mensaje: "¡Contenido eliminado de forma permanente!" });
    } catch (error) {
        res.status(500).json({ error: "Hubo un error al intentar eliminar." });
    }
});

module.exports = router;
