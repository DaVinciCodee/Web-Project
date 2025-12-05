require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const Message = require('./models/Message');

const onLineUsers = new Map();

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  
  // 1. QUAND UN USER SE CONNECTE, IL DOIT S'IDENTIFIER
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`Utilisateur ${userId} associé au socket ${socket.id}`);
  });

  // 2. GESTION DU MESSAGE PRIVÉ
  socket.on('private message', async ({ content, to, from }) => {
    try {
      const newMessage = new Message({
        sender: from,
        recipient: to,
        content: content
      });
      await newMessage.save();

      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('private message', newMessage);
      }

      socket.emit('private message', newMessage);

    } catch (err) {
      console.error("Erreur sauvegarde message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User déconnecté');
  });
});


const mongoose = require('mongoose');
const authApp = require('./routes/authApp')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cors = require('cors');

<<<<<<< HEAD
// Middlewares globaux utiles
app.use(express.json());         // Parse JSON dans les requêtes
app.use(express.urlencoded({ extended: true }));  // Parse formulaire
app.use(cors({
  origin: 'http://localhost:3000', // On autorise seulement le frontend React
  credentials: true // Autorise les cookies/sessions si besoin
}));
// Connexion à la base MongoDB
=======
app.use(express.json());        
app.use(express.urlencoded({ extended: true }));  

>>>>>>> 3f72413 (Debut messagerie)
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
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
