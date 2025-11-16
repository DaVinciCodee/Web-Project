const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

router.get('/spotify', (req, res) => {
  const scope = 'user-read-email user-read-private user-top-read';
  const url = 'https://accounts.spotify.com/authorize?response_type=code'
    + `&client_id=${process.env.SPOTIFY_CLIENT_ID}`
    + `&scope=${encodeURIComponent(scope)}`
    + `&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;

  console.log("Redirecting to:", url);
  res.redirect(url);
});

router.get('/spotify/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    // Échange code contre tokens
    console.log("clientId", process.env.SPOTIFY_CLIENT_ID);
    console.log("clientSecret", process.env.SPOTIFY_CLIENT_SECRET);
    console.log("redirectUri", process.env.SPOTIFY_REDIRECT_URI);

    const data = await spotifyApi.authorizationCodeGrant(code);

    // Configurer tokens dans spotifyApi pour faire d'autres appels si besoin
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);

    // Récupérer infos utilisateur Spotify
    const userProfile = await spotifyApi.getMe();
    const spotifyId = userProfile.body.id;

    // Chercher ou créer utilisateur en base
    let user = await User.findOne({ spotifyId });
    if (!user) user = new User({ spotifyId });

    // Mettre à jour tokens et expiration
    user.accessToken = data.body.access_token;
    user.refreshToken = data.body.refresh_token;
    user.tokenExpiration = new Date(Date.now() + data.body.expires_in * 1000);

    await user.save();

    res.json({ message: 'Authentifié, token sauvegardé', user });
  } catch (error) {
    console.error('Spotify Error:', error);
    res.status(400).send('Error exchanging code for tokens');
  }
});



module.exports = router;
