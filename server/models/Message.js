const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: { type: String }, // Optionnel : utile pour grouper, sinon on filtre par participants
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);