const User = require('../models/User'); 
const spotifyService = require('../services/spotifyService');

exports.getUserProfile = async (req, res) => {
  try {
    const { spotifyId } = req.params;
    const user = await User.findOne({ spotifyId }).populate('following', 'user_name _id images');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur getUserProfile:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

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