import axios from 'axios';

/**
 * Recuper le profile complet de l'utilisateur
 * @param {string} spotifyId L'ID Spotify de l'utilisateur
 * @return {Promise} Les données de l'utilisateur
 */
export async function fetchUserProfile(spotifyId){
    try {
        const response = await axios.get(`/api/users/${spotifyId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur API fetchUserProfile:", error);
        throw error;
    }
}