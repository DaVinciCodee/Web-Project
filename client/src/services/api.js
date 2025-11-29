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
/**
 * Met à jour les informations du profil utilisateur (Bio, Nom...)
 * @param {string} spotifyId L'ID Spotify de l'utilisateur
 * @param {object} data Les données à modifier (ex: { bio: "...", user_name: "..." })
 * @return {Promise} Les données mises à jour
 */
export async function updateUserProfile(spotifyId, data){
    try {
        const reponse = await axios.put(`/api/users/${spotifyId}`, data);
        return reponse.data;
    } catch (error) {
        console.error("Erreur API updateUserProfile:", error);
        throw error;
    }
}
export async function fetchNowPlaying(spotifyId){
    try {
        const response = await axios.get(`/api/users/${spotifyId}/now-playing`);
        return response.data;
    } catch (error) {
        console.error("Erreur API fetchNowPlaying:", error);
        return null;
    }
}