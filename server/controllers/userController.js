// server/controllers/userController.js
const User = require('../models/User'); // Assure-toi que le chemin est bon (User.js avec majuscule ?)
const spotifyService = require('../services/spotifyService');
// 1. Fonction pour récupérer le profil (GET)
exports.getUserProfile = async (req, res) => {
  try {
    const { spotifyId } = req.params;
    const user = await User.findOne({ spotifyId });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur getUserProfile:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 2. Fonction pour mettre à jour le profil (PUT)
exports.updateUserProfile = async (req, res) => {
  try {
    const { spotifyId } = req.params;
    const { bio, user_name } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { spotifyId: spotifyId },
      { $set: { bio: bio, user_name: user_name } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur updateUserProfile:", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour." });
  }
};

exports.getUserNowPlaying = async (req, res) => {
    try {
        const { spotifyId } = req.params;
        const user = await User.findOne({ spotifyId });
        if(!user){
            return res.status(404).json({message: 'Utilisateur non trouvé'});
        }
        const nowPlaying = await spotifyService.getNowPlaying(user.accessToken);
        res.json(nowPlaying);
    } catch (error) {
        console.error("Erreur getUserNowPlaying:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération de la lecture en cours." });
    }
};