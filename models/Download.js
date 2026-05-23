const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    contentNombre: { type: String, required: true },
    contentImagen: { type: String },
    downloadUrl: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Download', DownloadSchema);
