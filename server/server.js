require('dotenv').config();

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require("cors");

// ********* Models ********
const Message = require('./models/Message');

// ********* Routes ********
const authApp = require('./routes/authApp');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search-request');
const messageRoutes = require('./routes/messages');
const createPost = require('./routes/create-post');
const sendPost = require('./routes/send-post');


// ********* Middlewares globaux utiles *********
app.use(express.json());         // Parse JSON dans les requêtes
app.use(express.urlencoded({ extended: true }));  // Parse formulaire
app.use(cors({
  origin: 'http://localhost:3000', // On autorise seulement le frontend React
  credentials: true // Autorise les cookies/sessions si besoin
}));

// ********* Connexion à la base MongoDB *********
const mongoURI = process.env.MONGODB_URI;
console.log("Connecting to MongoDB");
mongoose.connect(mongoURI)
  .then(
    () => { console.log('Connected to MongoDB'); }
  )
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });


// ********* Socket.IO *********
const onlineUsers = new Map();
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {

  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`Utilisateur ${userId} connecté avec le socket ${socket.id}`);
  });

  socket.on('send-msg', async ({ to, from, msg }) => {
    try {
      const newMessage = new Message({
        sender: from,
        recipient: to,
        content: msg
      });
      await newMessage.save();

      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('private message', newMessage);
      }
    } catch (err) {
      console.error("Erreur sauvegarde message:", err);
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUser = null;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUser = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log(`User ${disconnectedUser || 'inconnu'} déconnecté`);
  });
});


// ********* Routes Express *********
app.use('/auth-app', authApp);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/search-request', searchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/create-post', createPost);
app.use('/send-post', sendPost);

// ********* Démarrage serveur *********
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});