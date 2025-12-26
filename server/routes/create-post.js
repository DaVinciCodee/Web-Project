const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');

router.post('/create/', async (req, res) => {

    try {
        const { content, userId } = req.body;

        if (!content || !userId) {
            return res.status(400).json({ message: "Données manquantes" });
        }

        const user = await User.findOne({ spotifyId: userId });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const post = await Post.create({
            postId: new mongoose.Types.ObjectId().toString(),
            postUserName: user.user_name,
            postContent: content,
        });

        res.status(201).json(post);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
})

module.exports = router;