const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user');
const spotifyService = require('../services/spotifyService');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Route connexion Spotify
router.get('/spotify', (req,res) =>{
        const scope = 'user-read-email user-read-private user-top-read ugc-image-upload user-read-currently-playing';    const url = 
        'https://accounts.spotify.com/authorize?response_type=code'
        + `&client_id=${CLIENT_ID}`
        + '&response_type=code'
        + `&scope=${encodeURIComponent(scope)}`
        + `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        console.log("Redirecting to:", url);
        console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
        res.redirect(url);
});

// Echange du code contre un token
router.get('/spotify/callback', async (req, res) => {
    const code = req.query.code;
    if(!code){
        return res.status(400).send('Authorization code not provided');
    }
    try {
        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
                }
            }
        );
        //Récupération des infos utilisateur
        const {access_token, refresh_token, expires_in} = tokenResponse.data;
        const userProfile = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + access_token }
        });
        const spotifyData = userProfile.data;
        const tasteProfile = await spotifyService.getUserTasteProfile(access_token);
        const expirationDate = new Date(Date.now() + expires_in * 1000);
        const userImage = spotifyData.images && spotifyData.images.length > 0 
            ? spotifyData.images[0].url 
            : null;
        const userName = spotifyData.display_name || '';
        // Sauvegarde ou mise à jour de l'utilisateur dans la base de données
        const user = await User.findOneAndUpdate(
            { spotifyId: spotifyData.id },
            {
                spotifyId: spotifyData.id,
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenExpiration: expirationDate,
                lastLogin: new Date(),
                profilePicture: userImage,
                user_name: userName,
                topArtists: tasteProfile.topArtists,
                topGenres: tasteProfile.topGenres
            },
            {new: true, upsert: true}
        );
        res.redirect(`http://localhost:3000/profile?id=${user.spotifyId}`);
    } catch (error){
        console.error(error);
        res.status(400).send('Error exchanging code for tokens');
    }
});
module.exports = router;