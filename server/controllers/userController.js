const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try{
        const { spotifyId } = req.params;
        const user = await User.findOne({ spotifyId: spotifyId });
        if(!user){
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error){
        console.error("Erreur lors de la récupération du profil utilisateur:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
