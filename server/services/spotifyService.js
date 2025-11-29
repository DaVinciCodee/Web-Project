const axios = require('axios');

async function getUserTasteProfile(accessToken) {
  try {
    // 1. Appel à Spotify
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: { 'Authorization': 'Bearer ' + accessToken },
      params: { limit: 20, time_range: 'long_term' }
    });

    let artistsData = response.data.items;

    // --- LE TRUCAGE (MOCK) COMMENCE ICI ---
    // Si l'utilisateur n'a pas de données (compte vide), on injecte des faux artistes
    if (!artistsData || artistsData.length === 0) {
      console.log("⚠️ Compte Spotify vide détecté : Injection des données de test (Daft Punk & Queen).");
      artistsData = [
        {
          id: "4tZwfgrHOc3mvqYlEYSvVi",
          name: "Daft Punk",
          images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb2cdce2307c87c06c528f8460" }, { url: "https://i.scdn.co/image/ab6761610000e5eb2cdce2307c87c06c528f8460" }],
          genres: ["Filter House", "Electro"]
        },
        {
          id: "1dfeR4HaWDbWqFHLkxsg1d",
          name: "Queen",
          images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb6452296d66e5f3972627e7d4" }, { url: "https://i.scdn.co/image/ab6761610000e5eb6452296d66e5f3972627e7d4" }],
          genres: ["Rock", "Glam Rock"]
        }
      ];
    }
    // --- FIN DU TRUCAGE ---

    // 2. Formatage des données
    const topArtists = artistsData.map(artist => ({
      spotifyId: artist.id,
      name: artist.name,
      imageUrl: artist.images[1] ? artist.images[1].url : (artist.images[0]?.url || null),
      genres: artist.genres
    }));

    const allGenres = artistsData.flatMap(artist => artist.genres);
    const topGenres = [...new Set(allGenres)].slice(0, 15);

    return { topArtists, topGenres };

  } catch (error) {
    console.error('Erreur Spotify Service:', error.response?.data || error.message);
    return { topArtists: [], topGenres: [] };
  }
}
async function getNowPlaying(access_token) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': 'Bearer ' + access_token }
    });
    if (response.status === 204 || !response.data){
      return null;
    }
    const item = response.data.item;

    return {
      isPlaying: response.data.is_playing,
      artist: item.artists.map(artist => artist.name).join(', '),
      title: item.name,
      albumImage: item.album.images[0].url,
      previewUrl: item.preview_url,
      externalUrl: item.external_urls.spotify
    };
  } catch (error) {
    console.error('Erreur getNowPlaying:', error.response?.data || error.message);
    return null;
  }
};


module.exports = { getUserTasteProfile, getNowPlaying };