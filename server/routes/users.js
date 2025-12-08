const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Definition de la route GET /api/users/:spotifyId
router.get('/:spotifyId', userController.getUserProfile);
router.put('/:spotifyId', userController.updateUserProfile);
router.get('/:spotifyId/now-playing', userController.getUserNowPlaying);
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!userToFollow.followers.includes(req.body.userId)) {
        await userToFollow.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        
        res.status(200).json("L'utilisateur a été suivi !");
      } else {
        res.status(403).json("Tu suis déjà cet utilisateur");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Tu ne peux pas te suivre toi-même (triste, je sais)");
  }
});
// GET /api/users/suggestions/:userId
// Récupère des utilisateurs à suivre (sauf soi-même et ceux qu'on suit déjà)
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    const currentUser = await User.findById(currentUserId);

    // On cherche tous les users qui ne sont PAS moi ("$ne" = Not Equal)
    // Et qui ne sont pas déjà dans mes abonnements ("$nin" = Not In)
    const suggestions = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.following }
    }).limit(3); // On en prend juste 3 pour l'instant

    // On renvoie une liste simplifiée (juste ID, nom, image)
    const formattedSuggestions = suggestions.map(user => ({
      _id: user._id,
      username: user.user_name || "Utilisateur sans nom",
      // Ajoute d'autres champs si besoin (image...)
    }));

    res.status(200).json(formattedSuggestions);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;