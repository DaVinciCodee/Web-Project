// server/controllers/recommendationController.js
const User = require('../models/User');
const recommendationService = require('../services/recommendationService');

exports.getRecommendations = async (req, res) => {
    try {
        const currentSpotifyId = req.query.id; 

        if (!currentSpotifyId) {
            return res.status(400).json({ error: "ID utilisateur manquant" });
        }

        const currentUser = await User.findOne({ spotifyId: currentSpotifyId });
        if (!currentUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

        // On récupère tout le monde sauf l'utilisateur actuel
        const candidates = await User.find({ spotifyId: { $ne: currentSpotifyId } });

        const recommendations = candidates.map(candidate => {
            const match = recommendationService.calculateCompatibility(currentUser, candidate);
            const scoreNumber = parseFloat(match.percent.replace('%', ''));

            return {
                user: {
                    _id: candidate._id, 
                    
                    user_name: candidate.user_name,
                    profilePicture: candidate.profilePicture,
                    spotifyId: candidate.spotifyId,
                    topArtists: candidate.topArtists ? candidate.topArtists.slice(0, 3) : []
                },
                score: scoreNumber,
                displayScore: match.percent,
                details: match.details
            };
        });

        // Tri par score décroissant
        recommendations.sort((a, b) => b.score - a.score);

        // On renvoie le top 10
        res.json(recommendations.slice(0, 10));

    } catch (error) {
        console.error("Erreur recommendations:", error);
        res.status(500).json({ error: error.message });
    }
};