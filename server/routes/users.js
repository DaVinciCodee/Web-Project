const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Definition de la route GET /api/users/:spotifyId
router.get('/:spotifyId', userController.getUserProfile);
router.put('/:spotifyId', userController.updateUserProfile);
router.get('/:spotifyId/now-playing', userController.getUserNowPlaying);
module.exports = router;