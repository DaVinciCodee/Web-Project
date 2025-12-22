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

// J'ai remonté cette route ICI pour qu'elle ne soit pas écrasée par /:spotifyId
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    const currentUser = await User.findById(currentUserId);
    
    // On cherche 3 utilisateurs qu'on ne suit pas encore
    const suggestions = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.following }
    }).limit(3); 

    const formattedSuggestions = suggestions.map(user => ({
      _id: user._id,
      username: user.user_name || "Utilisateur sans nom",
      // Tu peux ajouter l'image ici si tu veux
    }));

    res.status(200).json(formattedSuggestions);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route PUT Follow (Spécifique avec l'ID en paramètre)
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
    res.status(403).json("Tu ne peux pas te suivre toi-même");
  }
});

// 2. Routes dynamiques générales (EN DERNIER)
// Attention : :spotifyId capture tout ce qui n'est pas défini avant
router.get('/:spotifyId', userController.getUserProfile);
router.put('/:spotifyId', userController.updateUserProfile);
router.get('/:spotifyId/now-playing', userController.getUserNowPlaying);

module.exports = router;