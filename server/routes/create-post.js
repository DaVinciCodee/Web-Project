const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/create/', async (req, res) => {

    const data = req.json();
    const userId = data.userId;
    const content = data.content;

})

module.exports = router;