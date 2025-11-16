const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connecté !'))
.catch(err => console.error('Erreur connexion MongoDB :', err));

// Middlewares globaux (parser le body avant les routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monter les routes Auth sous /api/auth
app.use('/api/auth', authRoutes);

// Autres routes ici
// app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
