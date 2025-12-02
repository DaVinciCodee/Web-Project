// controllers/recommendationController.js
const User = require('../models/User');
const recommendationService = require('../services/recommendationService');

exports.getRecommendations = async (req, res) => {
    try {
        // 1. Récupérer l'ID de l'utilisateur connecté
        // (Supposons que tu passes l'ID en paramètre d'URL pour l'instant : /api/recommendations?id=thibault)
        const currentSpotifyId = req.query.id; 

        if (!currentSpotifyId) {
            return res.status(400).json({ error: "ID utilisateur manquant" });
        }

        const currentUser = await User.findOne({ spotifyId: currentSpotifyId });
        if (!currentUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

        // 2. Récupérer les candidats (Tout le monde sauf moi)
        const candidates = await User.find({ spotifyId: { $ne: currentSpotifyId } });

        // 3. Calculer les scores
        const recommendations = candidates.map(candidate => {
            const match = recommendationService.calculateCompatibility(currentUser, candidate);
            
            // On nettoie le "%" pour pouvoir trier (ex: "85%" -> 85)
            const scoreNumber = parseFloat(match.percent.replace('%', ''));

            return {
                user: {
                    user_name: candidate.user_name,
                    profilePicture: candidate.profilePicture,
                    spotifyId: candidate.spotifyId,
                    // On peut renvoyer les artistes en commun pour l'affichage
                    topArtists: candidate.topArtists.slice(0, 3) 
                },
                score: scoreNumber,        // Pour le tri (nombre)
                displayScore: match.percent, // Pour l'affichage (string)
                details: match.details     // Détails (Genre, Artiste, Tracks)
            };
        });

        // 4. Trier par score décroissant (Le plus haut en premier)
        recommendations.sort((a, b) => b.score - a.score);

        // 5. Renvoyer le Top 10
        res.json(recommendations.slice(0, 10));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};