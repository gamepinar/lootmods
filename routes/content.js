const express = require('express');
const router = express.Router();
const Content = require('../models/content');
const Download = require('../models/Download');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { sanitizeHTML } = require('../utils/sanitize');

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        const select = req.query.select || '-valoraciones';
        const content = await Content.find()
            .sort({ fechaCreacion: -1 })
            .select(select)
            .limit(limit);
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el contenido", detalle: error.message });
    }
});

// Obtener las descargas del usuario logueado
router.get('/mis-descargas', auth, async (req, res) => {
    try {
        const descargas = await Download.find({ userId: req.user.id }).sort({ fecha: -1 });
        res.json(descargas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tus descargas' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Contenido no encontrado." });
        
        const response = item.toObject();
        if (response.valoraciones) {
            response.valoraciones = response.valoraciones.reverse().slice(0, 6);
        }
        
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los detalles." });
    }
});

router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { comentario, estrellas } = req.body;
        if (!comentario || !estrellas) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Contenido no encontrado." });

        const sanitizedComentario = sanitizeHTML(comentario);

        item.valoraciones.push({ 
            usuarioId: req.user.id,
            nombre: req.user.nombre || "Usuario",
            comentario: sanitizedComentario, 
            estrellas 
        });

        const totalEstrellas = item.valoraciones.reduce((acc, v) => acc + v.estrellas, 0);
        item.ratingPromedio = (totalEstrellas / item.valoraciones.length).toFixed(1);

        await item.save();
        res.status(201).json({ mensaje: "¡Gracias por tu comentario!", rating: item.ratingPromedio });
    } catch (error) {
        res.status(500).json({ error: "No se pudo publicar el comentario." });
    }
});

router.delete('/:id/comment/:commentId', auth, async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Contenido no encontrado." });

        const comentario = item.valoraciones.id(req.params.commentId);
        if (!comentario) return res.status(404).json({ error: "Comentario no encontrado." });

        if (req.user.rol !== 'admin' && comentario.usuarioId.toString() !== req.user.id) {
            return res.status(403).json({ error: "No tienes permiso para borrar este comentario." });
        }

        item.valoraciones.pull(req.params.commentId);

        const totalEstrellas = item.valoraciones.reduce((acc, v) => acc + v.estrellas, 0);
        item.ratingPromedio = item.valoraciones.length > 0
            ? (totalEstrellas / item.valoraciones.length).toFixed(1)
            : 0;

        await item.save();
        res.json({ mensaje: "Comentario eliminado." });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el comentario." });
    }
});

router.post('/', auth, admin, async (req, res) => {
    try {
        if (req.body.nombre) req.body.nombre = sanitizeHTML(req.body.nombre);
        if (req.body.descripcion) req.body.descripcion = sanitizeHTML(req.body.descripcion);
        if (req.body.instrucciones) req.body.instrucciones = sanitizeHTML(req.body.instrucciones);
        if (req.body.developer) req.body.developer = sanitizeHTML(req.body.developer);
        if (req.body.seguridad) req.body.seguridad = sanitizeHTML(req.body.seguridad);

        const nuevoContenido = new Content(req.body);
        await nuevoContenido.save();
        res.status(201).json({ mensaje: "¡Contenido subido con éxito!", item: nuevoContenido });
    } catch (error) {
        res.status(400).json({ error: "Error al subir el contenido", detalle: error.message });
    }
});

router.put('/:id', auth, admin, async (req, res) => {
    try {
        if (req.body.nombre) req.body.nombre = sanitizeHTML(req.body.nombre);
        if (req.body.descripcion) req.body.descripcion = sanitizeHTML(req.body.descripcion);
        if (req.body.instrucciones) req.body.instrucciones = sanitizeHTML(req.body.instrucciones);
        if (req.body.developer) req.body.developer = sanitizeHTML(req.body.developer);
        if (req.body.seguridad) req.body.seguridad = sanitizeHTML(req.body.seguridad);

        const contenidoActualizado = await Content.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.json({ mensaje: "Actualizado exitosamente!", item: contenidoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar." });
    }
});

// Registrar una descarga de un mod/juego
router.post('/:id/download', auth, async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Contenido no encontrado." });

        const { downloadUrl } = req.body;
        if (!downloadUrl) {
            return res.status(400).json({ error: "Falta la URL de descarga." });
        }

        // Crear registro de descarga
        const nuevaDescarga = new Download({
            userId: req.user.id,
            contentId: item._id,
            contentNombre: item.nombre,
            contentImagen: item.imagenUrl,
            downloadUrl
        });

        await nuevaDescarga.save();
        res.status(201).json({ mensaje: "Descarga registrada con éxito", descarga: nuevaDescarga });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la descarga." });
    }
});

module.exports = router;
