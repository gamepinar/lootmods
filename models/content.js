const mongoose = require('mongoose');

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
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
