// POST /api/messages/getmsg
// On utilise POST pour envoyer les 2 IDs facilement dans le body
app.post('/api/messages/getmsg', async (req, res) => {
  try {
    const { from, to } = req.body;

    // On cherche les messages échangés entre ces deux personnes
    const messages = await Message.find({
      $or: [
        { sender: from, recipient: to },
        { sender: to, recipient: from },
      ],
    }).sort({ timestamp: 1 }); // Du plus vieux au plus récent

    // On formate pour le front
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from, // Est-ce moi qui ai envoyé ?
        message: msg.content,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
});