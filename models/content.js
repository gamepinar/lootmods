const mongoose = require('mongoose');

const ValoracionSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nombre: { type: String, required: true },
    comentario: { type: String, required: true },
    estrellas: { type: Number, required: true, min: 1, max: 5 },
    fecha: { type: Date, default: Date.now }
});

const ContentSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagenUrl: { type: String },
    downloadUrl: { type: String, required: true },
    categoria: {
        type: String,
        enum: ['Mod', 'Game', 'Tool'],
        default: 'Mod'
    },
    version: { type: String, default: '1.0.0' },
    developer: { type: String, default: '' },
    instrucciones: { type: String, default: '' },
    seguridad: { type: String, default: '✅ Virus Free' },
    valoraciones: [ValoracionSchema],
    ratingPromedio: { type: Number, default: 0 },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
