require('dotenv').config({ path: 'd:/Desktop/juegos y mods/.env' });
const mongoose = require('mongoose');
const Content = require('d:/Desktop/juegos y mods/models/Content');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Content.updateMany({}, { downloadUrl: 'https://go.clarodrive.com/RxAdSlTu' });
    console.log('Update complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
