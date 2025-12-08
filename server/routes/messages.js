<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); 

// POST /api/messages/getmsg
router.post('/getmsg', async (req, res, next) => { 
  try {
    const { from, to } = req.body;

 
=======
// POST /api/messages/getmsg
// On utilise POST pour envoyer les 2 IDs facilement dans le body
app.post('/api/messages/getmsg', async (req, res) => {
  try {
    const { from, to } = req.body;

    // On cherche les messages échangés entre ces deux personnes
>>>>>>> b1bd565a49636cedb5f9c42c80eda03c649680a6
    const messages = await Message.find({
      $or: [
        { sender: from, recipient: to },
        { sender: to, recipient: from },
      ],
<<<<<<< HEAD
    }).sort({ timestamp: 1 }); 

    
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from, 
=======
    }).sort({ timestamp: 1 }); // Du plus vieux au plus récent

    // On formate pour le front
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from, // Est-ce moi qui ai envoyé ?
>>>>>>> b1bd565a49636cedb5f9c42c80eda03c649680a6
        message: msg.content,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
<<<<<<< HEAD
});

module.exports = router; 
=======
});
>>>>>>> b1bd565a49636cedb5f9c42c80eda03c649680a6
