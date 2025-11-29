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
  lastLogin: { type: Date, default: Date.now },
  //Les genres musicaux préférés de l'utilisateur
  topGenres: {type: [String] },
  topArtists:[{
    spotifyId: String,
    name: String,
    imageUrl: String,
    genres: [String]
  }]
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);