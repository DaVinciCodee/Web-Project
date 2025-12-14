require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authApp = require('./routes/authApp')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search-request');
const cors = require("cors");


// Middlewares globaux utiles
app.use(express.json());         // Parse JSON dans les requêtes
app.use(express.urlencoded({ extended: true }));  // Parse formulaire
app.use(cors({
  origin: 'http://localhost:3000', // On autorise seulement le frontend React
  credentials: true // Autorise les cookies/sessions si besoin
}));
// Connexion à la base MongoDB
const mongoURI = process.env.MONGODB_URI;
console.log("Connecting to MongoDB");
mongoose.connect(mongoURI)
  .then(
    () => { console.log('Connected to MongoDB'); }
  )
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

  
app.use(cors());
  
// Route authentification
app.use('/auth-app', authApp);

// Autres routes à monter ici, ex:
app.use('/auth-app', require('./routes/authApp'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/users', require('./routes/users'));

app.use('/search-request', searchRoutes);

// Démarrage serveur
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
