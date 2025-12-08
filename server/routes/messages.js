const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); 

// POST /api/messages/getmsg
router.post('/getmsg', async (req, res, next) => { 
  try {
    const { from, to } = req.body;

 
    const messages = await Message.find({
      $or: [
        { sender: from, recipient: to },
        { sender: to, recipient: from },
      ],
    }).sort({ timestamp: 1 }); 

    
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from, 
        message: msg.content,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router; 