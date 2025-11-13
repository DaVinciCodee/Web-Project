require('dotenv').config();

const express = require('express');
const app = express();


// Middlewares globaux utiles
app.use(express.json());         // Parse JSON dans les requêtes
app.use(express.urlencoded({ extended: true }));  // Parse formulaire

// Monte les routes d’authentification
app.use('/api/auth', require('./routes/auth'));

// Autres routes à monter ici, ex:
// app.use('/api/users', require('./routes/users'));

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
