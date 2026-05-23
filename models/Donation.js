const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    nombre: { type: String, default: 'Anónimo' },
    monto: { type: Number, required: true },
    moneda: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    estado: { type: String, default: 'pendiente', enum: ['pendiente', 'completado', 'rechazado'] }
});

module.exports = mongoose.model('Donation', DonationSchema);
