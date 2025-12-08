const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');
const recommendationService = require('../services/recommendationService');
const recommendationController = require('../controllers/recommendationController');

router.get('/debug-matrix', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length < 2) return res.send("Il faut au moins 2 utilisateurs.");

    let results = [];

    for (let i = 0; i < users.length; i++) {
      let myResult = { user: users[i].user_name, matches: [] };
      
      for (let j = 0; j < users.length; j++) {
        if (users[i].spotifyId !== users[j].spotifyId) {
          
          // APPEL DE LA NOUVELLE FONCTION
          const match = recommendationService.calculateCompatibility(users[i], users[j]);
          
          myResult.matches.push({
            with: users[j].user_name,
            score: match.percent,
            details: match.details
          });
        }
      }
      results.push(myResult);
    }
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/recommendations', recommendationController.getRecommendations);

router.get('/:spotifyId', userController.getUserProfile);
router.put('/:spotifyId', userController.updateUserProfile);
router.get('/:spotifyId/now-playing', userController.getUserNowPlaying);
<<<<<<< HEAD

=======
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
>>>>>>> b1bd565 (caca)
module.exports = router;