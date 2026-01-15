//Route for user-related operations
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');
const recommendationService = require('../services/recommendationService');
const recommendationController = require('../controllers/recommendationController');
const mongoose = require('mongoose');

// Debug route to display compatibility matrix
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

// Route to get user suggestions (3 users not yet followed)
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    const currentUser = await User.findById(currentUserId);
    
    const suggestions = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.following }
    }).limit(3); 

    const formattedSuggestions = suggestions.map(user => ({
      _id: user._id,
      username: user.user_name || "Utilisateur sans nom",
    }));

    res.status(200).json(formattedSuggestions);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route PUT Follow a user
router.put('/:id/follow', async (req, res) => {
  console.log("--- ⚡ DEBUG FOLLOW REQUEST ⚡ ---");
  console.log("1. ID Ami reçu (URL) :", req.params.id);
  console.log("2. Mon ID reçu (Body) :", req.body.userId);

  let userToFollow;
  const targetId = req.params.id;

  try {
      if (mongoose.Types.ObjectId.isValid(targetId)) {
          userToFollow = await User.findById(targetId);
      } 
      
      if (!userToFollow) {
          console.log("   -> Pas un ID Mongo, recherche par spotifyId...");
          userToFollow = await User.findOne({ spotifyId: targetId });
      }

      if (!userToFollow) {
          console.log("ERREUR : Ami introuvable en base.");
          return res.status(404).json("Ami introuvable (ni par ID, ni par SpotifyId)");
      }
      console.log("Ami trouvé :", userToFollow.user_name);


      let currentUser;
      const myId = req.body.userId;

      if (mongoose.Types.ObjectId.isValid(myId)) {
          currentUser = await User.findById(myId);
      }
      if (!currentUser) {
           console.log("   -> Mon ID n'est pas Mongo, recherche par spotifyId...");
           currentUser = await User.findOne({ spotifyId: myId });
      }
      if (!currentUser) {
          console.log("ERREUR : Je suis introuvable en base.");
          return res.status(404).json("Votre profil est introuvable");
      }
      console.log("Je suis trouvé :", currentUser.user_name);
      if (currentUser._id.equals(userToFollow._id)) {
          return res.status(403).json("Vous ne pouvez pas vous suivre vous-même");
      }
      if (!userToFollow.followers.includes(currentUser._id)) {
          await userToFollow.updateOne({ $push: { followers: currentUser._id } });
          await currentUser.updateOne({ $push: { following: userToFollow._id } });
          console.log("SUCCESS : Follow effectué !");
          res.status(200).json("L'utilisateur a été suivi !");
      } else {
          console.log("INFO : Déjà suivi.");
          res.status(403).json("Vous suivez déjà cet utilisateur");
      }

  } catch (err) {
      console.error("🔥 CRASH SERVEUR :", err);
      res.status(500).json({ error: err.message });
  }
});

// Routes for user profile operations
router.get('/:spotifyId', userController.getUserProfile);
router.put('/:spotifyId', userController.updateUserProfile);
router.get('/:spotifyId/now-playing', userController.getUserNowPlaying);

module.exports = router;