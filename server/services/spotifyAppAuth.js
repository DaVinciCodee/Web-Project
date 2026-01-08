const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let appAccessToken = null;
let expiresAt = 0;

async function getAppAccessToken() {
    
  if (appAccessToken && Date.now() < expiresAt) {
    return appAccessToken;
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': 'Basic ' + Buffer
          .from(`${CLIENT_ID}:${CLIENT_SECRET}`)
          .toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  appAccessToken = response.data.access_token;
  expiresAt = Date.now() + response.data.expires_in * 1000;

  return appAccessToken;
}

module.exports = { getAppAccessToken };
