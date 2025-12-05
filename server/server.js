require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authApp = require('./routes/authApp')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cors = require('cors');

app.use(express.json());         
app.use(express.urlencoded({ extended: true }));  
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));
const mongoURI = process.env.MONGODB_URI;
console.log("Connecting to MongoDB");
mongoose.connect(mongoURI)
  .then(
    () => { console.log('Connected to MongoDB'); }
  )
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

  
app.use('/auth-app', authApp);
app.use('/api/auth', require('./routes/auth'));

app.use('/auth-app', require('./routes/authApp'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
