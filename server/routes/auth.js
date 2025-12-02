// routes/auth.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const spotifyService = require('../services/spotifyService');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

router.get('/spotify', (req, res) => {
  // On garde user-top-read car c'est le seul important pour Tracks/Artists
  const scope = 'user-read-email user-read-private user-top-read ugc-image-upload user-read-currently-playing';
  
  const url = 'https://accounts.spotify.com/authorize?response_type=code' +
    `&client_id=${CLIENT_ID}` +
    '&response_type=code' +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    '&show_dialog=true'; // Tu peux le laisser ou l'enlever maintenant

  res.redirect(url);
});

router.get('/spotify/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  try {
    // 1. Token Exchange
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'authorization_code', code: code, redirect_uri: REDIRECT_URI
    }), {
      headers: { 
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // 2. User Profile
    const profileRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + access_token }
    });
    const spotifyData = profileRes.data;

    // 3. Récupération des données CLEAN (Tracks, Artists, Genres)
    const tasteData = await spotifyService.getUserTasteProfile(access_token);
    const tracksData = await spotifyService.getUserTopTracks(access_token);

    // 4. Sauvegarde BDD
    const user = await User.findOneAndUpdate(
      { spotifyId: spotifyData.id },
      {
        spotifyId: spotifyData.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiration: new Date(Date.now() + expires_in * 1000),
        lastLogin: new Date(),
        user_name: spotifyData.display_name,
        profilePicture: spotifyData.images?.[0]?.url,
        
        // C'est ici que ça change : que du concret
        topArtists: tasteData.topArtists,
        topGenres: tasteData.topGenres, // La "Vibe" textuelle
        topTracks: tracksData           // Les sons en commun
        // Plus d'audioFeatures ici !
      },
      { new: true, upsert: true }
    );

    res.redirect(`http://localhost:3000/profile?id=${user.spotifyId}`);
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(400).send('Login failed');
  }
});

module.exports = router;