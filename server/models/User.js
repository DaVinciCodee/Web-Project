const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // L'ID unique donné par Spotify (ex: 'thibault_123')
  spotifyId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Les tokens précieux
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  
  // Date précise d'expiration (pour savoir quand utiliser le refresh token)
  tokenExpiration: { type: Date, required: true },
  
  // Pour savoir quand il s'est connecté la dernière fois
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);