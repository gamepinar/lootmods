require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Asegúrate de que el modelo esté en ./models/user

async function createAdmin() {
  try {
    console.log('Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Conectado a MongoDB Atlas');

    const email = 'gamepinar@yahoo.com';
    const password = 'VK14ZclVnoROhBnA';
    const nombre = 'Loot Admin';

    // Verificar si ya existe
    let admin = await User.findOne({ email });
    if (admin) {
      console.log('El usuario administrador ya existe. Actualizando contraseña...');
    } else {
      admin = new User({ email, nombre, rol: 'admin' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);
    admin.rol = 'admin'; // Asegurar el rol
    
    await admin.save();
    console.log('✅ Perfil de Admin guardado exitosamente.');
    
  } catch (err) {
    console.error('❌ Error al crear admin:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
