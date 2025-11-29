const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

const authApp = require('./routes/authApp')



// Middlewares globaux utiles
app.use(express.json());         // Parse JSON dans les requêtes
app.use(express.urlencoded({ extended: true }));  // Parse formulaire

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

  
// Route authentification
app.use('/auth-app', authApp);
app.use('/api/auth', require('./routes/auth'));

// Autres routes à monter ici, ex:
// app.use('/api/users', require('./routes/users'));

// Démarrage serveur
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
