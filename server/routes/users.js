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

module.exports = router;