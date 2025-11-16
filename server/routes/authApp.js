const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Fonction pour authentifier l'app
async function authenticateApp() {
    const tokenUrl = "https://accounts.spotify.com/api/token";

    const encodedCredentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const response = await axios.post(
        tokenUrl,
        "grant_type=client_credentials",
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + encodedCredentials
            }
        }
    );

    return response.data; // { access_token, expires_in }
}

// Route qui renvoie le token de l'app
router.get('/token-app', async (req, res) => {
    console.log("CLIENT_ID =", CLIENT_ID);
    console.log("CLIENT_SECRET =", CLIENT_SECRET ? "OK" : "MISSING");
    console.log(Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"));
    try {
        const token = await authenticateApp();
        res.json(token);
    } catch (err) {
        console.error("Erreur:", err.response?.data || err);
        res.status(500).json({ error: "Impossible d'authentifier l'application" });
    }
});

module.exports = router;
