const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get("/", async (req, res) => {

    try {
        const latestPost = await Post.findOne().sort({ createdAt: -1 });

        if (!latestPost) {
            return res.status(404).json({ message: "Pas de post trouvé" });
        }

        res.json(latestPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
})

module.exports = router;