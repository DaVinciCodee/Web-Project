// Controllers for explore routes
const exploreService = require("../services/exploreService");

//Find users in database
module.exports.findUsers = async (req, res) => {

    const searchTerm = req.query.q?.trim();

    try {
        const users = await exploreService.findUsersBySearch(searchTerm);
        res.json(users);
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports.findUser = async (req, res) => {
    const userId = req.query.q?.trim();

    if (!userId) {
        return res.status(400).json({ error: "Paramètre 'q' manquant" });
    }

    try {
        const user = await exploreService.findUserByUsername(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json(user);
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Find artists, albums, songs on Spotify
module.exports.findArtists = async (req, res) => {
    const searchTerm = req.query.q?.trim();

    try {
        const artists = await exploreService.spotifySearch("artist", searchTerm);
        res.json(artists);
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports.findAlbums = async (req, res) => {
    const searchTerm = req.query.q?.trim();
    console.log("Album search q =", req.query.q);

    try {
        const albums = await exploreService.spotifySearch("album", searchTerm);
        res.json(albums);
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports.findSongs = async (req, res) => {
    const searchTerm = req.query.q?.trim();

    try {
        const songs = await exploreService.spotifySearch("track", searchTerm);
        res.json(songs);
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};