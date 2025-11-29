const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Definition de la route GET /api/users/:spotifyId
router.get('/:spotifyId', userController.getUserProfile);
module.exports = router;