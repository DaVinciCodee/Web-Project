const axios = require('axios');
/**
 * Récupère les artistes préférés de l'utilisateur et en déduit ses genres favoris.
 * @param {string} accessToken - Le token d'accès Spotify
 */
async function getUserTasteProfile(accessToken){
    try {
        const resonse = await axio.get('https://api.spotify.com/v1/me/top/artists',{
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { limit: 20, time_range: 'long_term' }
        });
        const artistsData = resonse.data.items;

        const topArtists = artistsData.map(artist => ({
            spotifyId: artist.id,
            name: artist.name,
            imageUrl: artist.images[1] ? artist.images[1].url : (artist.images[0]?.url || null),
            genres: artist.genres
        }));
        // 3. On extrait tous les genres de tous les artistes pour faire une liste unique
        // flatMap permet d'aplatir le tableau de tableaux de genres
        const allGenres = artistsData.flatMap(artist => artist.genres);

        const topGenres = [...new Set(allGenres)]; // Utilisation de Set pour avoir des genres uniques
        return { topArtists, topGenres };

    } catch(error){
        console.error("Erreur lors de la récupération des artistes préférés:", error.response?.data || error.message);
        return{topArtists: [], topGenres: [] };
    }

}
module.exports = { getUserTasteProfile };