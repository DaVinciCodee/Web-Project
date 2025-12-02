// services/spotifyService.js
const axios = require('axios');

// 1. Récupérer Artistes et Genres (Vibes)
async function getUserTasteProfile(accessToken) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: { 'Authorization': 'Bearer ' + accessToken },
      params: { limit: 20, time_range: 'long_term' }
    });

    let items = response.data.items || [];
    
    // Formatage des artistes
    const topArtists = items.map(artist => ({
      spotifyId: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url || null,
      genres: artist.genres
    }));

    // Extraction des genres uniques (La "Vibe")
    const allGenres = items.flatMap(artist => artist.genres);
    const topGenres = [...new Set(allGenres)].slice(0, 15);

    return { topArtists, topGenres };
  } catch (error) {
    console.error('Erreur TasteProfile:', error.message);
    return { topArtists: [], topGenres: [] };
  }
}

// 2. Récupérer les Top Tracks (Pour la comparaison de chansons)
async function getUserTopTracks(accessToken) {
  try {
    // On utilise le proxy /0 qui fonctionnait bien pour les tracks
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { 'Authorization': 'Bearer ' + accessToken },
      params: { limit: 50, time_range: 'medium_term' }
    });

    if (!response.data.items) return [];

    return response.data.items.map(track => ({
      spotifyId: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Inconnu',
      imageUrl: track.album.images[0]?.url || null
    }));
  } catch (error) {
    console.error('Erreur TopTracks:', error.message);
    return [];
  }
}

// 3. Lecture en cours (Optionnel, on garde si tu l'utilises ailleurs)
async function getNowPlaying(accessToken) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });
    if (response.status === 204 || !response.data || !response.data.item) return null;
    
    const item = response.data.item;
    return {
      isPlaying: response.data.is_playing,
      title: item.name,
      artist: item.artists.map(a => a.name).join(', '),
      albumImage: item.album.images[0]?.url
    };
  } catch (error) {
    return null;
  }
}

module.exports = { getUserTasteProfile, getUserTopTracks, getNowPlaying };