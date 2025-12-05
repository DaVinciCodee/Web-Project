const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // L'ID unique donné par Spotify (ex: 'thibault_123')
  spotifyId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  tokenExpiration: { type: Date, required: true },
  lastLogin: { type: Date, default: Date.now },
  user_name: {type: String, default: ''},
  bio: {type: String, default: ''},
  profilePicture: {type: String},
  followers: { type: [String], default: [] }, 
  following: { type: [String], default: [] },
  topGenres: {type: [String] },
  topArtists:[{
    spotifyId: String,
    name: String,
    imageUrl: String,
    genres: [String],
  }],
  topTracks:[{
    spotifyId: String,
    name: String,
    artist: String,
    imageUrl: String
  }]
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);