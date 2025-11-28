const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Route connexion Spotify
router.get('/spotify', (req,res) =>{
    const scope = 'user-read-email user-read-private user-top-read';
    const url = 
        'https://accounts.spotify.com/authorize?response_type=code'
        + `&client_id=${CLIENT_ID}`
        + `&scope=${encodeURIComponent(scope)}`
        + `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        console.log("Redirecting to:", url);
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
        const {access_token, refresh_token} = tokenResponse.data;


        const userProfile = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + access_token }
        });

        console.log(userProfile.data)

        res.json({access_token, refresh_token});
    } catch (error){
        console.error(error);
        res.status(400).send('Error exchanging code for tokens');
    }
});
module.exports = router;